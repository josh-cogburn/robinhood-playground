import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import TrendPerc from '../components/TrendPerc';
const colors = [
  'black',
  'rgba(75,192,192,1)',
  'rgba(192,70,20,1)',
  'rgba(0,200,80,1)',
]
const LineChart = ({ dateAnalysis, props }) => {
  return (
    <Line data={{
      labels: dateAnalysis.map(({ date }) => date),
      datasets: props
        .map((prop, i) => ({
          label: prop,
          fill: false,
          lineTension: 0.1,
          backgroundColor: colors[i],
          borderColor: colors[i],
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: colors[i],
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: colors[i],
          pointHoverBorderColor: colors[i],
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: dateAnalysis.map(analysis => analysis[prop])
        }))
    }} />
  );
};

class DateAnalysis extends Component {
  render() {
    let { dateAnalysis } = this.props;

    console.log({dateAnalysis});
    // dateAnalysis = [...dateAnalysis].reverse().slice(1);
    return (
      <div>


        <h1>percentages</h1>
        <LineChart {...{ dateAnalysis, props: ['percChange', 'avgPositionImpactPerc', 'avgPickImpactPerc', 'avgMultiplierImpactPerc'] }} />

        <h1>dollars</h1>
        <LineChart {...{ dateAnalysis, props: ['totalBought', 'totalImpact'] }} />

        <h1>counts</h1>
        <LineChart {...{ dateAnalysis, props: ['totalPositions', 'totalPicks', 'totalMultipliers'] }} />
        
      </div>
    )
  }
}

export default DateAnalysis;