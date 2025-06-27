import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { auth, db } from './Firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import './NightLife.css';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({ iconUrl, shadowUrl });


const coffeeIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#8B4513">
            <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.38 0 2.5-1.12 2.5-2.5S19.88 5 18.5 5V3zM16 5v3c0 2.76-2.24 5-5 5s-5-2.24-5-5V5h10z"/>
        </svg>
    `),
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const venues = [
    
    {
        name: 'Garson',
        description: 'Trendy cocktail bar with a cozy vibe and DJ nights.',
        location: 'Skopje City Center',
        coords: { lat: 41.9973, lng: 21.4314 },
        mapLink: 'https://www.google.com/maps?q=Garson+Skopje',
        instagram: 'https://instagram.com/garsonbar',
        image: 'garson.jpg',
        category: 'Cocktail Bar',
        type: 'nightlife'
    },
    {
        name: 'Kotur',
        description: 'Stylish bar with a chic interior and great music.',
        location: 'Debar Maalo, Skopje',
        coords: { lat: 41.9945, lng: 21.4189 },
        mapLink: 'https://www.google.com/maps?q=Kotur+Skopje',
        instagram: 'https://instagram.com/koturkafeifilm',
        image: 'kotur.png',
        category: 'Bar',
        type: 'nightlife'
    },
    {
        name: 'Kino Karposh',
        description: 'Bar in a retro cinema with events, drinks, and DJs.',
        location: 'Karposh, Skopje',
        coords: { lat: 41.9850, lng: 21.3980 },
        mapLink: 'https://www.google.com/maps?q=Kino+Karposh+Skopje',
        instagram: 'https://instagram.com/kinokarposh.mk',
        image: 'kino-karposh.jpg',
        category: 'Cinema Bar',
        type: 'nightlife'
    },
    {
        name: 'Crash Bar',
        description: 'Underground rock bar with a raw vibe.',
        location: 'Centar, Skopje',
        coords: { lat: 41.9960, lng: 21.4280 },
        mapLink: 'https://www.google.com/maps?q=Crash+Bar+Skopje',
        instagram: 'https://instagram.com/crashbar.mk',
        image: 'crashh.png',
        category: 'Rock Bar',
        type: 'nightlife'
    },
    {
        name: 'Pogon',
        description: 'Hipster-style hangout with occasional gigs and DJ nights.',
        location: 'Centar, Skopje',
        coords: { lat: 41.9950, lng: 21.4310 },
        mapLink: 'https://www.google.com/maps?q=Pogon+Skopje',
        instagram: 'https://instagram.com/pogon.bar',
        image: 'pogon.jpg',
        category: 'Bar',
        type: 'nightlife'
    },
    {
        name: 'Samo',
        description: 'Minimalistic café-bar popular among creatives.',
        location: 'Debar Maalo, Skopje',
        coords: { lat: 41.9930, lng: 21.4200 },
        mapLink: 'https://www.google.com/maps?q=Samo+Skopje',
        instagram: 'https://instagram.com/bgcsamo',
        image: 'samo.jpg',
        category: 'Café Bar',
        type: 'nightlife'
    },
    {
        name: 'Badu',
        description: 'Outdoor chill zone with a great vibe and live acts.',
        location: 'Skopje City Park',
        coords: { lat: 41.9894, lng: 21.4191 },
        mapLink: 'https://www.google.com/maps?q=Badu+Skopje',
        instagram: 'https://instagram.com/_badu_bar',
        image: 'badu.png',
        category: 'Outdoor Bar',
        type: 'nightlife'
    },
    {
        name: 'Radio Bar',
        description: 'Known for jazz nights and creative cocktails.',
        location: 'Debar Maalo, Skopje',
        coords: { lat: 41.9935, lng: 21.4195 },
        mapLink: 'https://www.google.com/maps?q=Radio+Bar+Skopje',
        instagram: 'https://instagram.com/radiobarskopje',
        image: 'radioo.png',
        category: 'Jazz Bar',
        type: 'nightlife'
    },
    {
        name: 'BKW Bar',
        description: 'Rustic yet modern bar with live music and outdoor seating.',
        location: 'Bitola Old Town',
        coords: { lat: 41.0322, lng: 21.3344 },
        mapLink: 'https://www.google.com/maps?q=BKW+Bar+Bitola',
        instagram: 'https://instagram.com/bkw_hybrid_bar',
        image: 'bkw.jpg',
        category: 'Bar',
        type: 'nightlife'
    },

   
    {
        name: 'The Dude Specialty Coffee',
        description: 'Premium specialty coffee roastery and cafe with exceptional single-origin beans.',
        location: 'Centar, Skopje',
        coords: { lat: 41.9973, lng: 21.4280 },
        mapLink: 'https://www.google.com/maps?q=The+Dude+Specialty+Coffee+Skopje',
        instagram: 'https://instagram.com/thedude.specialtycoffee',
        image: 'the-dude.jpg',
        category: 'Specialty Coffee',
        specialty: 'Single-origin beans, pour-over methods',
        type: 'cafe'
    },
    {
        name: 'Sinatra Coffee',
        description: 'Elegant coffee bar with premium espresso and sophisticated atmosphere.',
        location: 'Debar Maalo, Skopje',
        coords: { lat: 41.9945, lng: 21.4189 },
        mapLink: 'https://www.google.com/maps?q=Sinatra+Coffee+Skopje',
        instagram: 'https://instagram.com/sinatraspecialtycoffee',
        image: '/places/sinatra.jpg',
        category: 'Espresso Bar',
        specialty: 'Premium espresso, Italian-style coffee',
        type: 'cafe'
    },
    {
        name: 'Edge Coffee',
        description: 'Modern coffee shop with innovative brewing techniques and specialty drinks.',
        location: 'Centar, Skopje',
        coords: { lat: 41.9950, lng: 21.4310 },
        mapLink: 'https://www.google.com/maps?q=Edge+Coffee+Skopje',
        instagram: 'https://instagram.com/edge.specialtycoffee.mk',
        image: 'edge.jpg',
        category: 'Modern Coffee',
        specialty: 'Innovative brewing, specialty drinks',
        type: 'cafe'
    },
    {
        name: 'Greenhill Coffee',
        description: 'Sustainable coffee roastery focusing on quality and environmental responsibility.',
        location: 'Vodno, Skopje',
        coords: { lat: 41.989116, lng: 21.405695 },
        mapLink: 'https://www.google.com/maps?q=Greenhill+Coffee+Skopje',
        instagram: 'https://instagram.com/greenhillskopje',
        image: 'grinhil.png',
        category: 'Sustainable Coffee',
        specialty: 'Eco-friendly roasting, quality beans',
        type: 'cafe'
    },
    {
        name: 'Rutina',
        description: 'Trendy cafe in Leptokarija with great coffee and relaxed atmosphere.',
        location: 'Karpos, Skopje',
        coords: { lat: 41.995, lng: 21.4195 },
        mapLink: 'https://maps.app.goo.gl/bzRABffTcd6aGQNb6',
        instagram: 'https://instagram.com/rutinacoffeehouse',
        image: 'rutina.png',
        category: 'Trendy Cafe',
        specialty: 'Great atmosphere, quality coffee',
        type: 'cafe'
    }
];

function NightLifeAndCafes() {
    const [visibleCards, setVisibleCards] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [pinned, setPinned] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    const user = auth.currentUser;

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisibleCards(venues.map((_, index) => index));
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);

        getDoc(userRef).then(snap => {
            if (!snap.exists()) {
                setDoc(userRef, { pinnedPlaces: [], likes: {} });
            }
        });

        const unsub = onSnapshot(userRef, (snap) => {
            const data = snap.data() || {};
            setPinned(data?.pinnedPlaces || []);
            setIsLiked(data?.likes?.['Nightlife & Cafes'] || false);
        });

        return () => unsub();
    }, [user]);

    const togglePin = async (place) => {
        if (!user) return;
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        const data = snap.data() || {};
        const currentPins = data.pinnedPlaces || [];

        const alreadyPinned = currentPins.some(p => p.name === place.name);
        const newPins = alreadyPinned
            ? currentPins.filter(p => p.name !== place.name)
            : [...currentPins, { name: place.name, coords: place.coords, type: place.type }];

        await updateDoc(userRef, { pinnedPlaces: newPins });
    };

    const handleLike = async () => {
        if (!user) return;
        const userRef = doc(db, 'users', user.uid);
        const newLikeStatus = !isLiked;
        setIsLiked(newLikeStatus);
        await updateDoc(userRef, {
            [`likes.Bars & Cafes`]: newLikeStatus
        });
    };

    const isPinned = (place) => pinned.some(p => p.name === place.name);

    const filteredVenues = venues.filter(venue => {
        const typeMatch = selectedType === 'all' || venue.type === selectedType;
        const categoryMatch = selectedCategory === 'all' ||
            venue.category.toLowerCase().includes(selectedCategory.toLowerCase());
        return typeMatch && categoryMatch;
    });

    const uniqueCategories = [...new Set(venues.map(venue => venue.category))];
    const currentTypeVenues = selectedType === 'all' ? venues : venues.filter(v => v.type === selectedType);
    const currentUniqueCategories = [...new Set(currentTypeVenues.map(venue => venue.category))];

    return (
        <div className="nightlife-page">
            <div className="background-blur"></div>

            <div className="controls-container">
                <select
                    className="category-select"
                    value={selectedType}
                    onChange={(e) => {
                        setSelectedType(e.target.value);
                        setSelectedCategory('all'); 
                    }}
                >
                    <option value="all">All Venues</option>
                    <option value="nightlife">🍸 Nightlife</option>
                    <option value="cafe">☕ Cafes</option>
                </select>

                <select
                    className="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {currentUniqueCategories.map(category => (
                        <option key={category} value={category.toLowerCase()}>
                            {category}
                        </option>
                    ))}
                </select>

                <button
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                    style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        backgroundColor: isLiked ? '#ff6b6b' : 'white',
                        color: isLiked ? 'white' : '#333',
                        border: '2px solid #ff6b6b',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isLiked ? '❤️ Liked' : '🤍 Like'}
                </button>
            </div>

            <div className="nightlife-wrapper">
                <div className="nightlife-hero">
                    <h1 className="nightlife-title">
                        {selectedType === 'nightlife' ? 'Nightlife in Macedonia' :
                            selectedType === 'cafe' ? 'Specialty Cafes in Macedonia' :
                                'Bars & Cafes in Macedonia'}
                    </h1>
                    <p className="nightlife-sub">
                        {selectedType === 'nightlife' ? 'Discover vibrant bars and clubs where locals and tourists mingle.' :
                            selectedType === 'cafe' ? 'Discover artisanal coffee shops and specialty roasters.' :
                                'Discover vibrant nightlife venues and specialty coffee shops across Macedonia.'}
                    </p>
                </div>

                <div className="nightlife-list">
                    {filteredVenues.map((venue, index) => (
                        <div
                            className={`nightlife-card ${visibleCards.includes(index) ? 'visible' : ''}`}
                            key={index}
                            style={{
                                transitionDelay: `${index * 0.1}s`
                            }}
                        >
                            <img
                                src={`./${venue.image}`}
                                alt={venue.name}
                                className="nightlife-img"
                                onError={(e) => {
                                    if (venue.type === 'cafe') {
                                        e.target.src = `https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
                                    } else {
                                        e.target.src = `https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
                                    }
                                }}
                            />
                            <div className="nightlife-info">
                                <h3>{venue.name}</h3>
                                <p className="description">{venue.description}</p>
                                <p className="location">
                                    <strong>📍 Location:</strong> {venue.location}
                                </p>
                                {venue.specialty && (
                                    <p className="specialty" style={{
                                        color: '#8B4513',
                                        fontStyle: 'italic',
                                        marginBottom: '1rem'
                                    }}>
                                        <strong>⭐ Specialty:</strong> {venue.specialty}
                                    </p>
                                )}
                                <div className="links-container">
                                    <button
                                        className={`action-link pin-link ${isPinned(venue) ? 'pinned' : ''}`}
                                        onClick={() => togglePin(venue)}
                                        style={{
                                            backgroundColor: isPinned(venue) ?
                                                (venue.type === 'cafe' ? '#8B4513' : '#ff6b6b') : '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            textDecoration: 'none',
                                            display: 'inline-block',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {isPinned(venue) ? '📌 Pinned' : '📍 Pin'}
                                    </button>

                                    <button
                                        className="action-link map-link"
                                        onClick={() => setSelectedPlace(venue)}
                                        style={{
                                            backgroundColor: '#28a745',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            textDecoration: 'none',
                                            display: 'inline-block',
                                            fontSize: '0.9rem',
                                            marginLeft: '0.5rem'
                                        }}
                                    >
                                        🗺️ View on Map
                                    </button>

                                    <a
                                        href={venue.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="action-link instagram-link"
                                    >
                                        📸 Instagram
                                    </a>
                                </div>
                                <span className="category-tag" style={{
                                    backgroundColor: venue.type === 'cafe' ? '#8B4513' : '#ff6b6b'
                                }}>
                                    {venue.type === 'cafe' ? '☕' : '🍸'} {venue.category}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedPlace && (
                <div
                    className="map-modal"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setSelectedPlace(null)}
                >
                    <div
                        className="map-container"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '2rem',
                            maxWidth: '600px',
                            width: '90%',
                            maxHeight: '500px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <h3 style={{ margin: 0 }}>
                                {selectedPlace.type === 'cafe' ? '☕' : '🍸'} {selectedPlace.name}
                            </h3>
                            <button
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setSelectedPlace(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ height: '300px', marginBottom: '1rem' }}>
                            <MapContainer
                                center={[selectedPlace.coords.lat, selectedPlace.coords.lng]}
                                zoom={15}
                                style={{ height: '100%', width: '100%', borderRadius: '10px' }}
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap contributors'
                                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                />
                                <Marker
                                    position={[selectedPlace.coords.lat, selectedPlace.coords.lng]}
                                    icon={selectedPlace.type === 'cafe' ? coffeeIcon : L.icon({ iconUrl, shadowUrl })}
                                >
                                    <Popup>
                                        <strong>{selectedPlace.name}</strong><br />
                                        {selectedPlace.description}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: isPinned(selectedPlace) ?
                                        (selectedPlace.type === 'cafe' ? '#8B4513' : '#ff6b6b') : '#007bff',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                                onClick={() => {
                                    togglePin(selectedPlace);
                                    setSelectedPlace(null);
                                }}
                            >
                                {isPinned(selectedPlace) ? '📌 Unpin Location' : '📍 Pin Location'}
                            </button>

                            <a
                                href={selectedPlace.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '10px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    textDecoration: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                🗺️ Open in Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NightLifeAndCafes;