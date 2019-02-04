import React, { Component } from 'react';

const TrendPerc = ({ value, redAt = 0 }) => typeof value === 'undefined' ? '---' : (
    <span className={ value > redAt ? 'positive' : 'negative'}>
        {value > 0 && '+'}{value.toFixed(2)}%
    </span>
);

export default TrendPerc;