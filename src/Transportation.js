import React, { useState, useEffect } from 'react';
import "./Music.css";
import { auth, db } from './Firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

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

export default function Transportation() {
    const [isLiked, setIsLiked] = useState(false);
    const user = auth.currentUser;

    const handleLike = async () => {
        if (!user) return;

        try {
            const newLikedState = !isLiked;
            setIsLiked(newLikedState);
            await toggleLike('Transportation');
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert state on error
            setIsLiked(isLiked);
        }
    };

    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);

        // Initialize user document if it doesn't exist
        getDoc(userRef).then(snap => {
            if (!snap.exists()) {
                setDoc(userRef, { pinnedPlaces: [], likes: {} });
            }
        });

        // Set up real-time listener for user data
        const unsub = onSnapshot(userRef, (snap) => {
            const data = snap.data();
            // Update the liked state from Firebase data
            setIsLiked(data?.likes?.Transportation || false);
        });

        return () => unsub();
    }, [user]);

    return (
        <div className="transportation-section">
            <div className="pozadina"></div>

            {}
            <div className="header">
                <h2 className="nasss">Getting Around Macedonia</h2>
                <button
                    className={`like ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    {isLiked ? '❤️ Liked' : '🤍 Like'}
                </button>
            </div>

            <div className="transport-info">
                <h3>🚌 JSP Public Transport</h3>
                <p>
                    JSP (Јавно Сообраќајно Претпријатие) is Skopje's main public bus service,
                    operating an extensive network of routes throughout the city. The buses run
                    from early morning until midnight, making it an affordable way to explore Skopje.
                </p>
                <p>
                    <strong>How to use:</strong> Purchase a refillable green card (Skopje Card)
                    at kiosks or pay the driver directly. Single rides cost around 35 MKD,
                    while the card offers discounted fares.
                </p>
                <a
                    href="http://www.jsp.com.mk/PlanskiVozenRed.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transport-link"
                >
                    JSP Web App - Check Routes & Schedules →
                </a>
                <div className="app-downloads">
                    <a
                        href="https://play.google.com/store/apps/details?id=mk.com.jsp.jspskopje"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transport-link"
                    >
                        📱 Download for Android
                    </a>
                    <a
                        href="https://apps.apple.com/mk/app/jsp-skopje/id1581790590"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transport-link"
                    >
                        📱 Download for iOS
                    </a>
                </div>
            </div>

            <div className="transport-info">
                <h3>🚕 Taxi Services</h3>
                <p>
                    Taxis in Macedonia are affordable and reliable. All licensed taxis use meters,
                    with typical fares starting at 50-60 MKD plus 40 MKD per kilometer. A 5km ride would cost you something above 200den. Always ensure
                    the meter is running to avoid overcharging.
                </p>
                <p><strong>Recommended taxi apps with English support:</strong></p>
                <ul>
                    <li>
                        <strong>Wizi:</strong> Most popular app with quick response times
                        <div className="app-downloads">
                            <a
                                href="https://play.google.com/store/apps/details?id=mk.wizi.passenger"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Android App
                            </a>
                            <p> </p>
                            <a
                                href="https://apps.apple.com/us/app/wizi/id1450317409"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                iOS App
                            </a>
                        </div>
                    </li>
                    <li>
                        <strong>Beeride:</strong> Newer service with competitive prices
                        <div className="app-downloads">
                            <a
                                href="https://play.google.com/store/apps/details?id=com.beeride.passenger"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Android App
                            </a>
                            <p> </p>
                            <a
                                href="https://apps.apple.com/us/app/beeride/id1545427494"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                iOS App
                            </a>
                        </div>
                    </li>
                </ul>
                <p><strong>Direct phone booking (24/7):</strong></p>
                <ul>
                    <li>+389 70 255 255 (Global Taxi) - English speaking dispatchers</li>
                    <li>15161 (Riva Taxi) - Reliable citywide service</li>
                    <li>15160 (Panorama Taxi) - Good for airport transfers</li>
                    <li>15157 (Naxi Taxi) - Popular local choice</li>
                    <li>Heres a link witha list of all the taxi companies in Macedonia: <a href="https://zk.mk/taksi-kompanii/skopje">Zlatna Kniga</a></li>
                </ul>
            </div>

            <div className="transport-info">
                <h3>🛴 BinBin Electric Scooters</h3>
                <p>
                    BinBin e-scooters offer a modern, eco-friendly way to navigate Skopje's city center.
                    With hundreds of scooters strategically placed around popular areas, they're perfect
                    for short trips and sightseeing.
                </p>
                <p><strong>How it works:</strong></p>
                <ul>
                    <li>Download the BinBin app and create an account</li>
                    <li>Add payment method (credit/debit card)</li>
                    <li>Scan QR code on any available scooter to unlock</li>
                    <li>Park responsibly </li>
                </ul>
                <p>
                    <strong>Pricing:</strong><br />
                    • 9 MKD per minute (about €0.12/min)<br />
                    • Daily passes available for frequent users<br />
                    • First ride often comes with a discount!
                </p>
                <p>
                    <strong>Safety tips:</strong> Stay in bike lanes when available, wear a helmet,
                    and avoid riding on busy sidewalks. Maximum speed is 25 km/h.
                </p>
                <div className="app-downloads">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.binbin.customer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transport-link"
                    >
                        📱 BinBin for Android
                    </a>
                    <a
                        href="https://apps.apple.com/us/app/binbin-scooters/id1474379989"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transport-link"
                    >
                        📱 BinBin for iOS
                    </a>
                </div>
            </div>

            <div className="transport-info">
                <h3>🚗 Additional Transportation Options</h3>
                <p>
                    <strong>Car Rentals:</strong> Available at Skopje Airport and city center.
                    International licenses accepted. Expect to pay €20-40 per day.
                </p>
                <p>
                    <strong>Intercity Buses:</strong> Comfortable coaches connect major cities.
                    Book tickets at the main bus station or online at
                    <a href="https://www.balkanviator.com" target="_blank" rel="noopener noreferrer"> BalkanViator</a>.
                </p>
                <p>
                    <strong>Trains:</strong> Limited but scenic routes available. The Skopje-Bitola
                    line offers beautiful countryside views. Check schedules at
                    <a href="http://www.mzt.mk" target="_blank" rel="noopener noreferrer"> Macedonian Railways</a>.
                </p>
            </div>
        </div>
    );
}