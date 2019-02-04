import React, { Component } from 'react';

import getTrend from '../utils/get-trend';
import avgArray from '../utils/avg-array';

import Pick from '../components/Pick';
import TrendPerc from '../components/TrendPerc';

class TodaysStrategies extends Component {
    render() {
        let { pmPerfs, settings, predictionModels, admin, positions } = this.props;
    

        // const headers = {
        //     ticker: 'ticker',

        // }
        return (
            <div style={{ padding: '15px' }}>

                <table>
                    <thead>
                        <th>ticker</th>
                        <th>dayAge</th>
                        <th>avg</th>
                        <th>current</th>
                        <th>return</th>
                        <th>buy strategies</th>
                    </thead>
                    <tbody>
                        {
                            positions.map(pos => (
                                <tr>
                                    <td>{pos.ticker}</td>
                                   
                                    <td>{pos.dayAge}</td>
                                    <td>{pos.average_buy_price}</td>
                                    <td>{pos.currentPrice}</td>
                                    <td>
                                        {pos.returnDollars} (<TrendPerc value={pos.returnPerc} />)
                                    </td>
                                    <td>{pos.buyStrategy}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TodaysStrategies;