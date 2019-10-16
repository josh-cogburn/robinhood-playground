import React, { Component } from 'react';

import getTrend from '../utils/get-trend';
import { avgArray, percUp, zScore } from '../utils/array-math';

import Pick from '../components/Pick';
import TrendPerc from '../components/TrendPerc';
import { debounce, mapObject } from 'underscore';

const calcBgColor = perf => {
    // console.log({
    //     perf,
    // })
    
    const goodBad = [
        ...perf.avgTrend ? [
            perf.percUp > 50,
        ] : [],
        ...perf.lebowskiAvg ? [
            perf.lebowskiAvg > 0,
            perf.lebowskiPercUp > 50,
        ] : [],
        ...(perf.jsonAvg) ? [
            perf.jsonAvg > 0,
            perf.jsonPercUp > 50,
        ] : []
    ];

    const basis = perf.avgTrend > 0 || perf.avgTrend === undefined;

    const avgs = (perf.lebowskiAvg || 0) + (perf.jsonAvg || 0);
    const num = 220 + avgs * 2;
    const red = `${num},0,0`;
    const green = `0,${num},0`;
    const color = basis ? green : red;


    const MIN_OPACITY = 0;
    const MAX_OPACITY = 0.8;
    const distance = MAX_OPACITY - MIN_OPACITY;

    let intensityOffset = percUp(goodBad) / 100 * distance;
    // const extraBoost = Math.abs(
    //     basis ? Math.ceil(perf.overallZScore) : Math.floor(perf.overallZScore)
    // ) * 0.2;
    // intensityOffset += extraBoost;

    let intensity = basis ? MIN_OPACITY + intensityOffset : MAX_OPACITY - intensityOffset;

    if (perf.pmName === 'rsi-shouldWatchout-firstAlert-rsilt5-dinner') {
console.log({ goodBad, basis, intensityOffset })
    console.log({ intensity})
    }
    

    return `rgba(${color},${intensity})`;
};

const sum = arr => arr.filter(Boolean).reduce((acc, val) => acc + val, 0);


const tooltipStr = (tickersWithTrend = {}) =>
    Object.keys(tickersWithTrend)
        .map(ticker => {
            const { avgBuyPrice, nowPrice, trend } = tickersWithTrend[ticker];
            return `${ticker}: ${avgBuyPrice} -> ${nowPrice} (${trend})`;
        }).join('\n');


const TrendTable = ({ trends, investigatePm }) => (
    <table>

        <thead>
            <th>avgTrend</th>
            <th>percUp</th>
            <th>count</th>
            <th>prediction model</th>
            <th>lebowski avg</th>
            <th>lebowski perc up</th>
            <th>json avg</th>
            <th>json perc up</th>
            <th>star?</th>
        </thead>
        <tbody>
            {
                trends.map(perf => (
                        <tr style={{ fontWeight: perf.isForPurchase ? 'bold' : 'inherit', backgroundColor: calcBgColor(perf) }}>
                            <td><TrendPerc value={perf.avgTrend} /></td>
                            <td><TrendPerc value={perf.percUp ? perf.percUp / 100 : undefined} redAt={50} noPlus={true} round={true} /></td>
                            <td>{perf.count}</td>
                            <td {...perf.tickersWithTrend && { 'data-custom': true, 'data-tooltip-str': tooltipStr(perf.tickersWithTrend) } }>
                                <a onClick={() => investigatePm(perf.pmName)}>{perf.pmName}</a>
                            </td>
                            <td><TrendPerc value={perf.lebowskiAvg} /></td>
                            <td><TrendPerc value={perf.lebowskiPercUp} redAt={50} noPlus={true} round={true} /></td>
                            <td><TrendPerc value={perf.jsonAvg} /></td>
                            <td><TrendPerc value={perf.jsonPercUp} redAt={50} noPlus={true} round={true} /></td>
                            <td>{perf.overallZScore > 2 && '🌠🌠🌠'}</td>  
                        </tr>
                ))
            }
        </tbody>
    </table>
);


