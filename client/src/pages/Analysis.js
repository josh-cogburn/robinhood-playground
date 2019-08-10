import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

// import getTrend from '../utils/get-trend';
// import { avgArray } from '../utils/array-math';

// import Pick from '../components/Pick';
// import TrendPerc from '../components/TrendPerc';

class Analysis extends Component {
  state = {};
  componentDidMount() {
    console.log("sending client:get-pm-analysis'", )
    this.props.socket.on('server:pm-analysis', pmAnalysis => {
      console.log({
        pmAnalysis
      })
      this.setState({ pmAnalysis });
    });
    this.props.socket.emit('client:get-pm-analysis');
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
      </div>
    );
      
  }
}

export default Analysis;