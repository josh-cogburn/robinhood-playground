import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';


import ReactHintFactory from 'react-hint';
import 'react-hint/css/index.css'


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
import Analysis from './pages/Analysis';
import Scan from './pages/Scan';

import socketIOClient from "socket.io-client";

import ReactGA from 'react-ga';
ReactGA.initialize('UA-131761952-1', { debug: false });


const ReactHint = ReactHintFactory(React)

const renderTooltip = (target) => {
    const {tooltipStr} = target.dataset;
    // console.log(target.dataset)
    return (
        <pre className={'react-hint__content'}>
            {tooltipStr}
        </pre>
    );
};

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
        component: BalanceReports,
        // render: state => 
    },
    {
        label: "PM's",
        component: PmReport,
        render: state  => <PmReport {...state} />
    },
    
    {
        label: "Strategies",
        component: TodaysStrategies,
    },
    {
        label: 'Analysis',
        component: Analysis,
    },
    {
        label: 'Scan',
        component: Scan
    },
    {
        label: 'Positions',
        component: Positions,
    },
    // {
    //     label: 'Day Reports',
    //     component: DayReports
    // },
    {
        label: 'Settings',
        component: Settings,
    },
    {
        label: 'Cron',
        component: Cron,
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

    handlePageChange = (event, value) => {
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
    pullGit = () => {
        console.log('pull git')
        this.state.socket.emit('pullGit', data => window.alert(data));
    }
    restartProcess = () => {
        console.log('restartProcess')
        this.state.socket.emit('restartProcess', data => window.alert(data));
    }
    render () {
        const { value, predictionModels, pms, balanceReports, newPicksData } = this.state;
        const isLoading = !balanceReports || !balanceReports.length;
        console.log({
            isLoading,
            pms
        })
        // console.log({isLoading}, predictionModels.forPurchase)
        const PageComponent = pages[value].component;
        console.log(value, pages[value], {PageComponent});
        return (
            <div className="App">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            robinhood-playground from the <a href="#" onClick={this.auth}>new</a> server<br/>
                            <a href="https://github.com/chiefsmurph/robinhood-playground" target='_blank' style={{ color: 'darkorange', fontSize: '80%'}}>
                                https://github.com/chiefsmurph/robinhood-playground
                            </a>
                            <a onClick={this.pullGit}>⬇️</a>&nbsp;
                            <a onClick={this.restartProcess}>♻️</a>
                        </Typography>
                    </Toolbar>
                    <Tabs value={value} onChange={this.handlePageChange}>
                        { pages.map(({ label }) => <Tab label={label} />) }
                    </Tabs>
                </AppBar>


                <style>{`.react-hint__content { color: white; margin: 0; }`}</style>
                    
                <ReactHint persist
                    attribute="data-custom"
                    autoPosition events 
                    // className="custom-hint"
                    // events={{click: true}}
                    onRenderContent={renderTooltip}
                    // ref={(ref) => this.instance = ref} 
                />


                { isLoading ? (
                    <h1 style={{ textAlign: 'center' }}>loading</h1>
                ) : <PageComponent {...this.state} {...{ handlePageChange: this.handlePageChange }} />
                }

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
