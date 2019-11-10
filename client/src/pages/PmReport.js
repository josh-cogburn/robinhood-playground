import React, { Component } from 'react';

import getTrend from '../utils/get-trend';
import { avgArray, percUp, zScore } from '../utils/array-math';
import InputRange from 'react-input-range';
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
    return `rgba(${color},${intensity})`;
};

const sum = arr => arr.filter(Boolean).reduce((acc, val) => acc + val, 0);


const tooltipStr = (tickersWithTrend = {}) =>
    Object.keys(tickersWithTrend)
        .map(ticker => {
            const { avgBuyPrice, nowPrice, trend } = tickersWithTrend[ticker];
            return `${ticker}: ${avgBuyPrice} -> ${nowPrice} (${trend})`;
        }).join('\n');


class Settings extends React.Component {
    state = {
        filter: '',
        forPurchaseOnly: true,
        maxDash: '---',
        minAvgTrend: -100,
        minPercUp: 1
    }
    toggleForPurchaseOnly = () => this.setState({ forPurchaseOnly: !this.state.forPurchaseOnly });
    updateFilter = filter => this.setState({ filter });
    filterChange = event => {
        console.log(event.target.value);
        this.updateFilter(event.target.value);
    };
    debouncedUpdate = debounce(() => {
        this.props.setSettings(this.state);
    }, 1000)
    render() {
        this.debouncedUpdate();
        return (
            <div>
                Filter: <input type="text" onChange={this.filterChange}/><br/>
                MaxDash: 
                <select onChange={evt => this.setState({ maxDash: evt.target.value })}>
                    {
                        [
                            '---',
                            ...Array(6).fill(0).map((v, i) => i)
                        ].map(num => (
                            <option value={num}>{num}</option>
                        ))
                    }
                    
                </select>
                <br/>
                <label>
                    minimum percUp
                    <InputRange
                        maxValue={100}
                        minValue={1}
                        step={1}
                        style={{ display: 'inline-block' }}
                        // formatLabel={value => value.toFixed(2)}
                        value={this.state.minPercUp}
                        onChange={minPercUp => debounce(this.setState({ minPercUp }), 500)}
                        // onChange={value => console.log(value)} 
                    />
                </label>
                <br/>
                <label>
                    minimum avgTrend
                    <InputRange
                        maxValue={20}
                        minValue={-100}
                        step={1}
                        style={{ display: 'inline-block' }}
                        // formatLabel={value => value.toFixed(2)}
                        value={this.state.minAvgTrend}
                        onChange={debounce(minAvgTrend => this.setState({ minAvgTrend }), 500)}
                        // onChange={value => console.log(value)} 
                    />
                </label>
                <br/>
                <label>
                    <input type="checkbox" checked={this.state.forPurchaseOnly} onChange={this.toggleForPurchaseOnly} />
                    forPurchase PM's only
                </label>
            </div>
        )
    }
}

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
            <th>json count</th>
            <th>json daysCount</th>
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
                            <td>{perf.jsonCount ? +perf.jsonCount.toFixed(2) : ''}</td>
                            <td>{perf.jsonDaysCount}</td>
                            <td>{perf.overallZScore > 2 && '🌠🌠🌠'}</td>  
                        </tr>
                ))
            }
        </tbody>
    </table>
);




const processData = (props, state) => {


    let {
        pmPerfs,
        settings,
        // predictionModels,
        pmsAnalyzed,
        pms,
        picks,
        relatedPrices
    } = props;


    let { 
        forPurchaseOnly, 
        filter, 
        maxDash,
        minAvgTrend,
        minPercUp
    } = state; 



    const pmMatchesFilter = pmName => filter
        .split(',')
        .every(str => 
            (new RegExp(`(?<!!)${str}`)).test(pmName)   // no ! prefix
        );

    const forPurchasePMs = settings.forPurchase.map(line =>
        line.substring(1, line.length - 1)
    );
    const isForPurchase = pmName => forPurchasePMs.includes(pmName);

    maxDash = maxDash === '---' ? Number.POSITIVE_INFINITY : Number(maxDash);

    const flattenLebowski = ({
        jsonAnalysis = {},
        ...lebowski
    }) => ({
        pmName: lebowski.pm,
        lebowskiAvg: lebowski.overallAvg,
        lebowskiPercUp: lebowski.percUp,
        jsonAvg: jsonAnalysis.avgTrend,
        jsonPercUp: jsonAnalysis.percUp,
        jsonCount: jsonAnalysis.count,
        jsonDaysCount: jsonAnalysis.daysCount,
    });

    const passesAvgTrendAndPercUp = ({ lebowskiAvg, jsonAvg, lebowskiPercUp, jsonPercUp }) => {
        const avgTrend = avgArray([lebowskiAvg, jsonAvg].filter(Boolean));
        const avgPercUp = avgArray([lebowskiPercUp, jsonPercUp].filter(Boolean));
        return avgTrend >= minAvgTrend && avgPercUp >= minPercUp;
    };


    pmPerfs = pmPerfs
        .filter(({ pmName }) => pmName.split('-').length <= maxDash + 1)
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
        })
        .filter(passesAvgTrendAndPercUp);


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
                            part = part.toString();
                            if (part.startsWith('!')) {
                                return !stratMin.includes(part.slice(1));
                            }
                            return (new RegExp(`(?<!!)${part}`)).test(stratMin);
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
    let noHitTops = pmsAnalyzed
        .filter(pm => {
            return !pmPerfs.find(pmPerf => pmPerf.pmName === pm.pm);
        })
        .filter(({ pm }) => pm.split('-').length <= maxDash + 1)
        .filter(pm => pmMatchesFilter(pm.pm))
        .map(flattenLebowski)
        .filter(passesAvgTrendAndPercUp)
        .map(pm => ({
            ...pm,
            isForPurchase: isForPurchase(pm.pmName)
        }));


    if (forPurchaseOnly) { 
        pmPerfs = pmPerfs.filter(perf => perf.isForPurchase);
        noHitTops = noHitTops.filter(perf => perf.isForPurchase);
    }

    return {
        pmPerfs,
        noHitTops
    };
};


class TodaysStrategies extends Component {
    constructor() {
        super();
        this.state = {
            settings: {}
        };
    }
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
        // let { pmPerfs, settings, predictionModels, pmsAnalyzed, pms, picks, relatedPrices } = this.props;
        // let { forPurchaseOnly } = this.state.settings;


        let {
            pmPerfs,
            noHitTops
        } = processData(this.props, this.state.settings);

        // console.log({ pmPerfs, noHitTops, filter })

        return (
            <div style={{ padding: '15px' }}>

                
                <style>{`.react-hint__content { width: 300px }`}</style>
                <Settings setSettings={settings => this.setState({ settings })}/>

                <hr/>

                <h2>Current PM Trends</h2>
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