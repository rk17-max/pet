import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const TokenDisplay = () => {
    const [tokenValue, setTokenValue] = useState('');

    useEffect(() => {
        // Get the "token" cookie when the component mounts
        const value = Cookies.get('token');
        setTokenValue(value || 'Token not found');
        
        // Log the token value to the console
        console.log('Token is this:', value || 'Token not found');
    }, []);

    return (
        <div>
            <h3>Token Value</h3>
            <p><strong>Token:</strong> {tokenValue}</p>
        </div>
    );
};

export default TokenDisplay;
