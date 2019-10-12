import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import graphs from './graphs';
import { pick as pickProp } from 'underscore';

const Graph = ({ title, data, dataProp, dataFn }) => {
  const values = data[dataProp];
  if (!values) return null;
  return (
    <div>
      <h2>{title}</h2>
      <Line data={dataFn(data)} />
    </div>
  )
};

export default class PickGraphs extends Component {
  state = {};
  loadDataForPick(pick) {
    console.log(`getting picks data for ${pick._id}`);
    this.props.socket.emit('getPickData', pick._id, data => {
        console.log(`got picks data`, data);
        this.setState({
          fetchedData: data
        });
    });
  }
  loadStScoreForPick(pick) {
    const ticker = pick.withPrices[0].ticker;
    this.props.socket.emit('getStScore', ticker, data => {
      console.log(`got st score`, data);
      this.setState({
        stScore: data
      });
    });
  }
  componentDidMount() {
    const { pick } = this.props;
    if (this.props.pick && !this.props.pick.data) {
      this.loadStScoreForPick(this.props.pick);
      setTimeout(() => this.loadDataForPick(this.props.pick), 500);
    }

    const ticker = pick.ticker || pick.withPrices[0].ticker;

    let lookupTicker;
    (lookupTicker = () => {
      this.props.socket.emit('lookup', ticker, quote => {
        this.setState({ quote });
        setTimeout(() => lookupTicker, 2000);
      });
    })()
    
  }
  render() {
    const { pick, socket, positions } = this.props;
    const { fetchedData, stScore, quote } = this.state;
    const data = pick.data || fetchedData;
    const withData = {
      ...pick,
      data
    };
    console.log({ data });

    const ticker = pick.ticker || pick.withPrices[0].ticker;
    console.log({ positions })
    const position = positions.alpaca.find(pos => pos.ticker === ticker) || {};
    return (
      <div>
        <h3>Strategy: {pick.strategyName || pick.stratMin}</h3>
        <h3>Ticker: {ticker}</h3>
        { data && data.period && <h3>Period: {data.period}</h3> }
        <hr/>
        {
          stScore
            ? <h3>Stocktwits Sentiment: {JSON.stringify(stScore, null, 2)}</h3>
            : <button onClick={() => this.loadStScoreForPick(pick)}>Load Stocktwits Score</button>
        }
        {
          position && (
            <h3>Position: {JSON.stringify(pickProp(position, ['average_buy_price', 'currentPrice', 'returnDollars', 'returnPerc', 'equity']))}</h3>
          )
        }
        <h2>Quote: {JSON.stringify(quote)}</h2>
        {
          data ? (
            <div>
                {
                  graphs.map(props => 
                    <Graph {...props} data={data} />
                  )
                }
            </div>
          ) : (
            <div>
              <button onClick={() => this.loadDataForPick(pick)}>
                Load data for pick
              </button>
            </div>
          )
        }
        <pre>{JSON.stringify(withData, null, 2)}</pre>
      </div>
    );
  }
}