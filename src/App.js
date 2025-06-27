import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'animate.css';

import Places from './Places';
import Map from './Map';
import Home from './Home';
import TraditionalFood from './traditionalFood';
import NightLife from './NightLife';
import Coffee from './cofee';
import TravelPlanner from './AIPlanner';
import SurvivalGuide from './SurvivalGuide';
import Music from "./Music";
import Chat from './Chat';
import Login from './Login';
import { auth } from './Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Transportation from './Transportation';

function App() {
    const [user, loading] = useAuthState(auth); 

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/Login" element={<Login /> }/>
                <Route path="/" element={<Home />} />
                <Route path="/traditional-food" element={<TraditionalFood />} />
                <Route path="/NightLife" element={<NightLife />} />
                <Route path="/Places" element={<Places />} />
                <Route path="/cofee" element={<Coffee />} />
                <Route path="/Transportation" element={<Transportation />} />
                <Route path="/AIPlanner" element={<TravelPlanner />} />
                <Route path="/SurvivalGuide" element={<SurvivalGuide />} />
                <Route path="/Music" element={<Music />} />
                <Route
                    path="/Chat"
                    element={user ? <Chat /> : <Login onLogin={() => window.location.reload()} />}
                />
                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;
