import React, { useState, useEffect } from 'react';
import './visit.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { auth, db } from './Firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({ iconUrl, shadowUrl });
L.Marker.prototype.options.icon = DefaultIcon;

const places = [
    {
        name: 'Alexander the Great Monument',
        location: 'Skopje',
        image: '/images/alexander.jpg',
        coords: { lat: 41.9959, lng: 21.4314 },
    },
    {
        name: 'St. Naum Church',
        location: 'Ohrid',
        image: '/images/sv_naum.jpg',
        coords: { lat: 40.9134, lng: 20.7403 },
    },
    {
        name: 'Matka Canyon',
        location: 'Skopje',
        image: '/images/matka.jpg',
        coords: { lat: 41.9479, lng: 21.2981 },
    },
    {
        name: 'Tetovo Waterfalls',
        location: 'Tetovo',
        image: '/images/tetovo_waterfalls.jpg',
        coords: { lat: 42.0097, lng: 20.9716 },
    },
    {
        name: 'Smolare Waterfalls',
        location: 'Strumica',
        image: '/images/smolare_waterfalls.jpg',
        coords: { lat: 41.3656, lng: 22.9136 },
    },
];

const Places = () => {
    const [pinned, setPinned] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const user = auth.currentUser;

    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('pinnedPlaces') || '[]');
        setPinned(localData);

        if (user) {
            const ref = doc(db, 'users', user.uid);
            getDoc(ref).then(snap => {
                if (!snap.exists()) {
                    setDoc(ref, { pinnedPlaces: [] });
                } else {
                    const cloudData = snap.data().pinnedPlaces || [];
                    setPinned(cloudData);
                    localStorage.setItem('pinnedPlaces', JSON.stringify(cloudData));
                }
            });
        }
    }, [user]);

    const updatePins = async (newPins) => {
        setPinned(newPins);
        localStorage.setItem('pinnedPlaces', JSON.stringify(newPins));
        if (user) {
            const ref = doc(db, 'users', user.uid);
            await updateDoc(ref, { pinnedPlaces: newPins });
        }
    };

    const togglePin = (place) => {
        const exists = pinned.some(p => p.name === place.name);
        const newPins = exists
            ? pinned.filter(p => p.name !== place.name)
            : [...pinned, place];
        updatePins(newPins);
    };

    const isPinned = (place) => pinned.some(p => p.name === place.name);

    return (
        <div className="travel-planner">
            <h1>Macedonian Travel Planner</h1>
            <div className="places-grid">
                {places.map((place, index) => (
                    <div className="place-card" key={index}>
                        <img src={place.image} alt={place.name} />
                        <div className="place-info">
                            <h2>{place.name}</h2>
                            <p>{place.location}</p>
                            <div className="actions">
                                <button onClick={() => togglePin(place)}>
                                    {isPinned(place) ? 'Unpin' : 'Pin'}
                                </button>
                                <button className="map-button" onClick={() => setSelectedPlace(place)}>🗺</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPlace && (
                <div className="map-modal" onClick={() => setSelectedPlace(null)}>
                    <div className="map-container" onClick={(e) => e.stopPropagation()}>
                        <h3>{selectedPlace.name}</h3>
                        <MapContainer
                            center={[selectedPlace.coords.lat, selectedPlace.coords.lng]}
                            zoom={13}
                            style={{ height: '300px', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            />
                            <Marker position={[selectedPlace.coords.lat, selectedPlace.coords.lng]}>
                                <Popup>{selectedPlace.name}</Popup>
                            </Marker>
                        </MapContainer>
                        <button className="modal-pin" onClick={() => {
                            togglePin(selectedPlace);
                            setSelectedPlace(null);
                        }}>
                            {isPinned(selectedPlace) ? 'Unpin Location' : 'Pin Location'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Places;
