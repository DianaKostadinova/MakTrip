import React, { useEffect, useState } from 'react';
import { auth, db } from './Firebase';
import {
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    where
} from 'firebase/firestore';
import { Filter } from 'bad-words';
import './chat.css';

const DEFAULT_PFP = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png';

const CHAT_CATEGORIES = [
    {
        id: 'meetup',
        name: 'Find Travel Buddies',
        icon: '👥',
        description: 'Connect with other tourists to explore together'
    },
    {
        id: 'experiences',
        name: 'Share Experiences',
        icon: '📸',
        description: 'Share your travel stories and memorable moments'
    },
    {
        id: 'help',
        name: 'Ask for Help',
        icon: '❓',
        description: 'Get directions, tips, and local advice'
    },
    {
        id: 'recommendations',
        name: 'Recommendations',
        icon: '⭐',
        description: 'Recommend places, food, and activities'
    }
];

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [user, setUser] = useState(null);
    const [activeCategory, setActiveCategory] = useState('meetup');
    const [showDropdown, setShowDropdown] = useState(false);
    const filter = new Filter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Get all messages and filter by category on the client side
        const q = query(collection(db, 'messages'), orderBy('timestamp'));

        const unsubscribeMessages = onSnapshot(q, snapshot => {
            const allMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Filter messages by active category
            const filteredMessages = allMessages.filter(msg => msg.category === activeCategory);
            setMessages(filteredMessages);
        });

        return () => unsubscribeMessages();
    }, [activeCategory]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !user) return;

        const cleanedMessage = filter.clean(newMessage);
        await addDoc(collection(db, 'messages'), {
            text: cleanedMessage,
            user: user.displayName || user.email,
            photo: user.photoURL || null,
            uid: user.uid,
            category: activeCategory,
            timestamp: serverTimestamp()
        });

        setNewMessage('');
    };

    const handleLogout = () => {
        signOut(auth);
    };

    const getActiveCategoryInfo = () => {
        return CHAT_CATEGORIES.find(cat => cat.id === activeCategory);
    };

    return (
        <div>
            <div className="background-fixed"></div>
            <div className="chat-page">
                <div className="chat-header">
                    <div className="header-left">
                        <h2>Tourist Chat</h2>
                        <div className="category-selector">
                            <button
                                className="category-dropdown-btn"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                {getActiveCategoryInfo()?.icon} {getActiveCategoryInfo()?.name} ▼
                            </button>
                            {showDropdown && (
                                <div className="category-dropdown">
                                    {CHAT_CATEGORIES.map(category => (
                                        <div
                                            key={category.id}
                                            className={`category-option ${activeCategory === category.id ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveCategory(category.id);
                                                setShowDropdown(false);
                                            }}
                                        >
                                            <div className="category-info">
                                                <span className="category-icon">{category.icon}</span>
                                                <div>
                                                    <div className="category-name">{category.name}</div>
                                                    <div className="category-desc">{category.description}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {user && <button onClick={handleLogout}>Logout</button>}
                </div>

                <div className="chat-info">
                    <div className="active-category-info">
                        <span className="big-icon">{getActiveCategoryInfo()?.icon}</span>
                        <div>
                            <h3>{getActiveCategoryInfo()?.name}</h3>
                            <p>{getActiveCategoryInfo()?.description}</p>
                        </div>
                    </div>
                </div>

                <div className="chat-box">
                    {messages.length === 0 ? (
                        <div className="empty-chat">
                            <span className="empty-icon">{getActiveCategoryInfo()?.icon}</span>
                            <p>No messages yet in {getActiveCategoryInfo()?.name}</p>
                            <p>Be the first to start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={msg.id || i} className={`message ${msg.uid === user?.uid ? 'you' : 'other'}`}>
                                <img src={msg.photo || DEFAULT_PFP} alt="pfp" />
                                <div className="message-content">
                                    <div className="message-header">
                                        <strong>{msg.user}</strong>
                                        <span className="message-time">
                                            {msg.timestamp?.toDate?.()?.toLocaleTimeString() || 'Sending...'}
                                        </span>
                                    </div>
                                    <div className="message-text">{msg.text}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        placeholder={user ? `Message ${getActiveCategoryInfo()?.name}...` : 'Login to chat'}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={!user}
                    />
                    <button className="send-button" onClick={sendMessage} disabled={!user || !newMessage.trim()}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}