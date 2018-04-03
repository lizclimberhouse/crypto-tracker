import axios from 'axios';
export const COINS = 'COINS';
export const ADD_COIN = 'ADD_COIN';
export const REMOVE_COIN = 'REMOVE_COIN';

// #we should be able to:
// #get all the coins
// #create a coin
// #stop watching a coin

//dispatch(getCoins()) we can only dispatch a plaon js object such as:
//dispatch( { type: 'TEST, payload: 'hello' })
export const getCoins = () => {
  return (dispatch) => {
    axios.get('/api/coins')
      .then( ({ data: coins, headers }) => 
        dispatch({ type: COINS, coins, headers })
        // ususaly this looks like :  .then( (res) => .... coins: coins, headers: headers)
      )
  }
}

export const addCoin = (coin) => {
  return (dispatch) => {
  axios.post('/api/coins', { coin })
    .then( ({ data: coin, headers }) =>
      dispatch({ type: ADD_COIN, coin, headers })
    )
  }
}

// remember this is the update!
export const removeCoin = (id) => {
  return (dispatch) => {
    axios.put(`/api/coins/${id}`)
      .then( ({ headers }) =>
        dispatch({ type: REMOVE_COIN, id, headers })
      )
  }
}

// already know what the actions are sending the reducer...coin coins id, so writing the reducers should be pretty easy now.