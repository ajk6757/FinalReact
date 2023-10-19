import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import FeedContent from './FeedContent';
import 'bootstrap/dist/css/bootstrap.min.css';
import bootstrap from 'bootstrap';
import { BrowserRouter , Link , Route , Routes } from "react-router-dom";
import { AuthProvider } from './LoginContext';
import { Provider } from 'react-redux';
import store from './store/store';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <App/>
          </BrowserRouter>
      </AuthProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