class TodaysStrategies extends Component {
    constructor() {
        super();
        this.state = {
            filter: '',
            forPurchaseOnly: true
        };
    }
    toggleForPurchaseOnly = () => this.setState({ forPurchaseOnly: !this.state.forPurchaseOnly });
    updateFilter = debounce(filter => this.setState({ filter }), 500);
    filterChange = event => {
        console.log(event.target.value);
        this.updateFilter(event.target.value);
    };
    investigatePm = pmName => {
        const { handlePageChange } = this.props;
        window.localStorage.setItem('TodaysStrategies', JSON.stringify({
            ...JSON.parse(window.localStorage.getItem('TodaysStrategies')),
            pmFilter: pmName,
            additionalFilters: ''
        }));
        handlePageChange(null, 2);
    }
    render() {
        const { investigatePm } = this;
        let { pmPerfs, settings, predictionModels, pmsAnalyzed, pms, picks, relatedPrices } = this.props;
        let { forPurchaseOnly, filter } = this.state;

        const pmMatchesFilter = pmName => filter.split(',').every(str => pmName.includes(str));

        const forPurchasePMs = settings.forPurchase.map(line =>
            line.substring(1, line.length - 1)
        );
        const isForPurchase = pmName => forPurchasePMs.includes(pmName);

        
        
        const flattenLebowski = ({
            jsonAnalysis = {},
            ...lebowski
        }) => ({
            pmName: lebowski.pm,
            lebowskiAvg: lebowski.overallAvg,
            lebowskiPercUp: lebowski.percUp,
            jsonAvg: jsonAnalysis.avgTrend,
            jsonPercUp: jsonAnalysis.percUp,
        });

        pmPerfs = pmPerfs
            .filter(({ pmName }) => pmMatchesFilter(pmName))
            .map(({ avgTrend, percUp, pmName, count }) => {
                const foundLebowski = pmsAnalyzed.find(pm => pm.pm === pmName) || {};
                return {
                    ...flattenLebowski(foundLebowski),
                    pmName,
                    count,
                    avgTrend,
                    percUp,
                    isForPurchase: isForPurchase(pmName)
                };
            });


        pmPerfs = pmPerfs
            .map((perf, index, arr) => ({
                ...perf,
                zScores: Object.keys(perf).reduce((acc, key) => ({
                    ...acc,
                    [key]: zScore(
                        arr.map(o => o[key]).filter(Boolean),
                        perf[key]
                    )
                }), {})
            }))
            .map((perf, index, arr) => {

                const overallScores = [
                    'lebowskiAvg',
                    'jsonAvg'
                ];

                const sumKeys = obj => sum(
                    Object.keys(obj.zScores)
                        .filter(key => overallScores.includes(key))
                        .map(key => obj.zScores[key])
                );

                return {
                    ...perf,
                    overallZScore: zScore(
                        arr.map(
                            sumKeys
                        ),
                        sumKeys(perf)
                    ),
                    // secondaryZScore: zScore(
                    //     arr.map(
                    //         obj => sum(Object.values(obj.zScores).slice(1)),
                    //     ),
                    //     sum(Object.values(perf.zScores).slice(1)),
                    // )
                };

                
            })
            .map(perf => ({
                ...perf,
                ...(() => {
                    const matchesPm = (stratMin, pm) => {
                        const arrayOfArrays = pms[pm] || [];
                        return arrayOfArrays.some(parts => {
                            parts = Array.isArray(parts) ? parts : [parts];
                            return parts.every(part => {
                                if (part.startsWith('!')) {
                                    return strategy.includes(part.slice(1));
                                }
                                return strategy.includes(part);
                            });
                        });
                        // return pms[pm] && pms[pm].every(part => strat === part || strat.includes(`${part}-`) || strat.includes(`-${part}`));
                    };
                    const matchingPicks = picks.filter(({ stratMin }) => matchesPm(stratMin, perf.pmName));;
                    const byTicker = matchingPicks.reduce((acc, pick) => {
                        pick.withPrices.forEach(({ ticker, price }) => {
                            acc[ticker] = [
                                ...acc[ticker] || [],
                                price
                            ];
                        });
                        return acc;
                    }, {});
                    const avgBuyPrices = mapObject(byTicker, arr => +avgArray(arr).toFixed(3));
                    const tickersWithTrend = mapObject(avgBuyPrices, (avgBuyPrice, ticker) => {
                        if (!relatedPrices[ticker]) console.log("wtf", ticker, perf.pmName);
                        const { afterHoursPrice, lastTradePrice } = relatedPrices[ticker] || {};
                        const nowPrice = afterHoursPrice || lastTradePrice;
                        return {
                            avgBuyPrice,
                            nowPrice,
                            trend: getTrend(nowPrice, avgBuyPrice)
                        };
                    });
                    return {
                        matchingPicks,
                        tickersWithTrend
                    };
                })()
            }));
        
        console.log({ pmsAnalyzed })
        const noHitTops = pmsAnalyzed
            .filter(pm => pmMatchesFilter(pm.pm))
            .filter(pm => {
                return !pmPerfs.find(pmPerf => pmPerf.pmName === pm.pm);
            }).map(flattenLebowski);


        if (forPurchaseOnly) { 
            pmPerfs = pmPerfs.filter(perf => isForPurchase(perf.pmName));
        }

        console.log({ pmPerfs, noHitTops, filter })

        return (
            <div style={{ padding: '15px' }}>

                
                <style>{`.react-hint__content { width: 300px }`}</style>
                    
                    
                Filter: <input type="text" onChange={this.filterChange}/><br/>
                <h2>Current PM Trends</h2>
                <label>
                    <input type="checkbox" checked={forPurchaseOnly} onChange={this.toggleForPurchaseOnly} />
                    forPurchase PM's only
                </label>
                <TrendTable trends={pmPerfs} investigatePm={investigatePm} />

                <hr/>

                <h2>Top Lebowski No Hits</h2>
                <TrendTable trends={noHitTops} investigatePm={investigatePm} />

                
    {/* 
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
                <p style={{ marginLeft: '20px' }}>
                        {
                            perfs.avgTrend !== perfs.weightedTrend && (
                                <b>weighted trend: <TrendPerc value={perfs.weightedTrend} />&nbsp;&nbsp;&nbsp;</b>
                            )
                        }
                        <b>average trend: <TrendPerc value={perfs.avgTrend} /></b>
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
                </p> */}
            </div>
        );
    }
}

export default TodaysStrategies;