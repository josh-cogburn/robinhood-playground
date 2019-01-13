import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import reportsToChartData from '../utils/reports-to-chartData';

class DayReports extends Component {
    constructor() {
        super();
        this.state = { reportSlice: 0 };
    }
    componentDidMount() {
        setTimeout(this.startReplay, 3000);
    }
    startReplay = () => {
        // console.log({})
        this.setState(({ reportSlice }) => ({ reportSlice: reportSlice + 53 }))
        setTimeout(this.startReplay, 0)
    }
    render () {
        let { reports } = this.props;
        let { reportSlice }= this.state;
        if (!reports) return <b>LOADING</b>;
        reports = [
            ...new Array(Math.max(1300 - reportSlice, 0)).fill(reports[0]),
            ...reports.slice(0, reportSlice)
        ];

        console.log(reports);

        const options = {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            hover: {
                mode: 'label'
            },
            scales: {
                yAxes: [{
                        display: true,
                        ticks: {
                            min: 96.5,
                            max: 102
                        }
                    }]
            },
            title: {
                display: true,
                text: 'Account Balance vs Major Stock Indexes'
            }
        };
        return (
            <div style={{ padding: '40px' }}>
                <Line data={reportsToChartData.balanceChart(reports)} options={options} />
                {/* <pre>   
                    {JSON.stringify(reports, null, 2)}
                </pre> */}
            </div>
        )
    }
}

export default DayReports;