import React, { useState, useEffect } from 'react';
import { auth, db } from './Firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import './survival.css';
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

export default function SurvivalGuide() {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('mk');
    const [isLiked, setIsLiked] = useState(false);

    const user = auth.currentUser;

    const handleLike = async () => {
        if (!user) return;

        try {
            const newLikedState = !isLiked;
            setIsLiked(newLikedState);
            await toggleLike('SurvivalGuide');
        } catch (error) {
            console.error('Error toggling like:', error);
            setIsLiked(isLiked);
        }
    };

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
            setIsLiked(data?.likes?.SurvivalGuide || false);
        });

        return () => unsub();
    }, [user]);

    const handleTranslate = async () => {
        if (!inputText.trim()) return;
        setIsTranslating(true);
        setTranslatedText('');

        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${sourceLang}|${targetLang}`);
            const data = await response.json();

            if (data.responseData && data.responseData.translatedText) {
                setTranslatedText(data.responseData.translatedText);
            } else {
                setTranslatedText("⚠️ Translation service unavailable. Please try again.");
            }
        } catch (error) {
            console.error('Translation Error:', error);
            setTranslatedText("⚠️ Network or server error.");
        }

        setIsTranslating(false);
    };

    return (
        <div className="main-wrapper survival-guide-page">
            <div className="hero">
                <h1 id="nasalov">Survival Guide</h1>
                <button
                    className={`like-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    {isLiked ? '❤️ Liked' : '🤍 Like'}
                </button>
            </div>
            <div className="content-section">
                <div className="text" style={{ flexDirection: 'column', maxWidth: '800px', margin: '0 auto' }}>

                    <section className="box-text">
                        <h3>🏛️ Basic Facts</h3>
                        <p><strong>Currency:</strong> Macedonian Denar (MKD) - €1 ≈ 61.5 MKD<br />
                            <strong>Population:</strong> ~1.8 million (Skopje: ~800,000)<br />
                            <strong>Language:</strong> Macedonian (Cyrillic Alphabet)<br />

                            <strong>Emergency numbers:</strong><br />
                            • General emergency: 112<br />
                            • Police: 192<br />
                            • Fire: 193<br />
                            • Medical emergency: 194<br />
                            <strong>Voltage:</strong> 230V, 50Hz (Type C/F European plug)<br />
                            <strong>Driving:</strong> Right-hand side, International license accepted</p>
                    </section>

                    <section className="box-text">
                        <h3>💱 Money Matters</h3>
                        <p><strong>Currency Exchange:</strong></p>
                        <ul>
                            <li>Use official exchange offices ("Menuvachnica") - best rates in city center</li>
                            <li>Banks offer secure but slightly lower rates</li>
                            <li>Avoid airport exchanges (poor rates)</li>
                            <li>NEVER exchange on the street</li>
                        </ul>
                        <p><strong>Payment Methods:</strong></p>
                        <ul>
                            <li>Preferably cash - many places don't accept cards</li>
                            <li>ATMs widely available (max withdrawal usually 20,000 MKD)</li>
                            <li>Visa/Mastercard accepted in hotels, malls, larger restaurants</li>

                            <li>Keep small bills for markets, taxis, tips</li>
                        </ul>
                    </section>

                    <section className="box-text">
                        <h3>💰 Average Prices (2025)</h3>
                        <p><strong>Food & Drinks:</strong></p>
                        <ul>
                            <li>Restaurant meal: 200-500 MKD (€3.5-8)</li>
                            <li>Fast food combo: 150-350 MKD</li>
                            <li>Burek: 80 MKD</li>
                            <li>Local beer(SKopsko, Zlaten Dab) (0.5L): 150 MKD</li>
                            <li>Wine (glass): 120-200 MKD</li>
                            <li>Coffee (espresso): 60-90 MKD</li>
                            <li>Bottled water (0.5L): 30-40 MKD</li>
                        </ul>
                        <p><strong>Transportation:</strong></p>
                        <ul>
                            <li>City bus: 35 MKD (cash to driver)</li>
                            <li>Taxi start: 50 MKD + 40 MKD/km</li>
                            <li>Airport to city center: 1,200-1,500 MKD with taxi, 200 MKD with  <a href="https://skp.airports.com.mk/en-EN/passenger-guide/to-from-the-airport/page/bus">bus</a></li>
                            <li>Intercity bus: 300-800 MKD depending on distance</li>
                        </ul>
                    </section>

                    <section className="box-text">
                        <h3>🗣️ Essential Macedonian Phrases</h3>
                        <ul>
                            <li><strong>Здраво</strong> (Zdravo) – Hello</li>
                            <li><strong>Довидување</strong> (Doviduvanje) – Goodbye</li>
                            <li><strong>Благодарам</strong> (Blagodaram) – Thank you</li>
                            <li><strong>Молам</strong> (Molam) – Please / You're welcome</li>
                            <li><strong>Извинете</strong> (Izvinete) – Excuse me / Sorry</li>
                            <li><strong>Да / Не</strong> (Da / Ne) – Yes / No</li>
                            <li><strong>Колку чини?</strong> (Kolku chini?) – How much is it?</li>
                            <li><strong>Каде е...?</strong> (Kade e...?) – Where is...?</li>
                            <li><strong>Не разбирам</strong> (Ne razbiram) – I don't understand</li>
                            <li><strong>Зборувате ли англиски?</strong> (Zboruvate li angliski?) – Do you speak English?</li>
                            <li><strong>Едно пиво, молам</strong> (Edno pivo, molam) – One beer, please</li>
                            <li><strong>Сметката, молам</strong> (Smetkata, molam) – The bill, please</li>
                        </ul>
                    </section>

                    <section className="box-text">
                        <h3>🔄 Quick Translator</h3>
                        <textarea
                            rows="3"
                            placeholder="Type text to translate..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                border: '1px solid #ccc'
                            }}
                        />

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
                            <select
                                value={sourceLang}
                                onChange={(e) => setSourceLang(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px' }}
                            >
                                <option value="en">English</option>
                                <option value="mk">Macedonian</option>
                            </select>
                            <span>→</span>
                            <select
                                value={targetLang}
                                onChange={(e) => setTargetLang(e.target.value)}
                                style={{ padding: '0.5rem', borderRadius: '4px' }}
                            >
                                <option value="mk">Macedonian</option>
                                <option value="en">English</option>
                            </select>
                            <button
                                onClick={handleTranslate}
                                disabled={isTranslating}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: isTranslating ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {isTranslating ? 'Translating...' : 'Translate'}
                            </button>
                        </div>

                        {translatedText && (
                            <div style={{
                                padding: '1rem',
                                background: '#f0f0f0',
                                borderRadius: '8px',
                                marginTop: '1rem',
                                border: '1px solid #ddd'
                            }}>
                                <strong>Translation:</strong> {translatedText}
                            </div>
                        )}
                    </section>

                    <section className="box-text">
                        <h3>📱 Connectivity</h3>
                        <ul>
                            <li><strong>SIM Cards:</strong> Available at airport, kiosks, mobile shops</li>
                            <li><strong>Main providers:</strong> A1, Telekom, Lycamobile</li>
                            <li><strong>Tourist SIM:</strong> ~500 MKD for 7 days with data</li>
                            <li><strong>WiFi:</strong> Free in most cafes, restaurants, hotels</li>
                            <li><strong>EU Roaming:</strong> Works but can be expensive</li>
                        </ul>
                    </section>

                    <section className="box-text">
                        <h3>🏥 Health & Safety</h3>
                        <ul>
                            <li><strong>Tap water:</strong> Safe in cities, bottled recommended for sensitive stomachs</li>
                            <li><strong>Pharmacies:</strong> Look for "Аптека" (Apteka), many open 24/7</li>
                            <li><strong>Hospitals:</strong> Public healthcare basic but functional</li>
                            <li><strong>Travel insurance:</strong> Highly recommended</li>
                            <li><strong>Safety:</strong> Generally very safe, normal precautions apply</li>
                            <li><strong>Pickpockets:</strong> Rare but be aware in crowded markets</li>
                        </ul>
                    </section>

                    <section className="box-text">
                        <h3>🛍️ Shopping & Bargaining</h3>
                        <ul>
                            <li><strong>Shops:</strong> Mon-Fri 9:00-20:00, Sat 9:00-15:00, Sun mostly closed</li>
                            <li><strong>Supermarkets:</strong> Open daily until 22:00</li>
                            <li><strong>Markets:</strong> Early morning best for fresh produce</li>
                            <li><strong>Bargaining:</strong> Expected at bazaars, not in shops</li>
                            <li><strong>VAT refund:</strong> Available for purchases over €50</li>
                        </ul>
                    </section>

                    <section className="box-text">
                        <h3>🍽️ Dining Etiquette</h3>
                        <ul>
                            <li><strong>Tipping:</strong> 10% standard, round up for taxis</li>
                            <li><strong>Service:</strong> Relaxed pace, don't rush</li>
                            <li><strong>Smoking:</strong> Still allowed in many restaurants/cafes</li>
                            <li><strong>Vegetarian:</strong> Limited options but improving</li>
                            <li><strong>Alcohol:</strong> Widely available except during religious holidays</li>
                            <li><strong>Coffee culture:</strong> Meetings can last hours over one coffee</li>
                        </ul>
                    </section>

                    <section className="box-text">
                        <h3>🚨 Tourist Scams to Avoid</h3>
                        <ul>
                            <li><strong>Taxi overcharging:</strong> Always insist on meter or agree price beforehand</li>
                            <li><strong>Restaurant bills:</strong> Check prices before ordering, especially for fish</li>
                            <li><strong>Money exchange:</strong> Count your money before leaving the booth</li>
                            <li><strong>Fake police:</strong> Real police always show ID, never ask for wallet</li>
                            <li><strong>"Closed" attractions:</strong> Verify with official sources</li>
                        </ul>
                    </section>

                    <section className="box-text">
                        <h3>📅 Public Holidays & Events</h3>
                        <ul>
                            <li><strong>New Year:</strong> Jan 1-2</li>
                            <li><strong>Orthodox Christmas:</strong> Jan 7</li>
                            <li><strong>Orthodox Easter:</strong> Variable (Spring)</li>
                            <li><strong>May Day:</strong> May 1</li>
                            <li><strong>St. Cyril and Methodius:</strong> May 24</li>
                            <li><strong>Ilinden:</strong> Aug 2 (National Day)</li>
                            <li><strong>Independence Day:</strong> Sep 8</li>
                            <li><strong>Note:</strong> Banks, offices closed on holidays</li>
                        </ul>
                    </section>

                    <section className="box-text">
                        <h3>🎯 Final Pro Tips</h3>
                        <ul>
                            <li>Download offline maps (Google Maps works great)</li>
                            <li>Keep passport copy separate from original</li>
                            <li>Learn Cyrillic basics - street signs use it</li>
                            <li>Dress modestly when visiting monasteries</li>
                            <li>Try rakija (fruit brandy) but pace yourself!</li>
                            <li>Macedonians are incredibly hospitable - accept offered coffee/food</li>
                            <li>Photography usually OK but ask at religious sites</li>
                            <li>Carry tissues - public toilets often lack paper</li>
                            <li>Summer is HOT (35°C+), winter can be harsh (-10°C)</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}