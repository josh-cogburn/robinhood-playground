import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import TrendPerc from '../components/TrendPerc';

const LineChart = ({ dateAnalysis, props }) => {
  return (
    <Line data={{
      labels: dateAnalysis.map(({ date }) => date),
      datasets: Object.keys(dateAnalysis[0])
        .filter(key => props.includes(key))
        .map((prop, i) => ({
          label: prop,
          fill: false,
          lineTension: 0.1,
          backgroundColor: i ? 'rgba(75,192,192,1)' : 'rgba(192,70,20,1)',
          borderColor: i ? 'rgba(75,192,192,1)' : 'rgba(192,70,20,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: i ? 'rgba(75,192,192,1)' : 'rgba(192,70,20,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: i ? 'rgba(75,192,192,1)' : 'rgba(192,70,20,1)',
          pointHoverBorderColor: i ? 'rgba(75,192,192,1)' : 'rgba(192,70,20,1)',
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
    let { dateAnalysis, overallAnalysis } = this.props;
    console.log({dateAnalysis});
    dateAnalysis = [...dateAnalysis].reverse().slice(1);
    return (
      <div>

        <h1>Overall</h1>
        <div style={{ display: 'flex' }}>
          { Object.entries(overallAnalysis).map(([name, {totalBought, percChange, avgImpactPerc, totalImpact, avgPickReturn, totalPicks}]) => (
            <div>
              <h2>{name}</h2>
              <ul>
                <li>Total Bought: ${totalBought.toFixed(2)}</li>
                <li>Total Impact: <TrendPerc value={totalImpact} dollar={true} /></li>
                <li>Percent Change: <TrendPerc value={percChange} /></li>
                <li>Avg Impact Perc: <TrendPerc value={avgImpactPerc} /></li>
                <li>Avg Pick Perc: <TrendPerc value={avgPickReturn} /></li>
                <li>Avg Impact Perc: {totalPicks}</li>
              </ul>
            </div>
          ))}
        </div>

        <h1>avgImpactPerc vs percChange</h1>
        <LineChart {...{ dateAnalysis, props: ['avgImpactPerc', 'percChange', 'avgPickReturn'] }} />

        <h1>totalBought</h1>
        <LineChart {...{ dateAnalysis, props: ['totalBought', 'totalImpact'] }} />

        <h1>pickCount</h1>
        <LineChart {...{ dateAnalysis, props: ['totalPicks'] }} />
        
      </div>
    )
  }
}

export default DateAnalysis;