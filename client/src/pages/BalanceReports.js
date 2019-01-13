import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import reportsToChartData from '../utils/reports-to-chartData';
import TrendPerc from '../components/TrendPerc';

class DayReports extends Component {
    componentDidMount() {
    }
    render () {
        let { reports } = this.props;
        if (!reports) return <b>LOADING</b>;
        const chartData = reportsToChartData.balanceChart(reports);
        const [{ data }] = chartData.datasets;
        const curTrend = data[data.length - 1] - 100;
        return (
            <div style={{ padding: '10px 40px' }}>
                <small>
                    trend since {new Date(reports[0].time).toLocaleString()}:&nbsp;
                    <b style={{ fontSize: '160%' }}><TrendPerc value={curTrend} /></b>
                </small>
                {/* <h2></h2> */}
                <Line 
                    data={chartData} 
                    options={{ animation: false }} 
                />
                {/* <pre>   
                    {JSON.stringify(reports, null, 2)}
                </pre> */}
            </div>
        )
    }
}

export default DayReports;