import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import graphs from './graphs';
import { pick as pickProp } from 'underscore';

import * as ChartAnnotation from 'chartjs-plugin-annotation';

const annotateBox = ({ bidPrice, askPrice }) => ({
  type: 'box',

  // optional drawTime to control layering, overrides global drawTime setting
  drawTime: 'beforeDatasetsDraw',

  // optional annotation ID (must be unique)
  id: `a-box-${bidPrice}-${askPrice}`,

  // ID of the X scale to bind onto
  xScaleID: 'x-axis-0',
  yScaleID: 'y-axis-0',

  // Left edge of the box. in units along the x axis
  yMin: bidPrice,

  // Right edge of the box
  yMax: askPrice,

  // Top edge of the box in units along the y axis
  // yMax: 20,

  // Bottom edge of the box
  // yMin:  2,

  // Stroke color
  // borderColor: 'red',

  // Stroke width
  borderWidth: 0,

  // Fill color
  backgroundColor: 'yellow',
});


const Graph = ({ title, data, dataProp, dataFn, }) => {
  const values = data[dataProp];
  if (!values) return null;

  const annotations = title === 'Current prices' && data.curQuote ? [annotateBox(data.curQuote)] : [];
  return (
    <div>
      <h2>{title}</h2>
      <Line
        plugins={[ChartAnnotation]}
        data={dataFn(data)}
        options={{
          annotation: {
            annotations
          }
        }}
        />
    </div>
  )
};

export default class PickGraphs extends Component {
  state = {
    quoteChain: []
  };
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
    const { pick, socket } = this.props;
    if (pick && !pick.data) {
      this.loadStScoreForPick(pick);
      setTimeout(() => this.loadDataForPick(pick), 500);
    }

    const ticker = pick.ticker || pick.withPrices[0].ticker;

    socket.emit('historicals', ticker, 1, historicals => {
      this.setState({
        oneMinuteHistoricals: historicals
      });
      console.log({ historicals })
    })

    let lookupTicker;
    (lookupTicker = () => {
      if (this.unmounted) return;
      socket.emit('lookup', ticker, quote => {
        this.setState(({ quoteChain }) => ({
          quoteChain: [...quoteChain, {
            ...quote,
            timestamp: Date.now()
          }]
        }));
        setTimeout(() => lookupTicker(), 2000);
      });
    })()
    
  }
  componentWillUnmount() {
    this.unmounted = true;
  }
  render() {
    const { pick, socket, positions } = this.props;
    if (!pick) return null;
    const { fetchedData, stScore, quote, quoteChain } = this.state;
    const [pickTrend] = pick.withTrend;
    let data = pick.data || fetchedData;
    if (!data) return null;
    const withData = {
      ...pick,
      data
    };
    console.log({ data, quoteChain });

    const ticker = pick.ticker || pick.withPrices[0].ticker;
    console.log({ positions })
    const position = positions.alpaca.find(pos => pos.ticker === ticker) || {};
    const curQuote = {
      ...quoteChain[quoteChain.length - 1],
      count: quoteChain.length
    }

    const finalCurrents = [
      ...data.allPrices,
      ...quoteChain
    ];

    return (
      <div>
        <h3>Strategy: {pick.strategyName || pick.stratMin}</h3>
        <h3>Ticker: {ticker}</h3>
        { data && data.period && <h3>Period: {data.period}</h3> }
        <hr/>
        <h3>{JSON.stringify(pickTrend)}</h3>
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
        <h3>Quote: {JSON.stringify(pickProp(curQuote, ['currentPrice', 'askPrice', 'bidPrice', 'count']))}</h3>
        {
          data ? (
            <div>
                {
                  graphs.map(props => 
                    <Graph {...props} data={{
                      ...data,
                      finalCurrents,
                      curQuote
                    }}  />
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