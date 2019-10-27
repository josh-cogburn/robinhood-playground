import React, { Component } from 'react';

import getTrend from '../utils/get-trend';
import { avgArray } from '../utils/array-math';
import { mapObject } from 'underscore';

import Pick from '../components/Pick';
import TrendPerc from '../components/TrendPerc';

const tooltipStr = ({ buyStrategies }) => 
    Object.keys(buyStrategies || {})
        .map(strategy => {
            const count = buyStrategies[strategy];
            return `${strategy} (${count})`;
        }).join('\n');


const PositionSection = ({ relatedPrices, positions, name, admin }) => {

    console.log({ name, positions });
    
    const toDisplay = {
        // 'days old': 'dayAge',
        daysOld: 'daysOld',
        mostRecentPurchase: 'mostRecentPurchase',
        ticker: pos => {
            const tooltipText = tooltipStr(pos);
            return <span {...tooltipText && { 'data-custom': true, 'data-tooltip-str': tooltipText }}>{pos.ticker}</span>
        },
        ...!admin ? {
            'percent of total': pos => pos.percTotal + '%',
        } : {
            equity: 'equity',
            'return $': pos => <TrendPerc value={pos.returnDollars} dollar={true} />,
            'return %': ({ returnPerc, actualReturnPerc }) => (
                <span {...actualReturnPerc && { 'data-custom': true, 'data-tooltip-str': actualReturnPerc }}>
                    <TrendPerc value={returnPerc} />
                </span>
            ),
        },
        // 'buy strategies': 'buyStrategy',
        stSent: 'stSent',
        stBracket: ({ stBracket, upperLimit, lowerLimit }) => (
            <span>{stBracket} ({lowerLimit} -> {upperLimit})</span>
        ),
        recommendation: 'recommendation',
        percToSell: 'percToSell',
        wouldBeDayTrade: pos => JSON.stringify(pos.wouldBeDayTrade),
        ...admin ? {
            'avg': ({ avgEntry, actualEntry }) => (
                <span {...actualEntry && { 'data-custom': true, 'data-tooltip-str': actualEntry }}>{avgEntry}{actualEntry && '*'}</span>
            ),
            'current': 'currentPrice',
        } : {}
    };

    const sumProp = prop => positions.reduce((acc, pos) => acc + Number(pos[prop]), 0);
    let totals = {
        equity: sumProp('equity'),
        returnDollars: sumProp('returnDollars'),
    };
    totals = {
        ...totals,
        returnPerc: totals.returnDollars / (totals.equity - totals.returnDollars) * 100,
    };
    totals = mapObject(totals, val => Number(val.toFixed(2)))

    return (
        <div>
            <h2>{name}</h2>
            <table >
                <thead>
                    {
                        Object.keys(toDisplay).map(header => 
                            <th>{header}</th>
                        )
                    }
                </thead>
                <tbody>
                    {
                        positions
                            .map(pos => (
                                <tr style={{ background: pos.outsideBracket ? Number(pos.returnDollars) > 0 ? 'rgba(0, 255, 0, 0.6)' : 'rgba(255,0,0, 0.6)' : 'inherit' }}>
                                    {
                                        Object.keys(toDisplay).map(header => {
                                            const render = toDisplay[header];
                                            const v = typeof render === 'function' ? render(pos) : pos[render]; 
                                            return (
                                                <td>{v}</td>
                                            );
                                        })
                                    }
                                </tr>
                            ))
                    }
                    {
                        admin && <tr><td colspan={Object.keys(toDisplay).length}><hr/></td></tr>
                    }
                    {
                        admin && (
                            <tr>
                                <td>Totals</td>
                                <td>{totals.equity}</td>
                                <td>{totals.returnDollars}</td>
                                <td><TrendPerc value={totals.returnPerc} /></td>
                                <td colspan="3"></td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <br/>
        </div>
    );
}
    


class TodaysStrategies extends Component {
    render() {

        let { 
            // pmPerfs,
            // settings, 
            // predictionModels, 
            // admin, 
            positions, 
            relatedPrices 
        } = this.props;

        return (
            <div style={{ padding: '15px' }}>

                <style>{`.react-hint__content { width: 840px }`}</style>
                <style>{`table td, th { padding: 2px 15px }`}</style>
                
                {
                    Object.entries(positions).map(([name, positions]) => (
                        <PositionSection
                            relatedPrices={relatedPrices}
                            positions={positions}
                            name={name}
                            admin={true}
                        />
                    ))
                }

            </div>
        );
    }
}

export default TodaysStrategies;