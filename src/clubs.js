import React from 'react';
import './NightLife.css'; 
import './App.css'
import sun from './logo1.png';         
import suitcase from './logo2.png';

export default function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loader-wrapper">
                <img src={suitcase} alt="suitcase" className="loader-case" />
                <img src={sun} alt="sun" className="loader-sun" />
            </div>
        </div>
    );
}
