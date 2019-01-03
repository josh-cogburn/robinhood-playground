import React, { Component } from 'react';
import getTrend from '../utils/get-trend';
import avgArray from '../utils/avg-array';

import Pick from '../components/Pick';
import TrendPerc from '../components/TrendPerc';

class TodaysStrategies extends Component {
  state = { picks: [], relatedPrices: {}, pmFilter: 'forPurchase', pastData: {}, predictionModels: {}, afterHoursEnabled: false };
  setpmFilter = (event) => {
      this.setState({
          pmFilter: event.target.value
      });
  }
  strategyMove = increment => {
      const curStrategy = this.state.pmFilter;
      const listOfStrategies = [...Object.keys(this.props.predictionModels), 'no filter'];
      const index = listOfStrategies.findIndex(strat => strat === curStrategy);
      let nextIndex = (index + increment) % listOfStrategies.length;
      console.info(nextIndex);
      nextIndex = nextIndex === -1 ? listOfStrategies.length - 1 : nextIndex;
      this.setState({
          pmFilter: listOfStrategies[nextIndex]
      });
  }
  toggleAfterHours = () => this.setState({ afterHoursEnabled: !this.state.afterHoursEnabled })
  render() {
      let { pmFilter, afterHoursEnabled } = this.state;
      let { picks, relatedPrices, predictionModels, pastData, curDate } = this.props;
      const { fiveDay } = pastData;

      let showingPicks = pmFilter !== 'no filter' ? picks.filter(pick => predictionModels[pmFilter].includes(pick.stratMin)) : picks;
      showingPicks = showingPicks.map(pick => {
          const calcedTrends = pick.withPrices.map(({ ticker, price }) => {
              const foundPrice = relatedPrices[ticker];
              if (!foundPrice) {
                  return console.log(pick, 'not found', ticker, price);
              }
              const { lastTradePrice, afterHoursPrice } = foundPrice;
              const nowPrice = afterHoursEnabled ? afterHoursPrice || lastTradePrice : lastTradePrice;
              return {
                  ticker,
                  thenPrice: price,
                  nowPrice,
                  trend: getTrend(nowPrice, price)
              };
          });
        //   console.log(pick, 'caled trends', calcedTrends);
          return {
              ...pick,
              avgTrend: avgArray(calcedTrends.filter(val => !!val).map(t => t.trend)),
              withTrend: calcedTrends
          };
      });
      let sortedByAvgTrend = showingPicks
          .sort(({ avgTrend: a }, { avgTrend: b}) => {
              return (isNaN(a)) - (isNaN(b)) || -(a>b)||+(a<b);
          });
      console.log('rendering!');
      const avgTrendOverall = avgArray(
            sortedByAvgTrend
                .filter(val => !isNaN(val.avgTrend))
                .map(strat => strat.avgTrend)
      );
      return (
        <div>
            <header className="App-header">
                <h1 className="App-title">current date: {curDate}</h1>
                prediction model:
                <button onClick={() => this.strategyMove(-1)}>
                    {'<<'}
                </button>
                <select value={pmFilter} onChange={this.setpmFilter}>
                    {predictionModels && Object.keys(predictionModels).map(pm => (
                        <option value={pm}>{pm}</option>
                    ))}
                    <option>no filter</option>
                </select>
                <button onClick={() => this.strategyMove(1)}>
                    {'>>'}
                </button>
                <br/>
                include after hours:
                <input type="checkbox" checked={afterHoursEnabled} onChange={this.toggleAfterHours} />
            </header>
            <p>
                    <h2>overall average trend: <TrendPerc value={avgTrendOverall} /></h2>
            </p>
            <p className="App-intro">
                {
                    sortedByAvgTrend.slice(0).map(pick => (
                        <div>
                            <Pick
                                pick={pick}
                                key={pick.stratMin}
                                fiveDay={fiveDay ? fiveDay[pick.stratMin] : null}
                            />
                        </div>
                    ))
                }
            </p>
        </div>
      );
  }
}

export default TodaysStrategies;