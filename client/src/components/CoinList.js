import React from 'react';
import { connect } from 'react-redux';
import { 
  Table, 
  Header, 
  Divider 
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getCoins } from '../actions/coins';

class CoinList extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getCoins())
    this.ticker = setInterval( () => {
      dispatch(getCoins())
    }, 60000)
    // setInterval is a global thing, so this will keep the interval going even if you switch to a differnet page. So I have access to it throughtout the component.
    // this.props.dispatch(getCoins())
  }

  componentWillUnmount() {
    clearInterval(this.ticker)
    //but here it will remove the interval before it swtches to another page
  }

  render() {
    const { coins } = this.props;
    return (
      <div>
        <Divider />
        <Table celled striped>
          <Table.Header>
            { ['Symbol', 'Name', 'Price']
                .map( h =>
                  <Table.HeaderCell key={h}>
                    {h}
                  </Table.HeaderCell>
                )
            }
          </Table.Header>
          <Table.Body>
            { coins.map( coin => {
                const { price, name, symbol, id, cmc_id } = coin
                return (
                  <Table.Row key={id}>
                    <Table.Cell>
                      <Link to={`/coins/${cmc_id}`}>
                        { symbol }
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      { name }
                    </Table.Cell>
                    <Table.Cell>
                      ${ price }
                    </Table.Cell>
                  </Table.Row>
                )
              })
            }
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { coins: state.coins }
}

export default connect(mapStateToProps)(CoinList);


// h => is just refering to the text ['Symbol', 'Name', ...etc] just looping through these and make a header cell for each one.
// for each coin we'll make a row.
