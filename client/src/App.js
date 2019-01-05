import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import TodaysStrategies from './pages/TodaysStrategies';
import DayReports from './pages/DayReports';
import socketIOClient from "socket.io-client";


function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
        </Typography>
    );
}
  
TabContainer.propTypes = {
    children: PropTypes.node.isRequired
};

class App extends Component {
    state = {
        value: 0,
        socket: null
    };

    componentDidMount() {
        let { origin } = window.location;
        const socketEndpoint = origin.includes('localhost') && false ? 'http://localhost:3000' : 'http://107.173.6.167:3000';
        const socket = socketIOClient(socketEndpoint);
        socket.on('server:picks-data', data => {
            console.log(data);
            this.setState({
                picks: [data].concat(this.state.picks)
            });
        });
        socket.on('server:welcome', data => {
            this.setState(data);
        });
        socket.on('server:related-prices', data => {
            this.setState({ relatedPrices: data });
        });
        socket.emit('getDayReports', data => {
            console.log({ data});
            this.setState(data);
        });
        this.setState({ socket });
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render () {
        const { value, dayReports, predictionModels } = this.state;
        const isLoading = !predictionModels || !predictionModels.forPurchase;
        return (
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            robinhood-playground from the new server<br/>
                            <a href="https://github.com/chiefsmurph/robinhood-playground" target='_blank' style={{ color: 'darkorange', fontSize: '80%'}}>
                                https://github.com/chiefsmurph/robinhood-playground
                            </a>
                        </Typography>
                    </Toolbar>
                    <Tabs value={value} onChange={this.handleChange}>
                        <Tab label="Today's Strategies" />
                        <Tab label="Day Reports" />
                    </Tabs>
                </AppBar>


                { isLoading ? (
                    <h1 style={{ textAlign: 'center' }}>loading</h1>
                ) : (
                    <div>
                        {value === 0 && <TodaysStrategies {...this.state}  />}
                        {value === 1 && <DayReports {...{ dayReports }} />}
                    </div>
                )}

                {/* <TabContainer> */}
                    
                {/* </TabContainer> */}
                
            </div>
        );
    }
    
}

export default App;
