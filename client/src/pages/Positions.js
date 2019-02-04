import React, { Component } from 'react';

import getTrend from '../utils/get-trend';
import avgArray from '../utils/avg-array';

import Pick from '../components/Pick';
import TrendPerc from '../components/TrendPerc';

class TodaysStrategies extends Component {
    constructor() {
        super();
        this.state = {
            forPurchaseOnly: true
        };
    }
    toggleForPurchaseOnly = () => this.setState({ forPurchaseOnly: !this.state.forPurchaseOnly })
    render() {
        let { pmPerfs, settings, predictionModels, admin, positions } = this.props;
        let { forPurchaseOnly } = this.state;


        // const headers = {
        //     ticker: 'ticker',

        // }
        return (
            <div style={{ padding: '15px' }}>

                <table>
                    <thead>
                        <th>ticker</th>
                        <th>return</th>
                    </thead>
                    <tbody>
                        {
                            positions.map(pos => (
                                <tr>
                                    <td>{pos.ticker}</td>
                                    <td>
                                        {pos.returnDollars} (<TrendPerc value={pos.returnPerc} />)
                                    </td>
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