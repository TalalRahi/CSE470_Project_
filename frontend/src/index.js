// This is the entry point of our React app
// It renders the App component into the HTML page

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Find the div with id="root" in public/index.html
// and render our App inside it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);