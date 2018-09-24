import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


import lastTrend from './lastTrend';

const firstObj = lastTrend[0];
const str = JSON.stringify(firstObj, null, 2);
const withComments = str.split('\n').map(l => `// ${l}`).join('\n');
const defaultStrategyString = [
  withComments,
  `function trendFilter(trend) {
    return trend
      .sort((a, b) => b.trendSinceOpen - a.trendSinceOpen)[0].ticker
  }`
].join('\n');



class App extends Component {
  textarea = null;
  runStrategy = () => {
    const fnForm = eval(`(${this.textarea.value})`);
    const result = fnForm(lastTrend);

    console.log(
      lastTrend.find(t => t.ticker === result)
    );

    // console.log(lastTrend, this.textarea.value, this.textarea);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <textarea 
            style={{width: '60%', height: '200px'}} 
            ref={ref => { this.textarea = ref;}}
            defaultValue={defaultStrategyString}
            />
          <br/>
          <button style={{ fontSize: '200%'}} onClick={this.runStrategy}>Run strategy!</button>
        </p>
      </div>
    );
  }
}

export default App;
