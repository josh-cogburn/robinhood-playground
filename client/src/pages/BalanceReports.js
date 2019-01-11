import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import reportsToChartData from '../utils/reports-to-chartData';

class DayReports extends Component {
    componentDidMount() {
    }
    render () {
        let { reports } = this.props;
        if (!reports) return <b>LOADING</b>;
        return (
            <div style={{ padding: '40px' }}>
                <Line data={reportsToChartData.balanceChart(reports)} />
                {/* <pre>   
                    {JSON.stringify(reports, null, 2)}
                </pre> */}
            </div>
        )
    }
}

export default DayReports;