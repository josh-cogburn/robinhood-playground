import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import { pick } from 'underscore';

// import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
// import "mdbreact/dist/css/mdb.css";

// import getTrend from '../utils/get-trend';
import { avgArray } from '../utils/array-math';

// import Pick from '../components/Pick';
// import TrendPerc from '../components/TrendPerc';

class Analysis extends Component {
  state = {};
  shouldComponentUpdate(nextProps, nextState) {
    console.log({
      nextProps,
      CUR: this.props
    })

    return JSON.stringify(this.state) != JSON.stringify(nextState);
  }
  componentDidMount() {
    // pm perf
    console.log("sending client:get-pm-analysis'", )
    this.props.socket.on('server:pm-analysis', pmAnalysis => {
      console.log({
        pmAnalysis
      })
      this.setState({ pmAnalysis });
    });
    this.props.socket.emit('client:get-pm-analysis');
    // strat perf
    console.log("sending client:get-strat-analysis'", )
    this.props.socket.on('server:strat-analysis', stratAnalysis => {
      console.log({
        stratAnalysis
      })
      this.setState({ stratAnalysis: stratAnalysis.all });

      // const roundTo = numDec => num => Math.round(num * Math.pow(10, numDec)) / Math.pow(10, numDec);
      // const twoDec = roundTo(2);
      // const byStrat = Object.keys(stratAnalysis).reduce((acc, date) => {
      //   const includeDate = true;
      //   if (includeDate) {
      //     stratAnalysis[date].forEach(stratPerf => {
      //       const { stratMin, overallAvg } = stratPerf;
      //       acc[stratMin] = [
      //         ...acc[stratMin] || [],
      //         twoDec(overallAvg)
      //       ];
      //     });
      //   }
      //   return acc;
      // }, {});
      // console.log({ byStrat })
      // const asArray = Object.keys(byStrat).map(stratMin => ({
      //   stratMin,
      //   avg: twoDec(avgArray(byStrat[stratMin])),
      //   values: byStrat[stratMin],
      // }));
      // console.log({asArray})
      // const sorted = asArray
      //   .filter(({ values }) => values.length > 1)
      //   .sort((a, b) => b.avg - a.avg);
      // console.log({ sorted })
      // this.setState({ stratAnalysis: sorted });
    });
    this.props.socket.emit('client:get-strat-analysis');
  }
  render() {
    return (
      <div>
        <h2>PM's</h2>
        {/* <code>
          {JSON.stringify(this.state.pmAnalysis, null, 2)}
        </code> */}
        {
          this.state.pmAnalysis && (
            <MDBDataTable data={{
              columns: [
                {
                  label: 'PM Name',
                  field: 'pm',
                },
                {
                  label: 'Average',
                  field: 'avg',
                },
                {
                  label: 'Count',
                  field: 'count',
                },
                {
                  label: 'Values',
                  field: 'values',
                }
              ],
              rows: this.state.pmAnalysis.map(row => ({
                ...row,
                values: row.values.join(', ')
              }))
            }} />
          )
        }
        <hr/>
        <h2>Strategies</h2>
        {
          this.state.stratAnalysis && this.state.stratAnalysis.length && (
            <MDBDataTable data={{
              columns: (() => {
                const cols = ([
                  'strategy',
                  'count',
                  'score',
                  'avgMax',
                  'maxs',
                ] || Object.keys(this.state.stratAnalysis[0])).map(key => ({
                  label: key,
                  field: key
                }));
                console.log({ cols, rows: this.state.stratAnalysis })
                return cols;
              })(),
              
              
              // [
              //   {
              //     label: 'StratMin',
              //     field: 'stratMin',
              //   },
              //   // {
              //   //   label: 'Count',
              //   //   field: 'count',
              //   // },
              //   {
              //     label: 'Average',
              //     field: 'avg',
              //   },
              //   {
              //     label: 'Values',
              //     field: 'values',
              //   },
              // ],
              rows: this.state.stratAnalysis.map(row => ({
                strategy: row.strategy,
                count: row.count,
                score: row.score,
                avgMax: row.playouts.onlyMax.avgTrend,
                maxs: row.maxs.join(', '),
              }))
            }} />
          )
        }
      </div>
    );
      
  }
}

export default Analysis;