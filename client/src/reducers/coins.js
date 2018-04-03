import {
  COINS,
  ADD_COIN,
  REMOVE_COIN,
} from '../actions/coins';

const coins = ( state = [], action ) => {
  switch (action.type) {
    case COINS:
      //our payload looks like: { type: 'COINS', coins: [{...}, {...}] } need to take this array and make it our new state
      return action.coins
    case ADD_COIN:
      //payload looks like: { type: 'ADD_COIN', coin: {...} }
      return [...state, action.coin] // return what we already have in the store plus this boject 'coin'
    case REMOVE_COIN:
      //payload looks like: { type: 'REMOVE_COIN', id: 7 }
      return state.filter( c => c.id !== action.id ) //return state exect where the id matches teh removed coin id
    default:
      return state
  }
}

export default coins;