import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import processDayReports from '../utils/dayReports-to-chartData';

class DayReports extends Component {
    componentDidMount() {
    }
    render () {
        const { dayReports } = this.props;
        if (!dayReports) return <b>LOADING</b>;
        return (
            <div>
                <h2>account balance daily trend %</h2>
                <Line data={processDayReports.balanceChart(dayReports)} />
                <h2>daily percentage changes</h2>
                <Line data={processDayReports.percChart(dayReports)} />
                <h2>dayReports</h2>
                <pre>{JSON.stringify(dayReports, null, 2)}</pre>
            </div>
        )
    }
}

export default DayReports;