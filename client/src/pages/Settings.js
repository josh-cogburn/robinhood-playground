import React from 'react';

export default ({ settingsString }) => (
    <div style={{ padding: '20px' }}>
        <h1>Settings</h1>
        <pre>{settingsString}</pre>
    </div>
);