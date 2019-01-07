import React from 'react';

export default ({ cronString }) => (
    <div style={{ padding: '20px' }}>
        <h1>Cron</h1>
        <pre>{cronString}</pre>
    </div>
);