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
        let { timeFilter } = this.state;
        if (!balanceReports || !balanceReports.length) return <b>LOADING</b>;

        let firstOfDay;
        const chartData = (() => {
            console.log({timeFilter})
            if (timeFilter === '2019') {
                return reportsToChartData.balanceChart(dayReports ? dayReports : []);
            }
            // nope not overall
            // data coming from balance reports
                
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

            const chartData = reportsToChartData.balanceChart(balanceReports.slice(0-dataSlice));

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

        const { data } = chartData.datasets[1];
        const curTrend = data[data.length - 1];

        const showingSince = firstOfDay ? firstOfDay : balanceReports[0];
        return (
            <div style={{ padding: '30px 40px' }}>
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
                <br/>
                <small>
                    trend since {new Date(showingSince.time).toLocaleString()}:&nbsp;
                    <b style={{ fontSize: '160%' }}><TrendPerc value={curTrend} /></b>
                </small>
                {/* <h2></h2> */}

                
                <Line 
                    data={chartData} 
                    options={{ animation: !!timeFilter === '2019' }} 
                />
                
                
                
                {/* <pre>   
                    {JSON.stringify(balanceReports, null, 2)}
                </pre> */}
            </div>
        )
    }
}

export default DayReports;