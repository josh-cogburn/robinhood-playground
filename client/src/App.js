import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import BalanceReports from './pages/BalanceReports';
import TodaysStrategies from './pages/TodaysStrategies';
import DayReports from './pages/DayReports';
import Settings from './pages/Settings';
import Cron from './pages/Cron';

import socketIOClient from "socket.io-client";

import ReactGA from 'react-ga';
ReactGA.initialize('UA-131761952-1', { debug: true });

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

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

const pages = [
    {
        label: 'Realtime',
        // render: state => 
    },
    {
        label: "Today's Strategies",
        render: state  => <TodaysStrategies {...state} />
    },
    {
        label: 'Day Reports',
        render: state => <DayReports {...state } />,
    },
    {
        label: 'Settings',
        render: state => <Settings {...state} />
    },
    {
        label: 'Cron',
        render: state => <Cron {...state} />
    }
];



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
            console.log(data, 'welcome')
            this.setState(data);
        });
        socket.on('server:related-prices', data => {
            console.log({ relatedPrices: data });
            this.setState({ relatedPrices: data });
        });
        socket.emit('getDayReports', data => {
            console.log({ data});
            this.setState(data);
        });
        socket.on('server:balance-report', data => {
            // this.setState({ balance: data });
            console.log(data, 'balcn');
            this.setState(({ balanceReports }) => ({
                balanceReports: balanceReports.concat(data.report)
            }));
        });
        this.setState({ socket });
        ReactGA.pageview(window.location.pathname + 'index');
    }

    handleChange = (event, value) => {
        ReactGA.pageview(window.location.pathname + camelize(pages[value].label.replace(/'/g, '')));
        this.setState({ value });
    };

    render () {
        const { value, dayReports, predictionModels, balanceReports } = this.state;
        const isLoading = !predictionModels || !predictionModels.forPurchase;

        // console.log({isLoading}, predictionModels.forPurchase)

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
                        { pages.map(({ label }) => <Tab label={label} />) }
                    </Tabs>
                </AppBar>


                { isLoading ? (
                    <h1 style={{ textAlign: 'center' }}>loading</h1>
                ) : (
                    <div>
                            {/* // pages[value].render({ state: this.state }) */}
                        {value === 0 && <BalanceReports reports={balanceReports} />}
                        {value === 1 && <TodaysStrategies {...this.state}  />}
                        {value === 2 && <DayReports {...{ dayReports }} />}
                        {value === 3 && <Settings {...this.state} />}
                        {value === 4 && <Cron {...this.state} />}
                    </div>
                )}

                {/* <TabContainer> */}
                    
                {/* </TabContainer> */}
                
            </div>
        );
    }
    
}

export default App;
