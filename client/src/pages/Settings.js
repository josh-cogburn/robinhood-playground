import React from 'react';

export default ({ settings }) => (
    <div style={{ padding: '20px' }}>
        <h2>Settings</h2>
        <pre>{JSON.stringify(settings, null, 2)}</pre>
    </div>
);