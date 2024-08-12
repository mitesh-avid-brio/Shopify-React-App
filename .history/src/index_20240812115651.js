import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for all routes

app.get('/api/products', async (req, res) => {
    try {
        const response = await axios.get('https://pakt-shirts.myshopify.com/admin/api/2024-07/products.json', {
            headers: {
                'X-Shopify-Access-Token': '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',
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
});

app.listen(4000, () => {
    console.log('Proxy server running on http://localhost:4000');
});



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
