import React, { useState, useEffect } from 'react';
import './visit.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { auth, db } from './Firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { fetchWikipediaSummary } from './Wiki';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({ iconUrl, shadowUrl });
async function toggleLike(section) {
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    const snap = await getDoc(docRef);
    const data = snap.data();
    const current = data?.likes?.[section] || false;
    await updateDoc(docRef, {
        [`likes.${section}`]: !current
    });
}

const places = [
   
    {
        name: 'Alexander the Great Monument',
        wikiTitle: 'Alexander the Great',
        location: 'Skopje',
        category: 'Monument',
        image: "/places/aleksandar.jpg",
        coords: { lat: 41.9959, lng: 21.4314 },
        description: 'Iconic 22-meter bronze statue in Macedonia Square.',
        howToGet: 'Located in the heart of Skopje city center. Walk from anywhere downtown or take any bus to the main square.'
    },
    {
        name: 'Matka Canyon',
        wikiTitle: 'Matka Canyon',
        location: 'Skopje',
        category: 'Nature',
        image: '/places/matka.jpg',
        coords: { lat: 41.9479, lng: 21.2981 },
        description: 'Stunning canyon with caves, medieval monasteries, and boat tours.',
        howToGet: 'Take bus #60 from Skopje city center (45 min) or taxi (20 min, ~500 MKD). Last bus returns at 8 PM.'
    },
    {
        name: 'Mount Vodno & Millennium Cross',
        wikiTitle: 'Millennium Cross',
        location: 'Skopje',
        category: 'Nature/Monument',
        image: '/vodno.jpg',
        coords: { lat: 41.9653, lng: 21.3981 },
        description: '66-meter illuminated cross atop Mount Vodno with panoramic city views.',
        howToGet: 'Take cable car from Middle Vodno (500 MKD return) or hike 2-3 hours from city. Bus #25 to Sredno Vodno, then cable car.'
    },
    {
        name: 'Skopje Fortress (Kale)',
        wikiTitle: 'Skopje Fortress',
        location: 'Skopje',
        category: 'Historical',
        image: '/places/kale.jpg',
        coords: { lat: 42.0008, lng: 21.4333 },
        description: '6th-century fortress overlooking the city with free entry.',
        howToGet: '15-minute walk from Macedonia Square or Old Bazaar. Free entry, open sunrise to sunset.'
    },
    {
        name: 'Old Bazaar (Stara Čaršija)',
        wikiTitle: 'Old Bazaar, Skopje',
        location: 'Skopje',
        category: 'Cultural',
        image: '/places/charsija.jpg',
        coords: { lat: 42.0000, lng: 21.4367 },
        description: 'Largest bazaar in the Balkans outside Istanbul with Ottoman architecture.',
        howToGet: '5-minute walk north from Macedonia Square across the Stone Bridge.'
    },
    {
        name: 'City Park (Gradski Park)',
        wikiTitle: 'City Park, Skopje',
        location: 'Skopje',
        category: 'Park',
        image: '/places/park.jpg',
        coords: { lat: 41.9894, lng: 21.4191 },
        description: 'Large urban park with sports facilities, playground, and cafes.',
        howToGet: 'South of city center, 10-min walk from Macedonia Square or take buses #2, #22, #24.'
    },
    {
        name: 'Kozjak Lake',
        wikiTitle: 'Kozjak Lake',
        location: 'Skopje Region',
        category: 'Nature',
        image: '/places/kozjak.jpg',
        coords: { lat: 42.1547, lng: 21.3289 },
        description: 'Hidden emerald lake perfect for swimming and picnics.',
        howToGet: 'CHALLENGING ACCESS: Drive 45 min towards Volkovo village, then 20-min steep hike. No public transport. GPS essential. Best April-October.'
    },
    {
        name: 'Markov Monastery',
        wikiTitle: 'Marko\'s Monastery',
        location: 'Skopje',
        category: 'Religious',
        image: '/places/markov.jpg',
        coords: { lat: 41.9186, lng: 21.5183 },
        description: '14th-century monastery with stunning frescoes.',
        howToGet: 'In Markova Sušica village, 20 min drive from Skopje. Need car or taxi (~600 MKD one way).'
    },

    
    {
        name: 'St. Naum Church',
        wikiTitle: 'Saint Naum',
        location: 'Ohrid',
        category: 'Religious',
        image: '/places/svnaum.jpg',
        coords: { lat: 40.9134, lng: 20.7403 },
        description: '10th-century monastery with peacocks and springs.',
        howToGet: '30km south of Ohrid. Take boat tour (1500 MKD) or bus from Ohrid (150 MKD, hourly in summer). Taxi ~1000 MKD.'
    },
    {
        name: 'Church of St. John at Kaneo',
        wikiTitle: 'Church of St. John at Kaneo',
        location: 'Ohrid',
        category: 'Religious',
        image: '/places/kaneo.webp',
        coords: { lat: 41.1097, lng: 20.7881 },
        description: 'Most photographed church in Macedonia on cliff over lake.',
        howToGet: '20-min scenic walk along Ohrid boardwalk or 5-min taxi from center.'
    },
    {
        name: 'Samuel\'s Fortress',
        wikiTitle: 'Samuel\'s Fortress, Ohrid',
        location: 'Ohrid',
        category: 'Historical',
        image: '/places/samoil.webp',
        coords: { lat: 41.1131, lng: 20.7950 },
        description: '10th-century fortress with panoramic lake views.',
        howToGet: 'Steep 15-min climb from Ohrid old town. Entry 60 MKD. Open 9 AM - 7 PM.'
    },
    {
        name: 'Bay of Bones Museum',
        wikiTitle: 'Bay of Bones',
        location: 'Ohrid',
        category: 'Museum',
        image: '/places/bones.jpg',
        coords: { lat: 41.0367, lng: 20.7919 },
        description: 'Reconstructed prehistoric pile-dwelling settlement on water.',
        howToGet: '15 min drive south of Ohrid on main road. Bus to Peštani village, then 10-min walk.'
    },
    {
        name: 'Galičica National Park',
        wikiTitle: 'Galičica',
        location: 'Ohrid-Prespa',
        category: 'Nature',
        image: '/places/galicica.jpg',
        coords: { lat: 40.9478, lng: 20.8339 },
        description: 'Mountain park between Ohrid and Prespa lakes with hiking trails.',
        howToGet: 'Need car to access properly. Main entrance 20 min from Ohrid. Hiking tours available.'
    },

    {
        name: 'Heraclea Lyncestis',
        wikiTitle: 'Heraclea Lyncestis',
        location: 'Bitola',
        category: 'Archaeological',
        image: '/places/heraklea.jpg',
        coords: { lat: 41.0111, lng: 21.3425 },
        description: 'Ancient city founded by Philip II with amazing mosaics.',
        howToGet: '2km south of Bitola center. Walk 30 min or taxi 150 MKD. Entry 120 MKD.'
    },
    {
        name: 'Pelister National Park',
        wikiTitle: 'Pelister National Park',
        location: 'Bitola',
        category: 'Nature',
        image: '/places/pelister.jpg',
        coords: { lat: 40.9833, lng: 21.2000 },
        description: 'Macedonia\'s oldest national park with endemic pine trees.',
        howToGet: '15km from Bitola. Drive to park entrance or take taxi (~500 MKD). Mountain hut accommodation available.'
    },
    {
        name: 'Širok Sokak Street',
        wikiTitle: 'Bitola',
        location: 'Bitola',
        category: 'Cultural',
        image: '/places/sirok.jpg',
        coords: { lat: 41.0322, lng: 21.3344 },
        description: 'Pedestrian street with consulate buildings and cafes.',
        howToGet: 'Main pedestrian street in Bitola center. All city buses stop nearby.'
    },

    {
        name: 'Kokino Observatory',
        wikiTitle: 'Kokino',
        location: 'Kumanovo',
        category: 'Archaeological',
        image: '/places/kokino.jpg',
        coords: { lat: 42.2631, lng: 21.9544 },
        description: '3,800-year-old megalithic observatory, NASA\'s 4th most important.',
        howToGet: 'Near Staro Nagoričane village, 30km from Kumanovo. Need car, rough road last 5km. GPS essential.'
    },
    {
        name: 'Smolare Waterfalls',
        wikiTitle: 'Smolare Falls',
        location: 'Strumica',
        category: 'Nature',
        image: '/places/strumicki.jpg',
        coords: { lat: 41.3656, lng: 22.9136 },
        description: 'Highest waterfall in Macedonia at 39.5 meters.',
        howToGet: 'From Novo Selo, follow signs to Smolare village (15km). Then 30-min marked trail to falls.'
    },
    {
        name: 'Kratovo Stone Bridges',
        wikiTitle: 'Kratovo',
        location: 'Kratovo',
        category: 'Historical',
        image: '/places/kratovo.jpg',
        coords: { lat: 42.0781, lng: 22.1808 },
        description: 'Medieval town in volcanic crater with towers and bridges.',
        howToGet: 'Regular buses from Skopje (2 hours) or Kumanovo (1 hour). Town is walkable.'
    },

    {
        name: 'Tetovo Waterfalls',
        wikiTitle: 'Камењански Водопади',
        location: 'Tetovo',
        category: 'Nature',
        image: '/places/tetovski.jpg',
        coords: { lat: 42.0097, lng: 20.9716 },
        description: 'Series of waterfalls in Šar Mountains.',
        howToGet: 'From Tetovo, drive towards Brezno village (30 min), then follow trail signs. 4WD recommended.'
    },
    {
        name: 'Painted Mosque (Šarena Džamija)',
        wikiTitle: 'Painted Mosque, Tetovo',
        location: 'Tetovo',
        category: 'Religious',
        image: '/places/sarena.jpg',
        coords: { lat: 42.0097, lng: 20.9716 },
        description: 'Unique 15th-century mosque with colorful decorations.',
        howToGet: 'In Tetovo center near the river. Any city bus stops within 5-min walk.'
    },
    {
        name: 'Mavrovo National Park',
        wikiTitle: 'Mavrovo National Park',
        location: 'Mavrovo',
        category: 'Nature',
        image: '/places/mavrovo.jpg',
        coords: { lat: 41.6667, lng: 20.7333 },
        description: 'Largest national park with ski resort and submerged church.',
        howToGet: 'Regular buses from Skopje to Mavrovo (2.5 hours). Ski resort has accommodation.'
    },
    {
        name: 'Church of St. Bigorski',
        wikiTitle: 'Bigorski Monastery',
        location: 'Debar',
        category: 'Religious',
        image: '/places/bigorski.jpg',
        coords: { lat: 41.6119, lng: 20.6106 },
        description: 'Monastery famous for its wood-carved iconostasis.',
        howToGet: 'Between Debar and Gostivar. Need car or organized tour. Beautiful but winding road.'
    },

  
    {
        name: 'Stobi Archaeological Site',
        wikiTitle: 'Stobi',
        location: 'Gradsko',
        category: 'Archaeological',
        image: '/places/stobi.jpg',
        coords: { lat: 41.5517, lng: 21.9742 },
        description: 'Ancient Roman city at crossroads of civilizations.',
        howToGet: 'On highway between Skopje-Gevgelija. Stop at Gradsko, then 10-min taxi. Entry 120 MKD.'
    },
    {
        name: 'Tikveš Wine Region',
        wikiTitle: 'Tikveš',
        location: 'Kavadarci',
        category: 'Wine Tourism',
        image: '/places/tikves.jpg',
        coords: { lat: 41.4333, lng: 22.0167 },
        description: 'Macedonia\'s premier wine region with tours and tastings.',
        howToGet: 'Centered around Kavadarci. Many wineries offer tours. Best to arrange transport/driver.'
    },
    {
        name: 'Treskavec Monastery',
        wikiTitle: 'Treskavec Monastery',
        location: 'Prilep',
        category: 'Religious',
        image: '/places/treskavec.jpg',
        coords: { lat: 41.4211, lng: 21.5578 },
        description: 'Mountain monastery with stunning views, featured in films.',
        howToGet: 'Very difficult access! 4WD required from Prilep (1 hour rough road) or 3-hour hike. Guide recommended.'
    },
    {
        name: 'Markovi Kuli',
        wikiTitle: 'Prince Marko\'s Towers',
        location: 'Prilep',
        category: 'Historical',
        image: '/places/markovi.jpg',
        coords: { lat: 41.3469, lng: 21.5528 },
        description: 'Medieval fortress ruins with rock formations.',
        howToGet: '15-min drive north of Prilep, then 30-min hike. Well-marked trail from parking.'
    }
];

