import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import reportsToChartData from '../utils/reports-to-chartData';
import TrendPerc from '../components/TrendPerc';
import getTrend from '../utils/get-trend';
import { mapObject } from 'underscore';

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
        let { timeFilter } = this.state;
        if (!balanceReports || !balanceReports.length) return <b>LOADING</b>;


        // filter balance reports
        const lastReport = balanceReports[balanceReports.length - 1];
        const d = new Date(lastReport.time);
        const date = d.getDate();
        const dataSlice = timeFilter === 'onlyToday' 
            ? (() => {
                const index = balanceReports.findIndex(r => 
                    (new Date(r.time)).getDate() === date
                );
                firstOfDay = balanceReports[index];
                return balanceReports.length - index
            })() : 0;
        balanceReports = balanceReports.slice(0-dataSlice);



        // more code!

        let firstOfDay;
        const chartData = (() => {
            console.log({timeFilter})
            if (timeFilter === '2019') {
                return reportsToChartData.balanceChart(dayReports ? dayReports : []);
            }
            // nope not overall
            // data coming from balance reports
            
            const chartData = reportsToChartData.balanceChart(balanceReports);
            const withDiff = {
                ...chartData,
                datasets: [
                    {
                        ...chartData.datasets[0],
                        label: 'diff',
                        data: chartData.datasets[0].data.map((val, i) => val - chartData.datasets[2].data[i]),
                        borderWidth: 2,
                        borderColor: 'pink',
                    },
                    ...chartData.datasets,
                    
                ]
            };
            return withDiff
        })();


        // stats!
        const getStats = prop => {
            const first = balanceReports[0][prop];
            const last = balanceReports[balanceReports.length - 1][prop];
            return {
                absolute: last - first,
                trend: getTrend(last, first)
            };
        };

        const stats = mapObject({
            robinhood: 'accountBalance',
            alpaca: 'alpacaBalance'
        }, getStats);

        const showingSince = firstOfDay ? firstOfDay : balanceReports[0];
        return (
            <div style={{ padding: '30px 60px 30px 10px' }}>
                <table style={{ marginTop: '15px', width: '100%', textAlign: 'center' }}>
                    <tr>
                        <td>
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
                        </td>
                        <td style={{ fontSize: '80%', textAlign: 'right' }}>
                            trend since {new Date(showingSince.time).toLocaleString()}<br/>
                            {
                                Object.keys(stats).map(stat => (
                                    <div>
                                        {stat}:&nbsp;
                                        <b style={{ fontSize: '160%' }}>
                                            <TrendPerc value={stats[stat].absolute} dollar={true}  />
                                            (<TrendPerc value={stats[stat].trend} />)
                                        </b>
                                    </div>
                                ))
                            }
                        </td>
                    </tr>
                </table>
                <div>
                    <Line 
                        data={chartData} 
                        options={{ animation: !!timeFilter === '2019' }} 
                    />
                </div>
            </div>
        )
    }
}

export default DayReports;