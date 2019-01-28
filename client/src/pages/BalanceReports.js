import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import reportsToChartData from '../utils/reports-to-chartData';
import TrendPerc from '../components/TrendPerc';

class DayReports extends Component {
    constructor() {
        super();
        this.state = {
            timeFilter: 'onlyToday'
        };
    }
    componentDidMount() {
    }
    setTimeFilter = timeFilter => this.setState({ timeFilter });
    render () {
        let { balanceReports, dayReports, admin } = this.props;
        debugger;
        let { timeFilter } = this.state;
        if (!balanceReports || !balanceReports.length) return <b>LOADING</b>;

        const lastReport = balanceReports[balanceReports.length - 1];
        const d = new Date(lastReport.time);
        const date = d.getDate();

        const dataSlice = timeFilter === 'onlyToday' 
            ? balanceReports.length - balanceReports.findIndex(r => 
                (new Date(r.time)).getDate() === date
            ) : 0;

        const chartData = reportsToChartData.balanceChart(balanceReports, dataSlice);
        const [{ data }] = chartData.datasets;
        const curTrend = data[data.length - 1] - 100;
        return (
            <div style={{ padding: '10px 40px' }}>
                {
                    [
                        'onlyToday',
                        'ALL REPORTS',
                        ...admin ? ['2019'] : []
                    ].map(time => (
                        <div>
                        {
                            (timeFilter === time)
                                ? <span>{time}</span>
                                : (
                                    <a href='#' onClick={() => this.setTimeFilter(time)}>{time}</a>
                                )
                        }
                        </div>
                    ))
                }
                <small>
                    trend since {new Date(balanceReports[0].time).toLocaleString()}:&nbsp;
                    <b style={{ fontSize: '160%' }}><TrendPerc value={curTrend} /></b>
                </small>
                {/* <h2></h2> */}

                
                {
                    timeFilter === '2019'
                        ? <Line data={reportsToChartData.balanceChart(dayReports.slice(4) || [])} />
                        : <Line 
                            data={chartData} 
                            options={{ animation: false }} 
                        />
                }
                
                
                
                {/* <pre>   
                    {JSON.stringify(balanceReports, null, 2)}
                </pre> */}
            </div>
        )
    }
}

export default DayReports;