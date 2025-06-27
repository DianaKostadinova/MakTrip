import React, { useState, useEffect } from 'react';
import './App.css';
import { auth } from './Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Card from './card';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import './default.png'
import Fuse from 'fuse.js';
function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user] = useAuthState(auth);
    const [showProfile, setShowProfile] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const pages = [
        { name: "Travel Planner", route: "/AIPlanner", keywords: ["plan", "trip", "generate", "itinerary", "planner", "travel"] },
        { name: "Monuments & Places", route: "/Places", keywords: ["monument", "landmark", "places", "explore", "location"] },
        { name: "Traditional Food", route: "/traditional-food", keywords: ["food", "cuisine", "dish", "meal", "eat", "kitchen"] },
        { name: "Public Transport", route: "/Transportation", keywords: ["bus", "train", "transport", "ride", "commute"] },
        { name: "Nightlife", route: "/NightLife", keywords: ["bars", "clubs", "night", "drink", "party", "music"] },
        { name: "Survival Guide", route: "/SurvivalGuide", keywords: ["help", "currency", "language", "customs", "guide", "laws"] },

        { name: "Tourist Finder", route: "/Chat", keywords: ["chat", "find", "tourist", "connect", "talk"] },
    ];
    const sections = [
        { name: 'Monuments & Places', route: '/Places', image: 'visit.jpg', desc: 'Explore famous landmarks and historical sites.' },
        { name: 'Traditional Food', route: '/traditional-food', image: 'food.jpg', desc: 'Discover local cuisine and dishes.' },
        { name: 'Public Transport', route: '/Transportation', image: 'bus.jpg', desc: 'Buses, trains, and ways to move around.' },
        { name: 'Nightlife', route: '/NightLife', image: 'nighlife.webp', desc: 'Find bars, clubs, and night fun.' },
        { name: 'Survival Guide', route: '/SurvivalGuide', image: 'survival.jpg', desc: 'Currency, customs, laws, and language.' },
        { name: 'Travel Planner', route: '/AIPlanner', image: 'planner.jpg', desc: 'Auto-generate your perfect trip.' },
       
        { name: 'Tourist Finder', route: '/Chat', image: 'find.jpeg', desc: 'Meet and chat with other tourists.' },
    ];

    const scroll = (dir) => {
        const container = document.getElementById('cardScroll');
        const scrollAmount = container.offsetWidth * 0.6;
        container.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    };



    const fuse = new Fuse(pages, {
        includeScore: true,
        keys: ['name', "keywords"],
        threshold: 0.4
    });
  
    useEffect(() => {
        const topbar = document.querySelector('.topbar');
        const onScroll = () => {
            if (window.scrollY > 50) {
                topbar.classList.add('scrolled');
            } else {
                topbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);

        if (value.trim() === '') {
            setSuggestions([]);
            return;
        }

        const results = fuse.search(value);
        setSuggestions(results.map(r => r.item));
    };

    const handleSuggestionClick = (route) => {
        navigate(route);
        setSearchInput('');
        setSuggestions([]);
    };

    L.Marker.prototype.options.icon = L.icon({ iconUrl, shadowUrl });
    const [showMapModal, setShowMapModal] = useState(false);
    const navigate = useNavigate();
    const pinnedPlaces = JSON.parse(localStorage.getItem('pinnedPlaces') || '[]');


    return (
       

        <>
            <header className="topbar">
                <div className="logo-mask-wrapper">
                    <svg viewBox="0 0 500 100" className="logo-mask">
                        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
                            MakTrip
                        </text>
                    </svg>
                </div>

                <div className="top-actions">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                        {suggestions.length > 0 && (
                            <ul className="suggestions-dropdown">
                                {suggestions.map((s, index) => (
                                    <li key={index} onClick={() => handleSuggestionClick(s.route)}>
                                        {s.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>



                    {user ? (
                        <div className="user-info">
                            <img
                                src={user.photoURL || '/default.png'}
                                alt="User"
                                className="profile-icon"
                                onClick={() => setShowProfile(prev => !prev)}
                            />
                            {showProfile && <Card onClose={() => setShowProfile(false)} />}
                        </div>
                    ) : (
                        <button className="login-btn" onClick={() => navigate('/Login')}>Login</button>
                    )}

                   
                </div>
            </header>

            <div className="main-wrapper">
                <div className="hero">
                    <div className="hero-content">
                        <h1 id="nasalov"><b>Discover Macedonia</b></h1>

                        <p className="subtitle">
                            Discover Macedonia like never before — your smart travel companion packed with hidden gems,<br></br> local tips, and everything you need for an unforgettable journey.
                        </p>
                        <button className="get-started-btn" onClick={() => document.getElementById('cardScroll')?.scrollIntoView({ behavior: 'smooth' })}>
                            Get Started
                            </button>
                       

                    </div>
                </div>

<div className="intro-section">
                        <h1><b>Here’s everything you’ll need to know about Macedonia </b></h1>
                        <p>Plan like a local. From food to monuments, transport to music — we’ve got you covered.</p>


                    </div>
                <div className="content-section">
                    
                    <div className="scroll-wrapper">
                        <button className="scroll-btn left" onClick={() => scroll(-1)}>‹</button>

                        <div className="card-container" id="cardScroll">
                            {sections.map((section, index) => (
                                <Link to={section.route} key={index} className="scroll-card">
                                    <img src={section.image} alt={section.name} />
                                    <div className="card-text">
                                        <h3>{section.name}</h3>
                                        <p>{section.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <button className="scroll-btn right" onClick={() => scroll(1)}>›</button>
                    </div>

                </div>
            </div>
            {showMapModal && (
                <div className="map-modal" onClick={() => setShowMapModal(false)}>
                    <div className="map-container" onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ textAlign: 'center' }}>Your Pinned Locations</h3>
                        {pinnedPlaces.length > 0 ? (
                            <MapContainer
                                center={[41.6086, 21.7453]}
                                zoom={7}
                                scrollWheelZoom={false}
                                style={{ height: '300px', width: '100%', borderRadius: '12px' }}
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap contributors'
                                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                />
                                {pinnedPlaces.map((place, idx) => (
                                    <Marker
                                        key={idx}
                                        position={[place.coords.lat, place.coords.lng]}
                                    >
                                        <Popup>{place.name}</Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        ) : (
                            <p style={{ textAlign: 'center' }}>No pinned locations yet.</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;
