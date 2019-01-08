import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import processDayReports from '../utils/dayReports-to-chartData';

class DayReports extends Component {
    componentDidMount() {
    }
    render () {
        let { dayReports } = this.props;
        dayReports = dayReports.slice(4);
        if (!dayReports) return <b>LOADING</b>;
        return (
            <div>
                <h2>account balance vs S&amp;P</h2>
                <Line data={processDayReports.balanceChart(dayReports)} />
                <h2>unrealized vs realized return %</h2>
                <Line data={processDayReports.unrealizedVsRealized(dayReports)} />
                <h2>forPurchase PM vs S&amp;P500  %</h2>
                <Line data={processDayReports.spyVsForPurchase(dayReports)} />
                <h2>pick to execution %</h2>
                <Line data={processDayReports.pickToExecutionPerc(dayReports)} />
                <h2>dayReports</h2>
                <pre>{JSON.stringify(dayReports, null, 2)}</pre>
            </div>
        )
    }
}

export default DayReports;