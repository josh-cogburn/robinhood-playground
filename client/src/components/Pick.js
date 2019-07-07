import React, { Component } from 'react';
import TrendPerc from './TrendPerc';
import TradingViewWidget from 'react-tradingview-widget';

class Pick extends Component {
    state = {
        showingDetails: false
    };
    toggleDetails = () => {
        console.log('toggle!');
        this.setState({ showingDetails: !this.state.showingDetails })
    };
    render() {
        
        const { showingDetails } = this.state;
        const { pick, fiveDay } = this.props;
        let percUpFontSize = fiveDay ? fiveDay.percUp * 100.4 : 100;
        if (fiveDay && fiveDay.avgTrend > 1) percUpFontSize *= 1.9;
        // pick.keys && console.log({ pick })
        return (
            <div className="pick" style={{ fontSize: Math.max(percUpFontSize, 39) + '%'}}>
                <button onClick={this.toggleDetails}>
                    {showingDetails ? '-' : '+'}
                </button>
                <b><TrendPerc value={pick.avgTrend} /></b>
                <strong>{' ' + pick.stratMin}</strong><br/>
                <small>{new Date(pick.timestamp).toLocaleString()}</small>
                <hr/>
                {fiveDay && (
                  <i>
                    5 day - avgTrend <TrendPerc value={fiveDay.avgTrend} />%
                    - percUp <TrendPerc value={fiveDay.percUp * 100} redAt={50} />
                    - count {fiveDay.count}
                  </i>
                )}
                {
                    showingDetails || true
                        ? pick.withTrend
                            .filter(val => !!val)
                            .map(tickerObj => (
                                <div>
                                    <table>
                                        <thead>
                                            <th>ticker</th>
                                            <th>thenPrice</th>
                                            <th>nowPrice</th>
                                            <th>trend</th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{tickerObj.ticker}</td>
                                                <td>{tickerObj.thenPrice}</td>
                                                <td>{tickerObj.nowPrice}</td>
                                                <td>{tickerObj.trend}%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {/* <div style={{ width: '980px', height: '610px'}}>
                                        <TradingViewWidget symbol={tickerObj.ticker} range='5d' style='8' width={980} height={610} /> 
                                    </div> */}
                                </div>
                            ))
                        : null                    
                }
            </div>
        );
    }
}

export default Pick;