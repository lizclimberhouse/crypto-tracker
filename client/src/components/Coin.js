import React, { Fragment } from 'react';
import { Grid, Card, Header, Divider, Container, Segment } from 'semantic-ui-react';
import axios from 'axios';
import { connect } from 'react-redux'; // still need this to pass the headers
import { setHeaders } from '../actions/headers';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, } from 'recharts';


class Coin extends React.Component {
  state = { coin: {} }

  // becuase I dont need this axios in my redux, I just call the axios here instead of in the action.js file
  componentDidMount() {
    const { dispatch, match: { params: { id }}} = this.props;
    axios.get(`/api/coins/${id}`)
      .then(({ data, headers }) => {
        dispatch(setHeaders(headers))
        this.setState({ coin: data })
      })
  }

  calcPrice = (price, change) => {
    let c = parseFloat(change)
    let p = parseFloat(price)
    if (c < 0) 
      return p * (Math.abs((c / 100)) + 1)
    else 
      return p / ((c / 100) + 1)
  }

  formatData = () => {
    const { coin } = this.state;
    const { price_usd, percent_change_7d, percent_change_24h, percent_change_1h, } = coin;
    return [
      { 
        time: '7 days', 
        price: this.calcPrice(price_usd, percent_change_7d) 
      },
      { time: '24 hours', price: this.calcPrice(price_usd, percent_change_24h) },
      { time: '1 hour', price: this.calcPrice(price_usd, percent_change_1h) },
      { time: 'Current', price: parseFloat(price_usd) },
    ]
  }

  render() {
    const { coin } = this.state;
    return (
      <Container>
        <Divider hidden />
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={6}>
              <Card>
                <Card.Content header={coin.name} />
                <Card.Content description={`$${coin.price_usd}`} />
                <Card.Content description={`${coin.price_btc} BTC`} />
                <Card.Content extra>
                  <p>Rank: {coin.rank}</p>
                  <p>Symbol: {coin.symbol}</p>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={10}>
              <Header as="h1">
                {coin.name} Historical data
              </Header>
              <AreaChart height={400} width={800} data={this.formatData()}>
                <XAxis dataKey="time" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="price" stroke="#8884D8" fill="8884d8" />
              </AreaChart>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

export default connect()(Coin);
