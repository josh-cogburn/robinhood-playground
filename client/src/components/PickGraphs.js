import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import graphs from './graphs';

const Graph = ({ title, data, dataProp, dataFn }) => {
  const values = data[dataProp];
  if (!values) return null;
  return (
    <div>
      <h2>{title}</h2>
      <Line data={dataFn(data)} />
    </div>
  )
};

export default class PickGraphs extends Component {
  state = {};
  loadDataForPick(pick) {
    console.log(`getting picks data for ${pick._id}`);
    this.props.socket.emit('getPickData', pick._id, data => {
        console.log(`got picks data`, data);
        this.setState({
          fetchedData: data
        });
    });
  }
  componentDidMount() {
    if (this.props.pick && !this.props.pick.data) {
      setTimeout(() => this.loadDataForPick(this.props.pick), 500);
    }
  }
  render() {
    const { pick, socket } = this.props;
    const data = pick.data || this.state.fetchedData;
    const withData = {
      ...pick,
      data
    };
    console.log({ data });
    return (
      <div>
        <h3>Strategy: {pick.stratMin}</h3>
        <h3>Ticker: {pick.withPrices[0].ticker}</h3>
        { data && data.period && <h3>Period: {data.period}</h3> }
        <hr/>
        {
          data ? (
            <div>
                {
                  graphs.map(props => 
                    <Graph {...props} data={data} />
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