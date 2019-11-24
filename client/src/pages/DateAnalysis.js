import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import TrendPerc from '../components/TrendPerc';

const colors = [
  'rgba(75,192,192,1)',
  'rgba(192,70,20,1)',
  'rgba(0,200,80,1)'
]
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
    let { dateAnalysis, overallAnalysis } = this.props;
    console.log({dateAnalysis});
    dateAnalysis = [...dateAnalysis].reverse().slice(1);
    return (
      <div>

        <h1>Overall</h1>
        <div style={{ display: 'flex' }}>
          { Object.entries(overallAnalysis).map(([name, analysis]) => {
            const {
              totalBought, 
              percChange, 
              avgPositionImpactPerc, 
              totalImpact, 
              avgPickImpactPerc, 
              avgMultiplierImpactPerc,
              totalPicks,
              totalMultipliers,
            } = analysis;
            return (
              <div>
                <h2>{name}</h2>
                <ul>
                  <li>Total Bought: ${totalBought.toFixed(2)}</li>
                  <li>Total Impact: <TrendPerc value={totalImpact} dollar={true} /></li>
                  <li>Percent Change: <TrendPerc value={percChange} /></li>
                  <li>Avg Position Impact Perc: <TrendPerc value={avgPositionImpactPerc} /></li>
                  <li>Avg Pick Impact Perc: <TrendPerc value={avgPickImpactPerc} /></li>
                  <li>Avg Multiplier Impact Perc: <TrendPerc value={avgMultiplierImpactPerc} /></li>
                  <li>Pick Count: {totalPicks}</li>
                  <li>Multiplier Count: {totalMultipliers}</li>
                </ul>
              </div>
            );
          })}
        </div>

        <h1>avgImpactPerc vs percChange</h1>
        <LineChart {...{ dateAnalysis, props: ['avgImpactPerc', 'percChange', 'avgPickReturn', 'avgMultiplierReturn'] }} />

        <h1>totalBought</h1>
        <LineChart {...{ dateAnalysis, props: ['totalBought', 'totalImpact'] }} />

        <h1>pickCount</h1>
        <LineChart {...{ dateAnalysis, props: ['totalPicks', 'totalMultipliers'] }} />
        
      </div>
    )
  }
}

export default DateAnalysis;