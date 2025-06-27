import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from './Firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './chat.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Default marker
const defaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Coffee/Cafe marker (brown)
const cafeIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
            <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 10.9 12.5 28.5 12.5 28.5S25 23.4 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#8B4513"/>
            <circle cx="12.5" cy="12.5" r="8" fill="white"/>
            <path d="M8 9h9v1h-9zm0 2h9v1h-9zm0 2h9v1h-9z" fill="#8B4513"/>
            <circle cx="12.5" cy="12.5" r="2" fill="#8B4513"/>
        </svg>
    `),
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Nightlife marker (red/pink)
const nightlifeIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
            <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 10.9 12.5 28.5 12.5 28.5S25 23.4 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#ff6b6b"/>
            <circle cx="12.5" cy="12.5" r="8" fill="white"/>
            <path d="M9 8h2v3h3v2h-3v3h-2v-3H6v-2h3V8z" fill="#ff6b6b"/>
        </svg>
    `),
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Places marker (blue - for tourist places)
const placesIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
            <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 10.9 12.5 28.5 12.5 28.5S25 23.4 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#007bff"/>
            <circle cx="12.5" cy="12.5" r="8" fill="white"/>
            <path d="M12.5 6L15 11h-5l2.5-5zm0 12L10 13h5l-2.5 5z" fill="#007bff"/>
        </svg>
    `),
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function Card({ onClose }) {
    const user = auth.currentUser;
    const [pinnedPlaces, setPinnedPlaces] = useState([]);
    const [savedPlan, setSavedPlan] = useState('');
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [likes, setLikes] = useState({});
    const [plan, setPlan] = useState('');
    const ref = useRef();

    useEffect(() => {
        const docRef = doc(db, 'users', user.uid);

        getDoc(docRef).then(snap => {
            if (!snap.exists()) {
                setDoc(docRef, { pinnedPlaces: [], likes: {}, plan: "" });
            }
        });

        return onSnapshot(docRef, (snap) => {
            const data = snap.data() || {};
            setPinnedPlaces(data.pinnedPlaces || []);
            setSavedPlan(data.travelPlan || '');
            setLikes(data.likes || {});
            setPlan(data.plan || '');
        });
    }, [user.uid]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleDeletePlan = async () => {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, { plan: '' });
    };

    const getIconForPlace = (place) => {
        if (place.type === 'cafe') return cafeIcon;
        if (place.type === 'nightlife') return nightlifeIcon;
        if (place.type === 'places') return placesIcon;
        return defaultIcon;
    };

    const getIconEmoji = (type) => {
        switch (type) {
            case 'cafe': return '☕';
            case 'nightlife': return '🍸';
            case 'places': return '🗺️';
            default: return '📍';
        }
    };


    const groupedPlaces = pinnedPlaces.reduce((acc, place) => {
        const type = place.type || 'general';
        if (!acc[type]) acc[type] = [];
        acc[type].push(place);
        return acc;
    }, {});

    return (
        <>
            <div className="dropdown-card" ref={ref}>
                <div className="user-section">
                    <img src={user.photoURL || '/default.png'} alt="Profile" />
                    <div>
                        <strong>{user.displayName}</strong>
                        <span>{user.email}</span>
                        <div className="logout-section">
                            <button className="logout-btn" onClick={() => signOut(auth)}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                <div className="map-section">
                    <h4>Your Pinned Places ({pinnedPlaces.length})</h4>

                    {}
                    {pinnedPlaces.length > 0 && (
                        <div style={{
                            marginBottom: '10px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '5px',
                            fontSize: '0.8rem'
                        }}>
                            {Object.entries(groupedPlaces).map(([type, places]) => (
                                <span key={type} style={{
                                    backgroundColor: type === 'cafe' ? '#8B4513' :
                                        type === 'nightlife' ? '#ff6b6b' :
                                            type === 'places' ? '#007bff' : '#6c757d',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem'
                                }}>
                                    {getIconEmoji(type)} {places.length}
                                </span>
                            ))}
                        </div>
                    )}

                    {pinnedPlaces.length > 0 ? (
                        <MapContainer
                            center={[41.6086, 21.7453]}
                            zoom={7}
                            scrollWheelZoom={false}
                            style={{ height: '150px', borderRadius: '10px' }}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            />
                            {pinnedPlaces.map((place, index) => (
                                <Marker
                                    key={index}
                                    position={[place.coords.lat, place.coords.lng]}
                                    icon={getIconForPlace(place)}
                                >
                                    <Popup>
                                        <div>
                                            <strong>{getIconEmoji(place.type)} {place.name}</strong>
                                            {place.type && (
                                                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                    Type: {place.type}
                                                </div>
                                            )}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                            No pinned locations yet. Start exploring!
                        </p>
                    )}
                </div>

                

                <div className="likes-section">
                    <h4>Your Likes</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                        {Object.entries(likes).map(([section, liked]) =>
                            liked && (
                                <span key={section} className="like-badge" style={{
                                    backgroundColor: '#e3f2fd',
                                    color: '#1976d2',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    border: '1px solid #bbdefb'
                                }}>
                                    ❤️ {section}
                                </span>
                            )
                        )}
                        {Object.values(likes).every(v => !v) && (
                            <span style={{ color: '#666', fontSize: '0.9rem' }}>
                                No likes yet
                            </span>
                        )}
                    </div>
                </div>

                {savedPlan && (
                    <div className="plan-section">
                        <h4>Saved Plan</h4>
                        <button onClick={() => setShowPlanModal(true)} className="plan-icon-button">
                            📄 View Pinned Plan
                        </button>
                    </div>
                )}

                {}
               
            </div>

            {showPlanModal && (
                <div className="plan-modal-overlay" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                    <div className="plan-modal-content" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowPlanModal(false)}>Close</button>
                        <h2>Your Travel Plan</h2>
                        <pre onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>{savedPlan}</pre>
                    </div>
                </div>
            )}
        </>
    );
}