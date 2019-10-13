import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';


import ReactModal from 'react-modal';
import PickGraphs from './components/PickGraphs';


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
import { partition, mapObject } from 'underscore';
import getTrend from './utils/get-trend';

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


const matchesPm = (stratMin, pm, pms) => {
    const arrayOfArrays = pms[pm] || [];
    return arrayOfArrays.some(parts => {
        parts = Array.isArray(parts) ? parts : [parts];
        return parts.every(part => stratMin.includes(part));
    });
    // return pms[pm] && pms[pm].every(part => strat === part || strat.includes(`${part}-`) || strat.includes(`-${part}`));
}

const isForPurchase = (stratMin, settings = {}, pms) => {

    let [forPurchasePms, forPurchaseStrats] = partition(
        settings.forPurchase || [],
        line => (line.startsWith('[') && line.endsWith(']'))
    );

    forPurchasePms = forPurchasePms.map(line => line.substring(1, line.length - 1));
    // console.log({ forPurchasePms, forPurchaseStrats})

    return (
        forPurchaseStrats.includes(stratMin) ||
        forPurchasePms.some(pm => 
            matchesPm(stratMin, pm, pms)
        )
    );


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

        setTimeout(() => {
            const { settings, pms } = this.state;
            console.log({
                test: isForPurchase('sudden-drops-fitty-5min-minorJump-down10-firstAlert-notWatchout-lunch-5000', settings, pms),
                settings,
                pms
            })
            const fakePick = {
                "_id": "5da0a95fad778f18a801f6b5",
                "date": "10-11-2019",
                "strategyName": "sudden-drops-fitty-5min-minorJump-down10-firstAlert-notWatchout-lunch",
                "min": 5000,
                "picks": [
                  {
                    "_id": "5da0a95fad778f18a801f6b6",
                    "ticker": "AIHS",
                    "price": 0.2962
                  }
                ],
                "keys": {
                  "minorJump": true,
                  "down10": true
                },
                "isRecommended": true,
                "timestamp": "2019-10-11T16:10:07.726Z",
                "__v": 0,
                "stratMin": "sudden-drops-fitty-5min-minorJump-down10-firstAlert-notWatchout-lunch-5000",
                "withPrices": [
                  {
                    "_id": "5da0a95fad778f18a801f6b6",
                    "ticker": "AIHS",
                    "price": 0.2962
                  }
                ],
                "avgTrend": 2.7,
                "withTrend": [
                  {
                    "ticker": "AIHS",
                    "thenPrice": 0.2962,
                    "nowPrice": 0.3042,
                    "trend": 2.7
                  }
                ],
                "data": {
                  "min": 0.32,
                  "mostRecent": 0.2962,
                  "trendFromMin": -7.44,
                  "allPrices": [
                    {
                      "begins_at": "2019-10-07T13:30:00Z",
                      "open_price": 0.34,
                      "close_price": 0.335,
                      "high_price": 0.34,
                      "low_price": 0.335,
                      "volume": 530,
                      "session": "reg",
                      "interpolated": false,
                      "currentPrice": 0.335,
                      "timestamp": 1570455300000
                    },
                    {
                      "begins_at": "2019-10-07T13:35:00Z",
                      "open_price": 0.3111,
                      "close_price": 0.3101,
                      "high_price": 0.3111,
                      "low_price": 0.3101,
                      "volume": 1548,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -7.43,
                      "currentPrice": 0.3101,
                      "timestamp": 1570455600000
                    },
                    {
                      "begins_at": "2019-10-07T13:40:00Z",
                      "open_price": 0.3101,
                      "close_price": 0.3,
                      "high_price": 0.3101,
                      "low_price": 0.3,
                      "volume": 2619,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -3.26,
                      "currentPrice": 0.3,
                      "timestamp": 1570455900000
                    },
                    {
                      "begins_at": "2019-10-07T13:50:00Z",
                      "open_price": 0.3001,
                      "close_price": 0.3003,
                      "high_price": 0.3003,
                      "low_price": 0.3001,
                      "volume": 3500,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.1,
                      "currentPrice": 0.3003,
                      "timestamp": 1570456500000
                    },
                    {
                      "begins_at": "2019-10-07T13:55:00Z",
                      "open_price": 0.3099,
                      "close_price": 0.3003,
                      "high_price": 0.3099,
                      "low_price": 0.3003,
                      "volume": 1451,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.3003,
                      "timestamp": 1570456800000
                    },
                    {
                      "begins_at": "2019-10-07T14:00:00Z",
                      "open_price": 0.3099,
                      "close_price": 0.3099,
                      "high_price": 0.3099,
                      "low_price": 0.3099,
                      "volume": 500,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 3.2,
                      "currentPrice": 0.3099,
                      "timestamp": 1570457100000
                    },
                    {
                      "begins_at": "2019-10-07T14:05:00Z",
                      "open_price": 0.3075,
                      "close_price": 0.3099,
                      "high_price": 0.3099,
                      "low_price": 0.3075,
                      "volume": 400,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.3099,
                      "timestamp": 1570457400000
                    },
                    {
                      "begins_at": "2019-10-07T14:10:00Z",
                      "open_price": 0.3254,
                      "close_price": 0.3254,
                      "high_price": 0.3254,
                      "low_price": 0.3254,
                      "volume": 500,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 5,
                      "currentPrice": 0.3254,
                      "timestamp": 1570457700000
                    },
                    {
                      "begins_at": "2019-10-07T14:20:00Z",
                      "open_price": 0.3254,
                      "close_price": 0.305,
                      "high_price": 0.329,
                      "low_price": 0.305,
                      "volume": 8679,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -6.27,
                      "currentPrice": 0.305,
                      "timestamp": 1570458300000
                    },
                    {
                      "begins_at": "2019-10-07T14:30:00Z",
                      "open_price": 0.315,
                      "close_price": 0.3289,
                      "high_price": 0.3289,
                      "low_price": 0.315,
                      "volume": 4800,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 7.84,
                      "currentPrice": 0.3289,
                      "timestamp": 1570458900000
                    },
                    {
                      "begins_at": "2019-10-07T14:45:00Z",
                      "open_price": 0.3289,
                      "close_price": 0.32,
                      "high_price": 0.3289,
                      "low_price": 0.32,
                      "volume": 2300,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -2.71,
                      "currentPrice": 0.32,
                      "timestamp": 1570459800000
                    },
                    {
                      "begins_at": "2019-10-07T14:50:00Z",
                      "open_price": 0.32,
                      "close_price": 0.32,
                      "high_price": 0.32,
                      "low_price": 0.32,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.32,
                      "timestamp": 1570460100000
                    },
                    {
                      "begins_at": "2019-10-07T14:55:00Z",
                      "open_price": 0.32,
                      "close_price": 0.32,
                      "high_price": 0.32,
                      "low_price": 0.32,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.32,
                      "timestamp": 1570460400000
                    },
                    {
                      "begins_at": "2019-10-07T15:10:00Z",
                      "open_price": 0.325,
                      "close_price": 0.329,
                      "high_price": 0.329,
                      "low_price": 0.3151,
                      "volume": 2753,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 2.81,
                      "currentPrice": 0.329,
                      "timestamp": 1570461300000
                    },
                    {
                      "begins_at": "2019-10-07T15:15:00Z",
                      "open_price": 0.3344,
                      "close_price": 0.35,
                      "high_price": 0.355,
                      "low_price": 0.3301,
                      "volume": 14185,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 6.38,
                      "currentPrice": 0.35,
                      "timestamp": 1570461600000
                    },
                    {
                      "begins_at": "2019-10-07T15:20:00Z",
                      "open_price": 0.35,
                      "close_price": 0.36,
                      "high_price": 0.3601,
                      "low_price": 0.3385,
                      "volume": 3600,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 2.86,
                      "currentPrice": 0.36,
                      "timestamp": 1570461900000
                    },
                    {
                      "begins_at": "2019-10-07T15:25:00Z",
                      "open_price": 0.37,
                      "close_price": 0.36,
                      "high_price": 0.37,
                      "low_price": 0.36,
                      "volume": 2900,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.36,
                      "timestamp": 1570462200000
                    },
                    {
                      "begins_at": "2019-10-07T15:30:00Z",
                      "open_price": 0.3501,
                      "close_price": 0.3501,
                      "high_price": 0.3501,
                      "low_price": 0.3501,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -2.75,
                      "currentPrice": 0.3501,
                      "timestamp": 1570462500000
                    },
                    {
                      "begins_at": "2019-10-07T15:35:00Z",
                      "open_price": 0.3501,
                      "close_price": 0.3501,
                      "high_price": 0.3501,
                      "low_price": 0.3501,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.3501,
                      "timestamp": 1570462800000
                    },
                    {
                      "begins_at": "2019-10-07T15:40:00Z",
                      "open_price": 0.333,
                      "close_price": 0.333,
                      "high_price": 0.333,
                      "low_price": 0.333,
                      "volume": 600,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -4.88,
                      "currentPrice": 0.333,
                      "timestamp": 1570463100000
                    },
                    {
                      "begins_at": "2019-10-07T16:25:00Z",
                      "open_price": 0.348,
                      "close_price": 0.3332,
                      "high_price": 0.348,
                      "low_price": 0.3332,
                      "volume": 697,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.06,
                      "currentPrice": 0.3332,
                      "timestamp": 1570465800000
                    },
                    {
                      "begins_at": "2019-10-07T16:55:00Z",
                      "open_price": 0.3459,
                      "close_price": 0.3459,
                      "high_price": 0.3459,
                      "low_price": 0.3459,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 3.81,
                      "currentPrice": 0.3459,
                      "timestamp": 1570467600000
                    },
                    {
                      "begins_at": "2019-10-07T17:05:00Z",
                      "open_price": 0.3402,
                      "close_price": 0.3402,
                      "high_price": 0.3402,
                      "low_price": 0.3402,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -1.65,
                      "currentPrice": 0.3402,
                      "timestamp": 1570468200000
                    },
                    {
                      "begins_at": "2019-10-07T17:10:00Z",
                      "open_price": 0.3401,
                      "close_price": 0.3399,
                      "high_price": 0.3401,
                      "low_price": 0.3222,
                      "volume": 800,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -0.09,
                      "currentPrice": 0.3399,
                      "timestamp": 1570468500000
                    },
                    {
                      "begins_at": "2019-10-07T18:00:00Z",
                      "open_price": 0.335,
                      "close_price": 0.335,
                      "high_price": 0.335,
                      "low_price": 0.335,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -1.44,
                      "currentPrice": 0.335,
                      "timestamp": 1570471500000
                    },
                    {
                      "begins_at": "2019-10-07T19:00:00Z",
                      "open_price": 0.335,
                      "close_price": 0.335,
                      "high_price": 0.335,
                      "low_price": 0.335,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.335,
                      "timestamp": 1570475100000
                    },
                    {
                      "begins_at": "2019-10-07T19:10:00Z",
                      "open_price": 0.3301,
                      "close_price": 0.3201,
                      "high_price": 0.3301,
                      "low_price": 0.3201,
                      "volume": 1550,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -4.45,
                      "currentPrice": 0.3201,
                      "timestamp": 1570475700000
                    },
                    {
                      "begins_at": "2019-10-07T19:35:00Z",
                      "open_price": 0.3351,
                      "close_price": 0.335,
                      "high_price": 0.3351,
                      "low_price": 0.335,
                      "volume": 800,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 4.65,
                      "currentPrice": 0.335,
                      "timestamp": 1570477200000
                    },
                    {
                      "begins_at": "2019-10-08T13:30:00Z",
                      "open_price": 0.3295,
                      "close_price": 0.3499,
                      "high_price": 0.3499,
                      "low_price": 0.3295,
                      "volume": 691,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 4.45,
                      "currentPrice": 0.3499,
                      "timestamp": 1570541700000
                    },
                    {
                      "begins_at": "2019-10-08T13:40:00Z",
                      "open_price": 0.312,
                      "close_price": 0.312,
                      "high_price": 0.312,
                      "low_price": 0.312,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -10.83,
                      "currentPrice": 0.312,
                      "timestamp": 1570542300000
                    },
                    {
                      "begins_at": "2019-10-08T13:45:00Z",
                      "open_price": 0.3121,
                      "close_price": 0.3121,
                      "high_price": 0.3121,
                      "low_price": 0.3121,
                      "volume": 211,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.03,
                      "currentPrice": 0.3121,
                      "timestamp": 1570542600000
                    },
                    {
                      "begins_at": "2019-10-08T13:55:00Z",
                      "open_price": 0.3304,
                      "close_price": 0.3304,
                      "high_price": 0.3304,
                      "low_price": 0.3304,
                      "volume": 646,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 5.86,
                      "currentPrice": 0.3304,
                      "timestamp": 1570543200000
                    },
                    {
                      "begins_at": "2019-10-08T14:40:00Z",
                      "open_price": 0.344,
                      "close_price": 0.344,
                      "high_price": 0.344,
                      "low_price": 0.344,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 4.12,
                      "currentPrice": 0.344,
                      "timestamp": 1570545900000
                    },
                    {
                      "begins_at": "2019-10-08T14:55:00Z",
                      "open_price": 0.331,
                      "close_price": 0.331,
                      "high_price": 0.331,
                      "low_price": 0.331,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -3.78,
                      "currentPrice": 0.331,
                      "timestamp": 1570546800000
                    },
                    {
                      "begins_at": "2019-10-08T16:00:00Z",
                      "open_price": 0.3311,
                      "close_price": 0.3311,
                      "high_price": 0.3311,
                      "low_price": 0.3311,
                      "volume": 300,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.03,
                      "currentPrice": 0.3311,
                      "timestamp": 1570550700000
                    },
                    {
                      "begins_at": "2019-10-08T16:45:00Z",
                      "open_price": 0.3395,
                      "close_price": 0.3395,
                      "high_price": 0.3395,
                      "low_price": 0.3395,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 2.54,
                      "currentPrice": 0.3395,
                      "timestamp": 1570553400000
                    },
                    {
                      "begins_at": "2019-10-08T17:00:00Z",
                      "open_price": 0.3377,
                      "close_price": 0.3311,
                      "high_price": 0.3377,
                      "low_price": 0.3311,
                      "volume": 2655,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -2.47,
                      "currentPrice": 0.3311,
                      "timestamp": 1570554300000
                    },
                    {
                      "begins_at": "2019-10-08T17:30:00Z",
                      "open_price": 0.3391,
                      "close_price": 0.3391,
                      "high_price": 0.3391,
                      "low_price": 0.3391,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 2.42,
                      "currentPrice": 0.3391,
                      "timestamp": 1570556100000
                    },
                    {
                      "begins_at": "2019-10-08T17:40:00Z",
                      "open_price": 0.339,
                      "close_price": 0.339,
                      "high_price": 0.339,
                      "low_price": 0.339,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -0.03,
                      "currentPrice": 0.339,
                      "timestamp": 1570556700000
                    },
                    {
                      "begins_at": "2019-10-08T18:00:00Z",
                      "open_price": 0.3311,
                      "close_price": 0.33,
                      "high_price": 0.3311,
                      "low_price": 0.33,
                      "volume": 2900,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -2.65,
                      "currentPrice": 0.33,
                      "timestamp": 1570557900000
                    },
                    {
                      "begins_at": "2019-10-08T18:05:00Z",
                      "open_price": 0.315,
                      "close_price": 0.315,
                      "high_price": 0.315,
                      "low_price": 0.315,
                      "volume": 1100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -4.55,
                      "currentPrice": 0.315,
                      "timestamp": 1570558200000
                    },
                    {
                      "begins_at": "2019-10-08T18:50:00Z",
                      "open_price": 0.3292,
                      "close_price": 0.3221,
                      "high_price": 0.3292,
                      "low_price": 0.3221,
                      "volume": 3200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 2.25,
                      "currentPrice": 0.3221,
                      "timestamp": 1570560900000
                    },
                    {
                      "begins_at": "2019-10-08T19:50:00Z",
                      "open_price": 0.3168,
                      "close_price": 0.315,
                      "high_price": 0.3168,
                      "low_price": 0.315,
                      "volume": 1050,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -2.2,
                      "currentPrice": 0.315,
                      "timestamp": 1570564500000
                    },
                    {
                      "begins_at": "2019-10-09T14:00:00Z",
                      "open_price": 0.31,
                      "close_price": 0.305,
                      "high_price": 0.31,
                      "low_price": 0.305,
                      "volume": 900,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -3.17,
                      "currentPrice": 0.305,
                      "timestamp": 1570629900000
                    },
                    {
                      "begins_at": "2019-10-09T14:05:00Z",
                      "open_price": 0.3164,
                      "close_price": 0.3115,
                      "high_price": 0.32,
                      "low_price": 0.3017,
                      "volume": 12000,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 2.13,
                      "currentPrice": 0.3115,
                      "timestamp": 1570630200000
                    },
                    {
                      "begins_at": "2019-10-09T14:10:00Z",
                      "open_price": 0.3051,
                      "close_price": 0.3051,
                      "high_price": 0.3051,
                      "low_price": 0.3051,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -2.05,
                      "currentPrice": 0.3051,
                      "timestamp": 1570630500000
                    },
                    {
                      "begins_at": "2019-10-09T14:30:00Z",
                      "open_price": 0.3199,
                      "close_price": 0.3199,
                      "high_price": 0.3199,
                      "low_price": 0.3199,
                      "volume": 1000,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 4.85,
                      "currentPrice": 0.3199,
                      "timestamp": 1570631700000
                    },
                    {
                      "begins_at": "2019-10-09T14:45:00Z",
                      "open_price": 0.304,
                      "close_price": 0.304,
                      "high_price": 0.304,
                      "low_price": 0.304,
                      "volume": 148,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -4.97,
                      "currentPrice": 0.304,
                      "timestamp": 1570632600000
                    },
                    {
                      "begins_at": "2019-10-09T15:05:00Z",
                      "open_price": 0.319,
                      "close_price": 0.319,
                      "high_price": 0.319,
                      "low_price": 0.319,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 4.93,
                      "currentPrice": 0.319,
                      "timestamp": 1570633800000
                    },
                    {
                      "begins_at": "2019-10-09T15:25:00Z",
                      "open_price": 0.319,
                      "close_price": 0.319,
                      "high_price": 0.319,
                      "low_price": 0.319,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.319,
                      "timestamp": 1570635000000
                    },
                    {
                      "begins_at": "2019-10-09T15:50:00Z",
                      "open_price": 0.319,
                      "close_price": 0.32,
                      "high_price": 0.32,
                      "low_price": 0.319,
                      "volume": 400,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.31,
                      "currentPrice": 0.32,
                      "timestamp": 1570636500000
                    },
                    {
                      "begins_at": "2019-10-09T16:20:00Z",
                      "open_price": 0.329,
                      "close_price": 0.31,
                      "high_price": 0.329,
                      "low_price": 0.31,
                      "volume": 11500,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -3.13,
                      "currentPrice": 0.31,
                      "timestamp": 1570638300000
                    },
                    {
                      "begins_at": "2019-10-09T16:25:00Z",
                      "open_price": 0.329,
                      "close_price": 0.329,
                      "high_price": 0.329,
                      "low_price": 0.329,
                      "volume": 800,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 6.13,
                      "currentPrice": 0.329,
                      "timestamp": 1570638600000
                    },
                    {
                      "begins_at": "2019-10-09T16:30:00Z",
                      "open_price": 0.34,
                      "close_price": 0.34,
                      "high_price": 0.34,
                      "low_price": 0.34,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 3.34,
                      "currentPrice": 0.34,
                      "timestamp": 1570638900000
                    },
                    {
                      "begins_at": "2019-10-09T17:05:00Z",
                      "open_price": 0.32,
                      "close_price": 0.32,
                      "high_price": 0.32,
                      "low_price": 0.32,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -5.88,
                      "currentPrice": 0.32,
                      "timestamp": 1570641000000
                    },
                    {
                      "begins_at": "2019-10-09T17:20:00Z",
                      "open_price": 0.32,
                      "close_price": 0.32,
                      "high_price": 0.3201,
                      "low_price": 0.32,
                      "volume": 15400,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.32,
                      "timestamp": 1570641900000
                    },
                    {
                      "begins_at": "2019-10-09T17:40:00Z",
                      "open_price": 0.32,
                      "close_price": 0.32,
                      "high_price": 0.32,
                      "low_price": 0.32,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.32,
                      "timestamp": 1570643100000
                    },
                    {
                      "begins_at": "2019-10-09T18:00:00Z",
                      "open_price": 0.32,
                      "close_price": 0.32,
                      "high_price": 0.32,
                      "low_price": 0.32,
                      "volume": 300,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.32,
                      "timestamp": 1570644300000
                    },
                    {
                      "begins_at": "2019-10-09T18:05:00Z",
                      "open_price": 0.32,
                      "close_price": 0.32,
                      "high_price": 0.32,
                      "low_price": 0.32,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.32,
                      "timestamp": 1570644600000
                    },
                    {
                      "begins_at": "2019-10-10T13:30:00Z",
                      "open_price": 0.34,
                      "close_price": 0.34,
                      "high_price": 0.34,
                      "low_price": 0.34,
                      "volume": 130,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 6.25,
                      "currentPrice": 0.34,
                      "timestamp": 1570714500000
                    },
                    {
                      "begins_at": "2019-10-10T13:40:00Z",
                      "open_price": 0.3302,
                      "close_price": 0.3302,
                      "high_price": 0.3302,
                      "low_price": 0.3302,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -2.88,
                      "currentPrice": 0.3302,
                      "timestamp": 1570715100000
                    },
                    {
                      "begins_at": "2019-10-10T13:50:00Z",
                      "open_price": 0.3303,
                      "close_price": 0.3303,
                      "high_price": 0.3303,
                      "low_price": 0.3303,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.03,
                      "currentPrice": 0.3303,
                      "timestamp": 1570715700000
                    },
                    {
                      "begins_at": "2019-10-10T14:10:00Z",
                      "open_price": 0.35,
                      "close_price": 0.3401,
                      "high_price": 0.35,
                      "low_price": 0.3401,
                      "volume": 1100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 2.97,
                      "currentPrice": 0.3401,
                      "timestamp": 1570716900000
                    },
                    {
                      "begins_at": "2019-10-10T14:15:00Z",
                      "open_price": 0.3595,
                      "close_price": 0.3595,
                      "high_price": 0.3595,
                      "low_price": 0.3595,
                      "volume": 400,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 5.7,
                      "currentPrice": 0.3595,
                      "timestamp": 1570717200000
                    },
                    {
                      "begins_at": "2019-10-10T14:20:00Z",
                      "open_price": 0.3595,
                      "close_price": 0.3595,
                      "high_price": 0.3595,
                      "low_price": 0.3595,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.3595,
                      "timestamp": 1570717500000
                    },
                    {
                      "begins_at": "2019-10-10T14:25:00Z",
                      "open_price": 0.3404,
                      "close_price": 0.3403,
                      "high_price": 0.3404,
                      "low_price": 0.3403,
                      "volume": 350,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -5.34,
                      "currentPrice": 0.3403,
                      "timestamp": 1570717800000
                    },
                    {
                      "begins_at": "2019-10-10T14:40:00Z",
                      "open_price": 0.3421,
                      "close_price": 0.3421,
                      "high_price": 0.3421,
                      "low_price": 0.3421,
                      "volume": 122,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.53,
                      "currentPrice": 0.3421,
                      "timestamp": 1570718700000
                    },
                    {
                      "begins_at": "2019-10-10T15:10:00Z",
                      "open_price": 0.3403,
                      "close_price": 0.3403,
                      "high_price": 0.3403,
                      "low_price": 0.3403,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -0.53,
                      "currentPrice": 0.3403,
                      "timestamp": 1570720500000
                    },
                    {
                      "begins_at": "2019-10-10T15:45:00Z",
                      "open_price": 0.3592,
                      "close_price": 0.3592,
                      "high_price": 0.3592,
                      "low_price": 0.3592,
                      "volume": 100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 5.55,
                      "currentPrice": 0.3592,
                      "timestamp": 1570722600000
                    },
                    {
                      "begins_at": "2019-10-10T17:05:00Z",
                      "open_price": 0.3403,
                      "close_price": 0.3403,
                      "high_price": 0.3403,
                      "low_price": 0.3403,
                      "volume": 3157,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -5.26,
                      "currentPrice": 0.3403,
                      "timestamp": 1570727400000
                    },
                    {
                      "begins_at": "2019-10-10T18:15:00Z",
                      "open_price": 0.3578,
                      "close_price": 0.3578,
                      "high_price": 0.3578,
                      "low_price": 0.3578,
                      "volume": 200,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 5.14,
                      "currentPrice": 0.3578,
                      "timestamp": 1570731600000
                    },
                    {
                      "begins_at": "2019-10-10T19:30:00Z",
                      "open_price": 0.3422,
                      "close_price": 0.3422,
                      "high_price": 0.3422,
                      "low_price": 0.3422,
                      "volume": 5000,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -4.36,
                      "currentPrice": 0.3422,
                      "timestamp": 1570736100000
                    },
                    {
                      "begins_at": "2019-10-10T19:55:00Z",
                      "open_price": 0.35,
                      "close_price": 0.32,
                      "high_price": 0.35,
                      "low_price": 0.32,
                      "volume": 36050,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -6.49,
                      "currentPrice": 0.32,
                      "timestamp": 1570737600000
                    },
                    {
                      "begins_at": "2019-10-11T13:30:00Z",
                      "open_price": 0.3269,
                      "close_price": 0.3269,
                      "high_price": 0.3269,
                      "low_price": 0.3269,
                      "volume": 1720,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 2.16,
                      "currentPrice": 0.3269,
                      "timestamp": 1570800900000
                    },
                    {
                      "begins_at": "2019-10-11T14:05:00Z",
                      "open_price": 0.327,
                      "close_price": 0.327,
                      "high_price": 0.327,
                      "low_price": 0.327,
                      "volume": 830,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.03,
                      "currentPrice": 0.327,
                      "timestamp": 1570803000000
                    },
                    {
                      "begins_at": "2019-10-11T14:20:00Z",
                      "open_price": 0.3272,
                      "close_price": 0.3288,
                      "high_price": 0.3288,
                      "low_price": 0.3272,
                      "volume": 1600,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.55,
                      "currentPrice": 0.3288,
                      "timestamp": 1570803900000
                    },
                    {
                      "begins_at": "2019-10-11T14:25:00Z",
                      "open_price": 0.3298,
                      "close_price": 0.329,
                      "high_price": 0.3298,
                      "low_price": 0.329,
                      "volume": 3700,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.06,
                      "currentPrice": 0.329,
                      "timestamp": 1570804200000
                    },
                    {
                      "begins_at": "2019-10-11T14:30:00Z",
                      "open_price": 0.3251,
                      "close_price": 0.3251,
                      "high_price": 0.3251,
                      "low_price": 0.3251,
                      "volume": 500,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -1.19,
                      "currentPrice": 0.3251,
                      "timestamp": 1570804500000
                    },
                    {
                      "begins_at": "2019-10-11T14:35:00Z",
                      "open_price": 0.33,
                      "close_price": 0.35,
                      "high_price": 0.37,
                      "low_price": 0.33,
                      "volume": 20100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 7.66,
                      "currentPrice": 0.35,
                      "timestamp": 1570804800000
                    },
                    {
                      "begins_at": "2019-10-11T14:40:00Z",
                      "open_price": 0.3503,
                      "close_price": 0.355,
                      "high_price": 0.355,
                      "low_price": 0.3503,
                      "volume": 3800,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 1.43,
                      "currentPrice": 0.355,
                      "timestamp": 1570805100000
                    },
                    {
                      "begins_at": "2019-10-11T15:00:00Z",
                      "open_price": 0.352,
                      "close_price": 0.352,
                      "high_price": 0.352,
                      "low_price": 0.352,
                      "volume": 3019,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -0.85,
                      "currentPrice": 0.352,
                      "timestamp": 1570806300000
                    },
                    {
                      "begins_at": "2019-10-11T15:10:00Z",
                      "open_price": 0.35,
                      "close_price": 0.35,
                      "high_price": 0.35,
                      "low_price": 0.35,
                      "volume": 2495,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -0.57,
                      "currentPrice": 0.35,
                      "timestamp": 1570806900000
                    },
                    {
                      "begins_at": "2019-10-11T15:20:00Z",
                      "open_price": 0.35,
                      "close_price": 0.34,
                      "high_price": 0.35,
                      "low_price": 0.34,
                      "volume": 600,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -2.86,
                      "currentPrice": 0.34,
                      "timestamp": 1570807500000
                    },
                    {
                      "begins_at": "2019-10-11T15:25:00Z",
                      "open_price": 0.34,
                      "close_price": 0.34,
                      "high_price": 0.34,
                      "low_price": 0.34,
                      "volume": 1100,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.34,
                      "timestamp": 1570807800000
                    },
                    {
                      "begins_at": "2019-10-11T15:40:00Z",
                      "open_price": 0.3401,
                      "close_price": 0.3201,
                      "high_price": 0.3401,
                      "low_price": 0.3201,
                      "volume": 3600,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -5.85,
                      "currentPrice": 0.3201,
                      "timestamp": 1570808700000
                    },
                    {
                      "begins_at": "2019-10-11T15:45:00Z",
                      "open_price": 0.3206,
                      "close_price": 0.321,
                      "high_price": 0.33,
                      "low_price": 0.3199,
                      "volume": 7700,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0.28,
                      "currentPrice": 0.321,
                      "timestamp": 1570809000000
                    },
                    {
                      "begins_at": "2019-10-11T15:50:00Z",
                      "open_price": 0.3211,
                      "close_price": 0.32,
                      "high_price": 0.3211,
                      "low_price": 0.32,
                      "volume": 8000,
                      "session": "reg",
                      "interpolated": false,
                      "trend": -0.31,
                      "currentPrice": 0.32,
                      "timestamp": 1570809300000
                    },
                    {
                      "begins_at": "2019-10-11T15:55:00Z",
                      "open_price": 0.322,
                      "close_price": 0.32,
                      "high_price": 0.322,
                      "low_price": 0.32,
                      "volume": 12600,
                      "session": "reg",
                      "interpolated": false,
                      "trend": 0,
                      "currentPrice": 0.32,
                      "timestamp": 1570809600000
                    },
                    {
                      "timestamp": 1570809900963,
                      "lastTradePrice": 0.32,
                      "afterHoursPrice": 0,
                      "askPrice": 0.345,
                      "currentPrice": 0.32,
                      "prevClose": 0.34
                    },
                    {
                      "timestamp": 1570810200978,
                      "lastTradePrice": 0.2962,
                      "afterHoursPrice": 0,
                      "askPrice": 0.345,
                      "currentPrice": 0.2962,
                      "prevClose": 0.34
                    }
                  ],
                  "period": 5
                }
              };
              handlePick(fakePick)
        }, 3000);
        
        const handlePick = data => {
            const { settings, pms } = this.state;
            this.setState({
                picks: [data].concat(this.state.picks),
            });
            if (!isForPurchase(data.stratMin, settings, pms)) {
                return;
            }
            this.setState({
                showingPick: {
                  ...data,
                  newPick: true
                }
            })
            // setTimeout(() => {
            //     this.setState({
            //         newPicksData: null
            //     });
            // }, 10000);
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
        socket.on('server:data-update', data => {
            console.log(data, 'data-update')
            this.setState(data);
        });
        socket.on('server:related-prices', data => {
            // console.log({ relatedPrices: data });
            this.setState({ relatedPrices: data });
        });
        socket.on('server:pm-perfs', data => {
            // console.log({ pmPerfs: data });
            this.setState({ pmPerfs: data });
        });
        socket.emit('getDayReports', data => {
            // console.log({ data});
            this.setState(data);
        });
        socket.on('server:balance-report', data => {
            // this.setState({ balance: data });
            // console.log(data, 'balcn');
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
            // console.log({ rabbit })
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
        let { value, predictionModels, pms, balanceReports, newPicksData, positions, relatedPrices, showingPick, socket } = this.state;
        const isLoading = !balanceReports || !balanceReports.length;
        const PageComponent = pages[value].component;

        if (positions) {
          positions = mapObject(
            positions,
            positions => positions
              .map(pos => {
                  const { afterHoursPrice, lastTradePrice } = relatedPrices[pos.ticker] || {};
                  const currentPrice = afterHoursPrice || lastTradePrice;
                  if (currentPrice) {
                      // console.log(pos);
                      pos.currentPrice = currentPrice;
                      pos.returnDollars = +(pos.quantity * (pos.currentPrice - pos.average_buy_price)).toFixed(2);
                      pos.returnPerc = getTrend(currentPrice, pos.average_buy_price);
                      pos.equity = (pos.quantity * currentPrice).toFixed(2);
                  }
                  // console.log(pos);
                  return pos;
              })
              .sort((a, b) => b.equity - a.equity)
          )
        }
        

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
                ) : <PageComponent 
                      {...this.state} 
                      {...{ handlePageChange: this.handlePageChange }}
                      positions={positions}
                      showPick={pick => this.setState({ showingPick: pick })}
                      />
                }

                <Popup position="right center" modal open={newPicksData}>
                    <h2>ALERT ALERT NEW <b>PICK</b></h2>
                    <pre>{JSON.stringify(newPicksData, null, 2)}</pre>
                </Popup>

                <ReactModal isOpen={!!showingPick}>
                    <button 
                        onClick={() => this.setState({ showingPick: null })}
                        style={{
                            position: 'fixed',
                            zoom: '250%',
                            top: '1vh',
                            left: '1vh',
                        }}>
                            Close Modal
                    </button>
                    <br/><br/>
                    {showingPick && showingPick.newPick && <h3>NEW PICK!! NEW PICK!! NEW PICK!!</h3>}
                    <PickGraphs pick={showingPick} socket={socket} positions={positions} />
                </ReactModal>

                {/* <TabContainer> */}
                    
                {/* </TabContainer> */}
                
            </div>
        );
    }
    
}

export default App;
