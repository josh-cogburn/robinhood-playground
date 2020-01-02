import React, { Component } from 'react';
import TradingViewWidget from 'react-tradingview-widget';


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
    selectedCollection: undefined
  }
  collectionChange = (evt) => {
    this.setState({
      selectedCollection: evt.target.value
    });
  }
  render() {
    const { collections, lastCollectionRefresh } = this.props;
    const derivedCollections = Object.keys(collections).slice(10);
    const { selectedCollection = derivedCollections[0] } = this.state;
    const derived = derivedCollections.map(collectionName => ({
      collectionName,
      tickers: collections[collectionName]
    }));
    console.log({ derivedCollections, selectedCollection})
    const showingTickers = collections[selectedCollection];
    return (
      <div style={{ textAlign: 'center', padding: '1em' }}>
        <h3>{`updated: ${(new Date(lastCollectionRefresh)).toLocaleString()}`}</h3>
        <select onChange={this.collectionChange} style={{ margin: '10px 0' }}>
          {derivedCollections.map(key => (
            <option value={key}>{key}</option>
          ))}
        </select>
        <pre>
          {
            Object.keys(words)
              .filter(word => selectedCollection.includes(word))
              .map(word => words[word])
              .join(', ')
          }
        </pre>
        <div style={{ display: 'flex', flexFlow: 'wrap', justifyContent: 'space-around' }}>
          {
            showingTickers.map(ticker => (
              <div style={{ margin: '10px' }}>
                <TradingViewWidget 
                  symbol={ticker} 
                  range='5d' 
                  style='8' 
                  width={800}
                  height={500} 
                />
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default Derived;