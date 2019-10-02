import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import InputRange from 'react-input-range';

import reportsToChartData from '../utils/reports-to-chartData';
import TrendPerc from '../components/TrendPerc';
import getTrend from '../utils/get-trend';
import _, { mapObject } from 'underscore';

function get(obj, path) {
    var nPath, remainingPath;
    if (!obj && !path) {
        return undefined;
    } else {
        var paths;

        if (!_.isEmpty(path.match(/^\[\d\]/))) {
            paths = path.replace(/^[\[\]]/g, '').split(/\./);
            nPath = _.first(paths[0].replace(/\]/, ''));
        } else {
            paths = path.split(/[\.\[]/);
            nPath = _.first(paths);
        }

        remainingPath = _.reduce(_.rest(paths), function(result, item) {
            if (!_.isEmpty(item)) {
                if (item.match(/^\d\]/)) {
                    item = "[" + item;
            }
                result.push(item);
            }

            return result;
        }, []).join('.');

        if (_.isEmpty(remainingPath)) {
            return obj[nPath];
        } else {
            return _.has(obj, nPath) && get(obj[nPath], remainingPath);
        }
    }
}

console.log(
    get(
        {
            a: 1,
            b: { c: 3 }
        },
        'b.c'
    )
)

class DayReports extends Component {
    constructor() {
        super();
        this.state = {
            timeFilter: 'onlyToday',
            numDaysToShow: 1
        };
    }
    componentDidMount() {
    }
    setTimeFilter = timeFilter => this.setState({ timeFilter });
    render () {
        let { balanceReports, dayReports, admin } = this.props;
        let { timeFilter, numDaysToShow } = this.state;
        if (!balanceReports || !balanceReports.length) return <b>LOADING</b>;


        // filter balance reports
        const lastReport = balanceReports[balanceReports.length - 1];
        const d = new Date(lastReport.time);

        const allDates = [...new Set(balanceReports.map(report => (new Date(report.time)).toLocaleDateString()))];
        // const numDaysToShow = timeFilter === 'onlyToday' ? 1 : allDates.length;

        const startIndex = (() => {
            const startDate = allDates[allDates.length - numDaysToShow - 1];
            const lastRegularReport = !startDate ? 0 : balanceReports.length - balanceReports.slice().reverse().findIndex(report =>
                (new Date(report.time)).toLocaleDateString() === startDate && report.isRegularHours
            );
            return lastRegularReport;
        })();

        balanceReports = balanceReports.slice(startIndex);

        // const numToShow = numDaysToShow === 1
        //     ? (() => {
        //         const index = balanceReports.slice().reverse().findIndex(r => 
        //             (new Date(r.time)).getDate() !== date
        //         );
        //         console.log({ index})
        //         firstOfDay = balanceReports[balanceReports.length - index];
        //         return balanceReports.length - index
        //     })() : 0;
        // balanceReports = balanceReports.slice(0 - dataSlice);

        console.log({ balanceReports})

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
            const first = get(balanceReports[0], prop);
            const last = get(balanceReports[balanceReports.length - 1], prop);
            return {
                absolute: last - first,
                trend: getTrend(last, first)
            };
        };

        const stats = mapObject({
            alpaca: 'alpacaBalance',
            robinhood: 'accountBalance',
        }, getStats);

        const indexStats = mapObject({
            nasdaq: 'indexPrices.nasdaq',
            russell2000: 'indexPrices.russell2000',
            sp500: 'indexPrices.sp500'
        }, getStats)

        console.log({ indexStats})
        const showingSince = firstOfDay ? firstOfDay : balanceReports[0];
        return (
            <div style={{ padding: '30px 60px 30px 10px' }}>
                <table style={{ marginBottom: '20px', width: '100%', textAlign: 'left' }}>
                    <tr>
                        <td style={{ paddingLeft: '5em' }}>
                            number of days to show... <a href="#" onClick={() => this.setState({ numDaysToShow: 1 })}>[reset]</a>
                            <InputRange
                                maxValue={7}
                                minValue={1}
                                step={1}
                                // formatLabel={value => value.toFixed(2)}
                                value={this.state.numDaysToShow}
                                onChange={numDaysToShow => this.setState({ numDaysToShow })}
                                // onChange={value => console.log(value)} 
                            />
                            {/* {
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
                            } */}
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
                        <td style={{ fontSize: '80%', textAlign: 'center' }}>
                            {
                                Object.keys(indexStats).map(stat => (
                                    <div>
                                        {stat}:&nbsp;
                                        <b style={{ fontSize: '100%' }}>
                                            {/* <TrendPerc value={indexStats[stat].absolute} dollar={true}  /> */}
                                            <TrendPerc value={indexStats[stat].trend} />
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