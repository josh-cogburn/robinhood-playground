import React from 'react';

export default ({ cronString }) => (
    <div style={{ padding: '20px' }}>
        <h2>Cron</h2>
        <pre>{cronString}</pre>
    </div>
);