import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


const defaultValue = `
  function trendFilter(trend) {
    return trend.sort((a, b) => a.trendSinceOpen )
  }
`

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          <textarea style={{width: '80%', height: '500px'}} /><br/>
          <button style={{ fontSize: '200%'}}>Run strategy!</button>
        </p>
      </div>
    );
  }
}

export default App;