const Places = () => {
    const [pinned, setPinned] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [speakingPlace, setSpeakingPlace] = useState(null);
    const [wikiSummary, setWikiSummary] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [isLiked, setIsLiked] = useState(false);

    const user = auth.currentUser;

  
    const categories = ['All', ...new Set(places.map(p => p.category))];
    const regions = ['All', 'Skopje', 'Ohrid', 'Bitola', 'Tetovo', 'Eastern', 'Southern', 'Western'];

    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);

        getDoc(userRef).then(snap => {
            if (!snap.exists()) {
                setDoc(userRef, { pinnedPlaces: [], likes: {} });
            }
        });
       
        const unsub = onSnapshot(userRef, (snap) => {
            const data = snap.data();
            setPinned(data?.pinnedPlaces || []);
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
            : [...currentPins, { name: place.name, coords: place.coords }];

        await updateDoc(userRef, { pinnedPlaces: newPins });
    };

    const playWikipediaSummary = async (place) => {
        try {
            setSpeakingPlace(place.name);
            setIsSpeaking(true);

            const summary = await fetchWikipediaSummary(place.wikiTitle);
            setWikiSummary(summary);

            const utterance = new SpeechSynthesisUtterance(summary);
            utterance.lang = 'en-US';
            utterance.rate = 1;

            utterance.onend = () => {
                setIsSpeaking(false);
                setSpeakingPlace(null);
            };

            speechSynthesis.cancel();
            speechSynthesis.speak(utterance);
        } catch (err) {
            console.error("Failed to fetch or speak summary:", err);
            setWikiSummary("No summary found.");
            setIsSpeaking(false);
        }
    };

    const isPinned = (place) => pinned.some(p => p.name === place.name);

  
    const filteredPlaces = places.filter(place => {
        const categoryMatch = selectedCategory === 'All' || place.category === selectedCategory;
        const regionMatch = selectedRegion === 'All' ||
            place.location.includes(selectedRegion) ||
            (selectedRegion === 'Eastern' && ['Kumanovo', 'Strumica', 'Kratovo'].some(city => place.location.includes(city))) ||
            (selectedRegion === 'Southern' && ['Prilep', 'Kavadarci', 'Gradsko'].some(city => place.location.includes(city))) ||
            (selectedRegion === 'Western' && ['Debar', 'Mavrovo'].some(city => place.location.includes(city)));

        return categoryMatch && regionMatch;
    }); const handleLike = async () => {
            setIsLiked(!isLiked);
            await toggleLike('Places');
        };

    return (
        <div className="travel-planner">
            <h1>Macedonian Travel Planner</h1>
            <p className="subtitle">Discover the hidden gems and iconic landmarks of North Macedonia</p>

            <div className="filters">
                <div className="filter-group">
                    <label>Category:</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    
                </div>
                <div className="filter-group">
                    <label>Region:</label>
                    <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                        {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select><button
                        className={`like-button ${isLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                    >
                        {isLiked ? '❤️ Liked' : '🤍 Like'}
                    </button>
                </div>
            </div>

            <div className="places-grid">
                {filteredPlaces.map((place, index) => (
                    <div className="place-card" key={index}>
                        <img src={place.image} alt={place.name} />
                        <div className="place-info">
                            <span className="category-badge">{place.category}</span>
                            <h2>{place.name}</h2>
                            <p className="location">{place.location}</p>
                            <p className="description">{place.description}</p>
                            <details className="how-to-get">
                                <summary>How to get there</summary>
                                <p>{place.howToGet}</p>
                            </details>
                            {speakingPlace === place.name && wikiSummary && (
                                <p className="wiki-summary">{wikiSummary}</p>
                            )}
                            <div className="actions">
                                <button onClick={() => togglePin(place)}>
                                    {isPinned(place) ? '📌 Unpin' : '📍 Pin'}
                                </button>
                                <button onClick={() => playWikipediaSummary(place)}>
                                    🎧
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