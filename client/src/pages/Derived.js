import React, { Component } from 'react';
import TradingViewWidget from 'react-tradingview-widget';
import TrendPerc from '../components/TrendPerc';

import './Derived.css';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const getShortDescription = description => 
  description.substring(
    0,
    description.indexOf('.', 35) + 1
  );

const words = {

  // daily RSI
  realChill: 'daily RSI below 40',
  chill: 'daily RSI below 70',
  unfiltered: 'any daily RSI is allowed',

  Volume: 'volume considerably above their average',
  Nowhere: 'have not made a strong move in either direction in the last 24 hours',
  Mover: 'the biggest gainers',
  SlightlyUpVolume: 'moved in a slightly bullish direction on the day',
  SlightDownVolume: 'moved in a slightly bearish direction on the day',
  // ''
}

class Derived extends Component {
  state = {
    selectedCollection: undefined,
    widgetWidth: 800
  }
  collectionChange = (evt) => {
    this.setState({
      selectedCollection: evt.target.value
    });
  }
  calcWidgetWidth() {
    const { innerWidth } = window;
    const widgetWidth = Math.min(800, innerWidth - 30);
    this.setState({
      widgetWidth,
      widgetHeight: widgetWidth * .75
    });
  }
  componentWillMount() {
    this.calcWidgetWidth();
  }
  componentDidMount() {
    window.addEventListener('resize', () => {
      console.log('resize');
      this.calcWidgetWidth();
    });
  }
  render() {
    const { derivedCollections, lastCollectionRefresh } = this.props;
    const derivedCollectionNames = Object.keys(derivedCollections).reverse();
    const { selectedCollection = derivedCollectionNames[0], widgetWidth, widgetHeight } = this.state;
    // const derived = derivedCollections.map(collectionName => ({
    //   collectionName,
    //   tickers: collections[collectionName]
    // }));
    console.log({ derivedCollectionNames, selectedCollection})
    const showingResults = derivedCollections[selectedCollection];
    return (
      <div style={{ textAlign: 'center', padding: '1em' }}>
        <h4>{`updated: ${(new Date(lastCollectionRefresh)).toLocaleString()}`}</h4>
        <select onChange={this.collectionChange} style={{ margin: '10px 0' }}>
          {derivedCollectionNames.map(key => (
            <option value={key}>{key}</option>
          ))}
        </select>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {
            Object.keys(words)
              .filter(word => selectedCollection.includes(word))
              .map(word => words[word])
              .join(', ')
          }
        </pre>
        <div style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around' }}>
          {
            showingResults.map(result => (
              <div style={{ margin: '10px', width: widgetWidth + 'px' }}>
                <TradingViewWidget 
                  symbol={result.ticker} 
                  range='5d' 
                  style='8' 
                  width={widgetWidth}
                  height={widgetHeight} 
                />
                <div className='stock-info'>
                  <div>
                    <h4>Volume</h4>
                    <table>
                      <tr>
                        <td>actual</td>
                        <td>{numberWithCommas(result.computed.actualVolume)}</td>
                      </tr>
                      <tr>
                        <td>projected by eod</td>
                        <td>{numberWithCommas(Math.round(result.computed.projectedVolume))}</td>
                      </tr>
                      <tr>
                        <td>projected to two-week avg</td>
                        <td>
                          <TrendPerc 
                            value={result.computed.projectedVolumeTo2WeekAvg} 
                            redAt={100}
                            noPlus={true} 
                            round={true} />
                        </td>
                      </tr>
                      <tr>
                        <td>today's estimated dollar</td>
                        <td>${numberWithCommas(result.computed.dollarVolume)}</td>
                      </tr>
                    </table>
                  </div>
                  <div>
                    <h4>Trends</h4>
                    <table>
                      <tr>
                        <td>since open</td>
                        <td><TrendPerc value={result.computed.tso} /></td>
                      </tr>
                      <tr>
                        <td>since close</td>
                        <td><TrendPerc value={result.computed.tsc} /></td>
                      </tr>
                      <tr>
                        <td>since high of day</td>
                        <td><TrendPerc value={result.computed.tsh} /></td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div className='stock-description'>
                  <span style={{ float: 'left' }}>StockTwits Sentiment:</span>
                  <table>
                    <thead>
                      <th>Bullish</th>
                      <th>Bearish</th>
                      <th>Score</th>
                      <th>Bracket</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{result.stSent.bullishCount}</td>
                        <td>{result.stSent.bearishCount}</td>
                        <td>{result.stSent.bullBearScore}</td>
                        <td>{result.stSent.stBracket}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className='stock-description'>
                  {getShortDescription(result.fundamentals.description)}
                </div>
                {/* <pre>
                  {JSON.stringify(result, null, 2)}
                </pre> */}
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default Derived;