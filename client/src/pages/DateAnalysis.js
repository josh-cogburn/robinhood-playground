import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import TrendPerc from '../components/TrendPerc';
import getByDateAnalysis from '../analysis/get-bydate-analysis';
import getOverallAnalysis from '../analysis/get-overall-analysis';
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
    let { positions: { alpaca: open}, analyzedClosed: closed } = this.props;

    const allPositions = [
      ...open,
      ...closed
    ]
      .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
    console.log({ allPositions })
    let [dateAnalysis, overallAnalysis] = [getByDateAnalysis, getOverallAnalysis]
      .map(fn => fn(allPositions));

    console.log({dateAnalysis});
    dateAnalysis = [...dateAnalysis].reverse().slice(1);
    return (
      <div>

        <h1>Overall</h1>
        <table style={{ width: '100%', margin: '0 1%', textAlign: 'center' }}>
          <thead>
            <tr>
              <th>Subset</th>
              <th>Total Bought</th>
              <th>Total Impact</th>
              <th>Percent Change</th>
              <th>Avg Position Impact Perc </th>
              <th>Avg Pick Impact Perc</th>
              <th>Avg Multiplier Impact Perc</th>
              {/* <th>PercUp</th> */}
              <th>Position Count</th>
              <th>Pick Count</th>
              <th>Multiplier Count</th>
            </tr>
          </thead>
          <tbody>
            { Object.entries(overallAnalysis).map(([name, analysis]) => {
              const {
                totalBought, 
                percChange, 
                avgPositionImpactPerc, 
                totalImpact, 
                avgPickImpactPerc, 
                avgMultiplierImpactPerc,
                // percUp,
                totalPositions,
                totalPicks,
                totalMultipliers,
              } = analysis;
              return (
                <tr>
                  <td>{name}</td>
                  <td>${totalBought.toFixed(2)}</td>
                  <td><TrendPerc value={totalImpact} dollar={true} /></td>
                  <td><TrendPerc value={percChange} /></td>
                  <td><TrendPerc value={avgPositionImpactPerc} /></td>
                  <td><TrendPerc value={avgPickImpactPerc} /></td>
                  <td><TrendPerc value={avgMultiplierImpactPerc} /></td>
                  {/* <td><TrendPerc value={percUp} redAt={50} /></td> */}
                  <td>{totalPositions}</td>
                  <td>{totalPicks}</td>
                  <td>{totalMultipliers.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

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