import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import TodaysStrategies from './pages/TodaysStrategies';
import socketIOClient from "socket.io-client";

const DayReports = () => (
    <b>Day Reports</b>
);

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
        const socketEndpoint = origin.includes('localhost') ? 'http://localhost:3000' : 'http://192.227.186.138:3000';
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
        this.setState({ socket });
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render () {
        const { value, socket } = this.state;
        return (
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                        robinhood-playground
                        </Typography>
                    </Toolbar>
                    <Tabs value={value} onChange={this.handleChange}>
                        <Tab label="Day Reports" />
                        <Tab label="Today's Strategies" />
                        <Tab label="Live View" />
                    </Tabs>
                </AppBar>

                {/* <TabContainer> */}
                    {value === 0 && <DayReports {...{ socket }} />}
                    {value === 1 && <TodaysStrategies {...this.state}  />}
                    {/* {value === 2 && <TabContainer>Item Three</TabContainer>} */}
                {/* </TabContainer> */}
                
            </div>
        );
    }
    
}

export default App;
