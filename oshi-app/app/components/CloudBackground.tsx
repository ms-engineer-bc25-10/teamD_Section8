import React from 'react';

const CloudBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{ backgroundColor: '#D1EEFF', minHeight: '100vh', padding: '10px' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                {children}
            </div>
        </div>
    );
}
export default CloudBackground;