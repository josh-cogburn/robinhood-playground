import React, { Component } from 'react';
import TrendPerc from './TrendPerc';

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
        return (
            <div className="pick" style={{ fontSize: Math.max(percUpFontSize, 39) + '%'}}>
                <button onClick={this.toggleDetails}>
                    {showingDetails ? '-' : '+'}
                </button>
                <b><TrendPerc value={pick.avgTrend} /></b>
                <strong>{' ' + pick.stratMin}</strong>
                <hr/>
                {fiveDay && (
                  <i>
                    5 day - avgTrend <TrendPerc value={fiveDay.avgTrend} />%
                    - percUp <TrendPerc value={fiveDay.percUp * 100} redAt={50} />
                    - count {fiveDay.count}
                  </i>
                )}
                {
                  showingDetails && (
                      <table>
                          <thead>
                              <th>ticker</th>
                              <th>thenPrice</th>
                              <th>nowPrice</th>
                              <th>trend</th>
                          </thead>
                          <tbody>
                              {
                                  pick.withTrend.filter(val => !!val).map(tickerObj => (
                                      <tr>
                                          <td>{tickerObj.ticker}</td>
                                          <td>{tickerObj.thenPrice}</td>
                                          <td>{tickerObj.nowPrice}</td>
                                          <td>{tickerObj.trend}%</td>
                                      </tr>
                                  ))
                              }
                          </tbody>
                      </table>
                  )
                }
  
            </div>
        );
    }
}

export default Pick;