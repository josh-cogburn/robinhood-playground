import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Popup from "reactjs-popup";

import PmReport from './pages/PmReport';
import BalanceReports from './pages/BalanceReports';
import TodaysStrategies from './pages/TodaysStrategies';
import Positions from './pages/Positions';
import DayReports from './pages/DayReports';
import Settings from './pages/Settings';
import Cron from './pages/Cron';

import socketIOClient from "socket.io-client";

import ReactGA from 'react-ga';
ReactGA.initialize('UA-131761952-1', { debug: false });

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
        label: 'Balance Trend',
        // render: state => 
    },
    {
        label: "PM's",
        render: state  => <PmReport {...state} />
    },
    {
        label: "Strategies",
        render: state  => <TodaysStrategies {...state} />
    },
    {
        label: 'Positions',
        render: state => <Positions {...state } />,
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
        const socketEndpoint = origin.includes('localhost') ? 'http://localhost:3000' : 'http://107.173.6.167:3000';
        const socket = socketIOClient(socketEndpoint);

        const isForPurchase = strat => {
            const { predictionModels: { forPurchase } = {} } = this.state;
            if (!forPurchase || !forPurchase.length) {
                return false;
            }
            return forPurchase.includes(strat);
        };
        const handlePick = data => {
            console.log(data);
            this.setState({
                picks: [data].concat(this.state.picks),
            });
            if (!isForPurchase(data.stratMin)) {
                return;
            }
            this.setState({
                newPicksData: data
            })
            setTimeout(() => {
                this.setState({
                    newPicksData: null
                });
            }, 10000);
        };
        socket.on('server:picks-data', handlePick);
        // setTimeout(() => {
        //     const fakePick = {
        //         "stratMin": "fake-pick-fake-pick",
        //         "withPrices": [
        //           {
        //             "_id": "5c4b18084d16ab0849176862",
        //             "ticker": "OGZPY",
        //             "price": 4.86
        //           }
        //         ]
        //       };
        //       handlePick(fakePick);
        // }, 5000)
        socket.on('server:welcome', data => {
            console.log(data, 'welcome')
            this.setState(data);
        });
        socket.on('server:related-prices', data => {
            console.log({ relatedPrices: data });
            this.setState({ relatedPrices: data });
        });
        socket.on('server:pm-perfs', data => {
            console.log({ pmPerfs: data });
            this.setState({ pmPerfs: data });
        });
        socket.emit('getDayReports', data => {
            console.log({ data});
            this.setState(data);
        });
        socket.on('server:balance-report', data => {
            // this.setState({ balance: data });
            console.log(data, 'balcn');
            this.setState(({ balanceReports }) => ({
                balanceReports: (balanceReports || []).concat(data.report)
            }));
        });
        this.setState({ socket });
        ReactGA.pageview(window.location.pathname + 'index');
    }

    handleChange = (event, value) => {
        ReactGA.pageview(window.location.pathname + camelize(pages[value].label.replace(/'/g, '')));
        this.setState({ value });
    };

    auth = () => {
        const rabbit = window.prompt('heyyyy there?');
        if (rabbit === 'j') {
            console.log({ rabbit })
            this.setState({ admin: true }, () => console.log(this.state));
        }
    }

    render () {
        const { value, predictionModels, balanceReports, newPicksData } = this.state;
        const isLoading = !predictionModels || !predictionModels.forPurchase;

        // console.log({isLoading}, predictionModels.forPurchase)

        return (
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            robinhood-playground from the <a href="#" onClick={this.auth}>new</a> server<br/>
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
                        {value === 0 && <BalanceReports {...this.state} />}
                        {value === 1 && <PmReport {...this.state}  />}
                        {value === 2 && <TodaysStrategies {...this.state}  />}
                        {value === 3 && <Positions {...this.state} />}
                        {value === 4 && <DayReports {...this.state} />}
                        {value === 5 && <Settings {...this.state} />}
                        {value === 6 && <Cron {...this.state} />}
                    </div>
                )}

                <Popup position="right center" modal open={newPicksData}>
                    <h2>ALERT ALERT NEW <b>PICK</b></h2>
                    <pre>{JSON.stringify(newPicksData, null, 2)}</pre>
                </Popup>

                {/* <TabContainer> */}
                    
                {/* </TabContainer> */}
                
            </div>
        );
    }
    
}

export default App;
