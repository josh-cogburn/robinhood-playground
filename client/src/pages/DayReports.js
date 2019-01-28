import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import processDayReports from '../utils/reports-to-chartData';

class DayReports extends Component {
    componentDidMount() {
    }
    render () {
        let { dayReports, admin } = this.props;
        if (!dayReports) return <b>LOADING</b>;
        dayReports = dayReports.slice(4);
        console.log({ admin })
        return (
            <div>
                {
                    admin && (
                        <div>
                            <h2>unrealized vs realized return %</h2>
                            <Line data={processDayReports.unrealizedVsRealized(dayReports)} />
                        </div>
                    )
                }
                <h2>forPurchase PM</h2>
                <Line data={processDayReports.spyVsForPurchase(dayReports)} />
                <h2>pick to execution %</h2>
                <Line data={processDayReports.pickToExecutionPerc(dayReports)} />
                <h2>fill perc %</h2>
                <Line data={processDayReports.fillPerc(dayReports)} />
            </div>
        )
    }
}

export default DayReports;