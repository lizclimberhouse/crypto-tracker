class Api::CoinsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_coin, only: [:show, :update, :destroy]
  BASE_URL = 'https://api.coinmarketcap.com/v1/ticker/' # is the base url for my external api

  def index
    # this whole process is updating the users coins with the currnet price from the api. pulls the users coins and if a coin matches then update the price in usd. and return the coin.
    coins = HTTParty.get(BASE_URL) # this will bring back the top 100 coins in an array
    user_coins = current_user.coins
    user_coins.each do |coin|
      res_coin = coins.find { |c| c['id'] == coin.cmc_id }
      coin.update(price: res_coin['price_usd']) if res_coin 
    end 
    render json: current_user.coins # if we don't authenticate_user before then we cant user current_user. it is a built in devise function
  end

  def create
    cmc_id = params[:coin].downcase
    res = HTTParty.get("#{BASE_URL}#{cmc_id}") #to our 3rd party and ask if this coin exisits
    if coin = Coin.create_by_cmc_id(res) # then create a coin in our DB if we found that this coin exisits
      #if this response comes back as a truthy - then set the res to coin
      # if it does exist then create the coin with the coin_id = coin_id, user_id etc,
      watched = WatchedCoin.find_or_create_by(
        coin_id: coin.id,
        user_id: current_user.id
      )
      # then only create an initial price if there isn't already one, if we are already wathing this coin do not update the initial price.
      watched.update(initial_price: coin.price) if watched.initial_price.nil? #only update it if it doenst have an initial price
      render json: coin
      # ^^^ important!!: this is the solution that refreshes your table without refreshing your page.
    else # if the response is nill of falsy then send error that the coin doesn't exist
      render json: { errors: 'Coin Not Found' }, status: 422
    end
    #find out if the coin exisit in CMC
    #create a coin in our database (or find it)
    #create a watched_coin record
    #render back the coin
  end

  def show
    render json: @coins
  end

  # PUT /api/coins/:id
  #we are actually going to use this to stop watching coins, that way we don;t need to create a whole other controller just to watch coins
  # therefore we're going to hyjack this contoller for this reason.
  def update
    # good to leave a comment here explaining what this is doing since we divedated from the norm.
    current_user
      .watched_coins
      .find_by(coin_id: @coin.id)
      .destroy
  end

  def destroy
  end
end
