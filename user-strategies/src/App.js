import socketIOClient from "socket.io-client";
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


import lastTrend from './lastTrend';

import getTrend from './utils/get-trend';

import * as mostPop from './100-most-popular';
const firstObj = lastTrend[0];
delete firstObj.historicals;
const str = JSON.stringify(firstObj, null, 2);
const withComments = str.split('\n').map(l => `// ${l}`).join('\n');
const defaultStrategyString = [
  withComments,
  '',
  `function trendFilter(trend) {
    return trend
      .sort((a, b) => b.trendSinceOpen - a.trendSinceOpen)[0].ticker
  }`
].join('\n');

const objMap = (obj, fn) => obj 
  ? Object.keys(obj).reduce((acc, key) => ({ 
    ...acc, 
    [key]: fn(obj[key], key)
  }), {})
  : {};


const ResultsTable = ({ data }) => {
  if (!Object.keys(data).length) return null;
  return (
    <table className="blueTable">
      <thead>
        <tr>
          <th>run-time</th>
          <th>ticker</th>
          <th>thenPrice</th>
          <th>nowPrice</th>
          <th>trend %</th>
        </tr>
      </thead>
      <tbody>
        {
          Object.keys(data).map(key => {
            const row = data[key];
            return (
              <tr>
                <td>{key}</td>
                <td>{row.ticker}</td>
                <td>{row.thenPrice}</td>
                <td>{row.nowPrice}</td>
                <td>{row.trend}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
};

console.log(mostPop);
class App extends Component {
  state = {};
  textarea = null;
  socket = null;
  componentDidMount() {
    let { origin: endPoint } = window.location;
    this.socket = socketIOClient('http://192.227.186.138:3000');
    // this.socket = socketIOClient('http://localhost:3000');
    this.socket.on('server:current-prices', data => {
      console.log(data, 'current');
      this.setState({ currentPrices: data });
    });
  }
  runStrategy = () => {
    let fnForm;
    try {
      fnForm = eval(`(${this.textarea.value})`);
    } catch (e) {
      console.log('error');
      return;
    }
    
    console.log({mostPop});

    const results = objMap(mostPop, val => fnForm(val));

    const allTickers = Object.keys(results).map(key => results[key]);
    this.socket.emit('get-current-prices', allTickers);

    console.log({results});

    const withObjs = objMap(results, val => lastTrend.find(t => t.ticker === val));
    
    console.log(
      {withObjs}
    );

    this.setState({ results: withObjs });

    // console.log(lastTrend, this.textarea.value, this.textarea);
  }
  render() {
    const { results, currentPrices } = this.state;
    const resultsWithThenPrice = objMap(results, trendObj => ({
      ticker: trendObj.ticker,
      thenPrice: trendObj.quote_data.lastTrade,
    }));
    const resultsWithNowPrice = objMap(resultsWithThenPrice, data => {
      const nowPrices = (currentPrices || {})[data.ticker] || {};
      console.log(nowPrices, data.ticker, data, currentPrices);
      return {
        ...data,
        nowPrice: nowPrices.afterHoursPrice || nowPrices.lastTradePrice,
      };
    });
    const resultsData = objMap(resultsWithNowPrice, data => ({
      ...data,
      trend: getTrend(data.nowPrice, data.thenPrice)
    }));
    console.log({ resultsData })
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Run a strategy against the top 100 stocks trending on Robinhood</h1>
        </header>
        <p className="App-intro">
          <textarea 
            style={{width: '60%', height: '200px'}} 
            ref={ref => { this.textarea = ref;}}
            defaultValue={defaultStrategyString}
            />
          <br/>
          <button style={{ width: '60%', fontSize: '200%'}} onClick={this.runStrategy}>Run strategy!</button>
          <ResultsTable data={resultsData} />
          {/* <textarea value={JSON.stringify(resultsData, null, 2)} />
          <code>
            {JSON.stringify(currentPrices, null, 2)}
          </code> */}
        </p>
      </div>
    );
  }
}

export default App;
