import React, { Component } from 'react';

const TrendPerc = ({ value, redAt = 0, noPlus, round, dollar, ...rest }) => typeof value === 'undefined' ? '---' : (
    <span className={ value > redAt ? 'positive' : 'negative'} {...rest}>
        {!noPlus && value > 0 && '+'}{!noPlus && value < 0 && '-'}{dollar && '$'}{round ? Math.round(value) : Math.abs(value).toFixed(2)} {!dollar && '%'}
    </span>
);

export default TrendPerc;