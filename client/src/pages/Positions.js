import React, { Component } from 'react';

import getTrend from '../utils/get-trend';
import { avgArray } from '../utils/array-math';

import Pick from '../components/Pick';
import TrendPerc from '../components/TrendPerc';

class TodaysStrategies extends Component {
    render() {
        let { pmPerfs, settings, predictionModels, admin, positions } = this.props;
        admin = true;
        const toDisplay = {
            'days old': 'dayAge',
            ticker: 'ticker',
            ...!admin ? {
                'percent of total': pos => pos.percTotal + '%',
            } : {
                equity: 'equity',
                'return $': pos => <TrendPerc value={pos.returnDollars} noPerc={true} />,
                'return %': pos => <TrendPerc value={pos.returnPerc} />,
            },
            // 'buy strategies': 'buyStrategy',
            'stSent': 'stSent',
            ...admin ? {
                'avg': 'average_buy_price',
                'current': 'currentPrice',
            } : {}
        };

        const totalInvested = positions.reduce((acc, pos) => acc + pos.equity, 0);
        const totalReturnDollars = positions.reduce((acc, pos) => acc + pos.returnDollars, 0);
        const totalReturnPerc = totalReturnDollars / totalInvested * 100;

        return (
            <div style={{ padding: '15px' }}>

                <table>
                    <thead>
                        {
                            Object.keys(toDisplay).map(header => 
                                <th>{header}</th>
                            )
                        }
                    </thead>
                    <tbody>
                        {
                            positions.map(pos => (
                                <tr style={{ background: pos.shouldSell ? 'rgba(255,0,0, 0.6)' : 'inherit' }}>
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
                                    <td colspan="3">Totals</td>
                                    <td>{totalReturnDollars}</td>
                                    <td><TrendPerc value={totalReturnPerc} /></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TodaysStrategies;