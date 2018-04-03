class Coin < ApplicationRecord
  validates_uniqueness_of :cmc_id, :name, :symbol, { case_sensitive: false }
  validates_presence_of :cmc_id, :name, :symbol

  has_many :watched_coins, dependent: :destroy 
  has_many :users, through: :watched_coins

  # Coin.create_by_cmc_id(res)  this is now we called it in the controller.
  # So when we define it we replace the Coin with self.
  def self.create_by_cmc_id(res)
    #if its a real coin or not. else, return nil, but if I remove else and nil it would still return nil. Keeping it reads better and is explicit in what we;re trying to do.
    if /^2\d\d$/ =~ res.code.to_s # as long as I have a response code in the 200's then I have a match. "regular expression"  starts with 2 and has two more digits and ends "$"
      match = res[0].with_indifferent_access #alows for either res[:id] or res['id']
      coin_params = {
        name: match[:name], 
        symbol: match[:symbol], 
        cmc_id: match[:id]
      } #no trialing commas in ruby.
      # now see if a coin exisits in our database with these three things, if so find it, if not create it iwth them., and also update the price and the last_fetched

      Coin.find_or_create_by(coin_params) do |coin|
        coin.price = match[:price_usd]
        coin.last_fetched = DateTime.now
      #this will return our coin back to our controller.
    else
      nil
    end
  end
  end
end

# this is the server side validation. Therefore if one of these things is missing, then it wont save.
# will need to also do client side validation (aka "required") important to do both