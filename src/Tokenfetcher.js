import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const TokenFetcher = () => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchedToken = Cookies.get('token'); // Access the token from cookies
        if (fetchedToken) {
            setToken(fetchedToken);
        } else {
            console.log('No token found');
        }
    }, []);

    return (
        <div>
            <h1>JWT Token from Cookies:</h1>
            <p>{token ? token : 'No token found'}</p>
        </div>
    );
};

export default TokenFetcher;
