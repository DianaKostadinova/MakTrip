import React, { useState, useEffect } from 'react';
import './TraditionalFood.css';
import { auth, db } from './Firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

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

const foods = [
    {
        name: 'Pastrmajlija',
        description: 'Flatbread topped with salted, dried pork or lamb, baked until crispy.',
        location: 'Štip, Veles, Prilep bakeries',
        price: '150-250 MKD',
        image: 'pastramajlija.jpg',
        cuisine: 'Traditional'
    },
    {
        name: 'Tavče Gravče',
        description: 'Baked beans in a traditional clay pot with paprika and spices.',
        location: 'Traditinal restaurants',
        price: '120-180 MKD',
        image: 'gravce.jpg',
        cuisine: 'Traditional'
    },
    {
        name: 'Ajvar',
        description: 'Roasted red pepper spread, made in autumn and served with bread or meat.',
        location: 'Markets and traditional homes',
        price: '150 MKD/jar',
        image: 'ajvar.jpg',
        cuisine: 'Spread'
    },
    {
        name: 'Simit Pogača',
        description: 'Round sesame bread, crunchy outside, soft inside – a Balkan favorite.',
        location: 'Local bakeries across Skopje',
        price: '30-60 MKD',
        image: 'simit.jpg',
        cuisine: 'Bakery'
    },
    {
        name: 'Šarska Pleskavica',
        description: 'Grilled meat patty stuffed with cheese – a spicy, juicy delight.',
        location: 'Kafana and traditional restaurants',
        price: '200-300 MKD',
        image: 'sarska.jpg',
        cuisine: 'Grilled'
    },
    {
        name: 'Sarma',
        description: 'Cabbage rolls filled with minced meat and rice, slow-cooked in sauce.',
        location: 'Family homes, traditional restaurants',
        price: '150-220 MKD',
        image: 'sarma.jpg',
        cuisine: 'Traditional'
    },
    {
        name: 'Burek',
        description: 'Flaky pastry filled with meat, cheese, or spinach – a perfect breakfast.',
        location: 'Every bakery in Macedonia',
        price: '60-120 MKD',
        image: 'burek.jpg',
        cuisine: 'Bakery'
    },
    { name: 'Mekica',
        description: 'Fried dough pastry, similar to a doughnut, thats is typically round and fluffy with a slightly sweet taste.s',
    location: 'Most bakeries in Macedonia',
    price: '20-40 MKD',
    image: 'mekica.jpg',
    cuisine: 'Bakery'
    }
];

function TraditionalFood() {
    const [isLiked, setIsLiked] = useState(false);
    const [visibleCards, setVisibleCards] = useState([]);
    const [selectedCuisine, setSelectedCuisine] = useState('all');

    useEffect(() => {
        
        const timer = setTimeout(() => {
            setVisibleCards(foods.map((_, index) => index));
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    const handleLike = async () => {
        setIsLiked(!isLiked);
        await toggleLike('traditionalFood');
    };

    const filteredFoods = selectedCuisine === 'all'
        ? foods
        : foods.filter(food => food.cuisine.toLowerCase() === selectedCuisine);

    const uniqueCuisines = [...new Set(foods.map(food => food.cuisine))];

    return (
        <div className="food-page">
            <div className="background-blur"></div>

            <div className="floating-particles">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 6}s`,
                            animationDuration: `${Math.random() * 3 + 4}s`
                        }}
                    />
                ))}
            </div>

            <div className="controls-container">
                <select
                    className="dropdown-select"
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {uniqueCuisines.map(cuisine => (
                        <option key={cuisine} value={cuisine.toLowerCase()}>
                            {cuisine}
                        </option>
                    ))}
                </select>
            </div>

            <div className="food-wrapper">
                <div className="food-hero">
                    <div className="food-header">
                        <h1 className="food-title">Traditional Macedonian Food</h1>
                        <button
                            className={`like-button ${isLiked ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            {isLiked ? '❤️ Liked' : '🤍 Like'}
                        </button>
                    </div>
                    <p className="food-sub">
                        Taste the essence of local culture with iconic dishes and tips on where to try them.
                    </p>
                </div>

                <div className="food-list">
                    {filteredFoods.map((food, index) => (
                        <div
                            className={`food-card ${visibleCards.includes(index) ? 'visible' : ''}`}
                            key={index}
                            style={{
                                transitionDelay: `${index * 0.1}s`
                            }}
                        >
                            <img
                                src={`./${food.image}`}
                                alt={food.name}
                                className="food-img"
                                onError={(e) => {
                                    e.target.src = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
                                }}
                            />
                            <div className="food-info">
                                <h3>{food.name}</h3>
                                <p>{food.description}</p>
                                <p className="location"><strong>Where to find:</strong> {food.location}</p>
                                <p className="price">{food.price}</p>
                                <span className="cuisine-tag">{food.cuisine}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TraditionalFood;