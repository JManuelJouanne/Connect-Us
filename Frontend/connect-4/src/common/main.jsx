import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routing from './routing';
import AuthProvider from './../profile/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <div className="size" id="mono1">
      <div className="player">
        <div className="legs"></div>
        <div className="back"></div>
        <div className="glass"></div>
      </div>
    </div>
    <div className="size" id="mono2">
      <div className="player">
        <div className="legs"></div>
        <div className="back"></div>
        <div className="glass"></div>
      </div>
    </div>
    <div className="size" id="mono3">
      <div className="player">
        <div className="legs"></div>
        <div className="back"></div>
        <div className="glass"></div>
      </div>
    </div>
    <AuthProvider>
      <Routing />
    </AuthProvider>
  </>,
);