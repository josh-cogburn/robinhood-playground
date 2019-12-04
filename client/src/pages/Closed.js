import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import TrendPerc from '../components/TrendPerc';
import { pick } from 'underscore';
import getByDateAnalysis from '../analysis/get-bydate-analysis';
import getOverallAnalysis from '../analysis/get-overall-analysis';
import getSubsets from '../analysis/get-subsets';

import { MDBDataTable } from 'mdbreact';


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

class Closed extends Component {
  state = {
    currentSubset: 'allPositions'
  };
  render() {
    let { positions: { alpaca: open}, analyzedClosed: closed } = this.props;
    const { currentSubset } = this.state;
    const allPositions = [
      ...open.map(position => ({
        ...position,
        isOpen: true
      })),
      ...closed
    ]
      .filter(position => position.date)
      .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());

    let overallAnalysis = getOverallAnalysis(allPositions);
    console.log({ currentSubset })

    const subsets = getSubsets(allPositions);
    console.log({ subsets }, Object.keys(subsets));
    const subsetFilterFn = subsets[currentSubset];
    const filtered = allPositions
      .filter(position => subsetFilterFn(position))
      .map(position => ({
          ...position,
          interestingWords: position.interestingWords.join(' ')
      }))
      .map(position => {
          ['avgEntry', 'avgSellPrice', 'netImpact', 'totalBuyAmt'].forEach(key => {
              position[key] = position[key] ? position[key].toFixed(2) : '---';
          });
          return position;
      })
      .map(position => ({
        ...position,
        isOpen: position.isOpen ? 'open' : ''
      }))
      .map(position => pick(position, [
          'ticker',
          'date',
          'isOpen',
          'totalBuyAmt',
          'avgEntry',
          'avgSellPrice',
          'netImpact',
          'impactPerc',
          'numPicks',
          'numMultipliers',
          'interestingWords'
      ]));
    return (
      <div>

        <h1>Position Analysis</h1>

        <div className="split-vertical">
          <div>

            <table style={{ width: '100%', margin: '0 1%', textAlign: 'center' }}>
              <thead>
                <tr>
                  <th>Subset</th>
                  <th>Total Bought</th>
                  <th>Total Impact</th>
                  <th>Percent Change</th>
                  <th>Avg Multiplier Impact Perc</th>
                  <th>Avg Pick Impact Perc</th>
                  <th>Avg Position Impact Perc </th>
                  <th>PercUp</th>
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
                    percUp,
                    totalPositions,
                    totalPicks,
                    totalMultipliers,
                  } = analysis;
                  return (
                    <tr>
                      <td><a onClick={() => this.setState({ currentSubset: name })}>{name}</a></td>
                      <td>${totalBought.toFixed(2)}</td>
                      <td><TrendPerc value={totalImpact} dollar={true} /></td>
                      <td><TrendPerc value={percChange} /></td>
                      <td><TrendPerc value={avgMultiplierImpactPerc} /></td>
                      <td><TrendPerc value={avgPickImpactPerc} /></td>
                      <td><TrendPerc value={avgPositionImpactPerc} /></td>
                      <td><TrendPerc value={percUp} redAt={50} /></td>
                      <td>{totalPositions}</td>
                      <td>{totalPicks}</td>
                      <td>{totalMultipliers.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            


          </div>
          <div>
              <h1>current subset: {currentSubset}</h1>
              {/* <pre>{JSON.stringify(filtered, null, 2)}</pre> */}
              <MDBDataTable data={{
                  columns: Object.keys(filtered[0]).map((label, i) => ({ label, field: label })),
                  rows: [...filtered].sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())
              }} />

          </div>
        </div>


      </div>
    )
  }
}

export default Closed;