import React from 'react';

export default ({ settingsString }) => (
    <div style={{ padding: '20px' }}>
        <h2>Settings</h2>
        <pre>{settingsString}</pre>
    </div>
);