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
  state = { 
    loading: {},
    stSent: {},
  };
  shouldComponentUpdate(nextProps, nextState) {
    console.log({
      nextProps,
      CUR: this.props
    });

    return JSON.stringify(this.state) != JSON.stringify(nextState);
  }
  selectPick = pick => {
    console.log({ pick });
    this.setState({
      displayingPick: pick
    })
  }

  getSingleSt = ticker => {
    return new Promise(resolve => {
      this.props.socket.emit('getStScore', ticker, data => resolve(data.bullBearScore));
    });
  }
  getAllStSent = async tickers => {
    for (let ticker of tickers) {
      const score = await this.getSingleSt(ticker);
      this.setState(({ stSent }) => ({
        stSent: {
          ...stSent,
          [ticker]: score
        }
      }));
    }
  }

  componentDidMount() {
  }

  scan = () => {
    console.log(
      'SCAN',
      this.selectRef.value
    );
    const period = this.selectRef ? this.selectRef.value : undefined;
    if (period.includes('penny')) {
      const whichPenny = period.split('penny-')[1];
      console.log({ whichPenny })
      return this.pennyScan(whichPenny);
    }
    this.props.socket.on('server:scan-results', ({ results }) => {
      console.log('scan results', results)
      const allTickers = [...new Set(results.map(result => result.ticker))];
      console.log({ allTickers });
      this.getAllStSent(allTickers);

      this.setState(({ loading }) => ({
        loading: {
          ...loading,
          [period]: false
        },
        results: results
          .map(pick => ({
            details: <button onClick={() => this.selectPick(pick)}>details</button>,
            ticker: pick.ticker,
            strategyName: pick.strategyName,
            keys: pick.keys,
            // k: Object.keys(pick)
          }))
      }));
    });
    this.setState(({ loading }) => ({
      loading: {
        ...loading,
        [period]: true
      }
    }))
    this.props.socket.emit(
      'client:run-scan', 
      { period }
    );
  };

  pennyScan = (type) => {
    console.log(
      'PENNY SCAN',
      this.selectRef.value
    );
    this.props.socket.on('server:penny-results', ({ results }) => {
      console.log('penny results', results)
      

      this.setState(({ loading }) => ({
        loading: {
          ...loading,
          [type]: false
        },
        results: results
          .map(pick => ({
            details: <button onClick={() => this.selectPick(pick)}>details</button>,
            // ticker: pick.ticker,
            ...pick,
          }))
      }));
    });
    this.setState(({ loading }) => ({
      loading: {
        ...loading,
        [type]: true
      }
    }))
    this.props.socket.emit('client:run-penny', type);
  };
  render() {
    const { loading, results = [], stSent, displayingPick } = this.state;


    const period = this.selectRef ? this.selectRef.value : undefined;
    const isLoading = Object.keys(loading).some(key => !!loading[key]);


    const withStSent = (results || []).map(row => {
      return {
        ...row,
        stSent: [row.stSent, stSent[row.ticker], 0].find(val => val !== undefined)
      };
      
    });


    const columns = results[0] && !results[0].percMaxVol && false ? [
      'Details',
      'Ticker',
      'Strategy Name',
      'Keys',
      'Stocktwits Sentiment',
    ] : Object.keys(results[0] || {});
    return (
      <div>
        <h2>Scan</h2>
        <select ref={ref => { this.selectRef = ref }}>
          {
            [5, 10, 30, 'd', 'penny-hotSt', 'penny-droppers', 'penny-nowheres', 'penny-unfiltered', 'penny-volume-increasing-5min', 'penny-volume-increasing-10min'].map(value => (
              <option value={value}>{value}</option>
            ))
          }
        </select>
        <button onClick={this.scan}>Scan</button>
        {
          isLoading && (
            <div>
              Loading
            </div>
          )
        }
        {
          results && (
            // <code>
            //   { JSON.stringify({rows: this.state.results}, null, 2)}
            // </code>
            <MDBDataTable data={{
              columns: columns.map((label, i) => ({ label, field: Object.keys(withStSent[0])[i] })),
              rows: withStSent
            }} />
          )
        }

        <ReactModal isOpen={!!displayingPick}>
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
          {displayingPick && <PickGraphs pick={displayingPick} socket={this.props.socket} /> }
        </ReactModal>
      </div>
    );
      
  }
}

export default Scan;