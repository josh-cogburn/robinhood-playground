import React, { Component } from 'react';

const TrendPerc = ({ value, redAt = 0, noPlus, round }) => typeof value === 'undefined' ? '---' : (
    <span className={ value > redAt ? 'positive' : 'negative'}>
        {!noPlus && value > 0 && '+'}{round ? Math.round(value) : value.toFixed(2)}%
    </span>
);

export default TrendPerc;