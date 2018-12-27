import React, { Component } from 'react';

const TrendPerc = ({ value, redAt = 0 }) => (
    <span className={ value > redAt ? 'positive' : 'negative'}>
        {value.toFixed(2)}%
    </span>
);

export default TrendPerc;