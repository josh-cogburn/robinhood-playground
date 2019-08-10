import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import ReactModal from 'react-modal';
import PickGraphs from '../components/PickGraphs';


import { pick } from 'underscore';

// import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
// import "mdbreact/dist/css/mdb.css";

// import getTrend from '../utils/get-trend';
import { avgArray } from '../utils/array-math';

// import Pick from '../components/Pick';
// import TrendPerc from '../components/TrendPerc';

class Scan extends Component {
  state = {};
  shouldComponentUpdate(nextProps, nextState) {
    console.log({
      nextProps,
      CUR: this.props
    })

    return JSON.stringify(this.state) != JSON.stringify(nextState);
  }
  selectPick = pick => {
    console.log({ pick });
    this.setState({
      displayingPick: pick
    })
  }
  componentDidMount() {
    
  }
  scan = () => {
    console.log(
      'SCAN',
      this.selectRef.value
    );

    this.props.socket.on('server:scan-results', ({ results }) => {
      this.setState({
        results: results
          .filter(({ strategyName }) => {
            console.log({ strategyName })
            return strategyName !== 'baseline';
          })
          .map(pick => ({
            details: <button onClick={() => this.selectPick(pick)}>details</button>,
            strategyName: pick.strategyName,
            keys: Object.keys(pick.keys).filter(key => pick.keys[key]),
            ticker: pick.ticker,
            k: Object.keys(pick)
          }))
          .filter(({ keys }) => keys.every(k => !k.toLowerCase().includes("bear")))
      })
    });
    this.props.socket.emit(
      'client:run-scan', 
      { period: this.selectRef.value }
    );
  };
  render() {
    return (
      <div>
        <h2>Scan</h2>
        <select ref={ref => { this.selectRef = ref }}>
          {
            [5, 10, 30, 'd'].map(value => (
              <option value={value}>{value}</option>
            ))
          }
        </select>
        <button onClick={this.scan}>Scan</button>

        {
          this.state.results && (
            // <code>
            //   { JSON.stringify({rows: this.state.results}, null, 2)}
            // </code>
            <MDBDataTable data={{
              rows: this.state.results
            }} />
          )
        }

        <ReactModal isOpen={!!this.state.displayingPick}>
            <button
                onClick={() => this.selectPick(null)}
                style={{
                    position: 'fixed',
                    zoom: '250%',
                    top: '1vh',
                    left: '1vh',
                }}>
                    Close Modal
            </button>
              {this.state.displayingPick && <PickGraphs pick={this.state.displayingPick} socket={this.props.socket} /> }
        </ReactModal>
      </div>
    );
      
  }
}

export default Scan;