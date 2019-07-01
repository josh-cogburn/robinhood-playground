import React, { Component } from 'react';

import getTrend from '../utils/get-trend';
import avgArray from '../utils/avg-array';

import Pick from '../components/Pick';
import TrendPerc from '../components/TrendPerc';
import { partition, pick } from 'underscore';

class TodaysStrategies extends Component {
  state = { picks: [], relatedPrices: {}, pmFilter: 'forPurchase', pastData: {}, predictionModels: {}, afterHoursEnabled: false, sortBy: 'avgTrend', additionalFilters: '' };
  strategyMove = increment => {
      const curStrategy = this.state.pmFilter;
      const listOfStrategies = [...Object.keys(this.props.predictionModels), 'forPurchase', 'no filter'];
      const index = listOfStrategies.findIndex(strat => strat === curStrategy);
      let nextIndex = (index + increment) % listOfStrategies.length;
      console.info(nextIndex);
      nextIndex = nextIndex === -1 ? listOfStrategies.length - 1 : nextIndex;
      this.setState({
          pmFilter: listOfStrategies[nextIndex]
      });
  }
  componentWillUnmount() {
      window.localStorage.setItem('TodaysStrategies', JSON.stringify(pick(this.state, ['pmFilter', 'sortBy', 'additionalFilters'])));
  }
  componentDidMount() {
      this.setState(
          JSON.parse(window.localStorage.getItem('TodaysStrategies'))
      )
  }
  setStateOfProp = prop => event => this.setState({ [prop]: event.target.value });
  toggleAfterHours = () => this.setState({ afterHoursEnabled: !this.state.afterHoursEnabled });
  render() {
      let { pmFilter, afterHoursEnabled, sortBy, additionalFilters } = this.state;
      let { picks, relatedPrices, predictionModels, pastData, curDate, pmPerfs, pms, settings } = this.props;
      const { fiveDay } = pastData || {};

        const additionalFilterParts = additionalFilters.split(',');
        
        const matchesPm = (strat, pm) => {
            return pms[pm] && pms[pm].every(part => strat.includes(`${part}-`));
        }

      let showingPicks = (() => {
          if (pmFilter === 'no filter') {
              return picks;
          } else if (pmFilter === 'forPurchase') {

            let [forPurchasePms, forPurchaseStrats] = partition(
                settings.forPurchase, 
                line => (line.startsWith('[') && line.endsWith(']'))
            );

            forPurchasePms = forPurchasePms.map(line => line.substring(1, line.length - 1));
            console.log({ forPurchasePms, forPurchaseStrats})

            return picks.filter(({ stratMin }) => 
                forPurchaseStrats.includes(stratMin) ||
                forPurchasePms.some(pm => 
                    matchesPm(stratMin, pm)
                )
            );
          } else {
              return picks.filter(({ stratMin }) =>
                matchesPm(stratMin, pmFilter)
              );
          }
        //   const picks = pmFilter !== 'no filter' ? picks.filter(pick => pms[pmFilter].every(part => pick.stratMin.includes(`${part}-`))) : picks;
      })().filter(pick => additionalFilterParts.every(part => pick.stratMin.includes(part)));

      console.log({ showingPicks})
      
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
          .sort((a, b) => {
              const aVal = a[sortBy];
              const bVal = b[sortBy];
              return (isNaN(aVal)) - (isNaN(bVal)) || -(aVal>bVal)||+(aVal<bVal);
          });
      console.log('rendering!');
      const avgTrendOverall = avgArray(
            sortedByAvgTrend
                .filter(val => !isNaN(val.avgTrend))
                .map(strat => strat.avgTrend)
      );

    //   const perfs = pmPerfs.find(perf => perf.pmName === pmFilter) || {};


      return (
        <div>
            <header className="App-header">
                <h1 className="App-title">current date: {curDate}</h1>
                prediction model:
                <button onClick={() => this.strategyMove(-1)}>
                    {'<<'}
                </button>
                <select value={pmFilter} onChange={this.setStateOfProp('pmFilter')}>
                    {pmPerfs && pmPerfs.map(({ pmName }) => (
                        <option value={pmName}>{pmName}</option>
                    ))}
                    <option>forPurchase</option>
                    <option>no filter</option>
                </select>
                <button onClick={() => this.strategyMove(1)}>
                    {'>>'}
                </button>
                <br/>
                sort by:
                <select value={sortBy} onChange={this.setStateOfProp('sortBy')}>
                    {['avgTrend', 'timestamp'].map(sortBy => (
                        <option value={sortBy}>{sortBy}</option>
                    ))}
                </select>
                <br/>
                additional filters:
                <input type="text" onChange={this.setStateOfProp('additionalFilters')} />
                <br/>
                include after hours:
                <input type="checkbox" checked={afterHoursEnabled} onChange={this.toggleAfterHours} />
            </header>
            <p style={{ marginLeft: '20px' }}>
                    {/* {
                        perfs.avgTrend !== perfs.weightedTrend && (
                            <b>weighted trend: <TrendPerc value={perfs.weightedTrend} />&nbsp;&nbsp;&nbsp;</b>
                        )
                    } */}
                    <b>average trend: <TrendPerc value={avgTrendOverall} /></b>
            </p>
            <hr/>
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