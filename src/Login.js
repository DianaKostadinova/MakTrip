import React, { useState } from 'react';
import { auth, storage } from './Firebase';
import './login.css';
import {
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    sendEmailVerification
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (onLogin) onLogin();
            navigate('/');
        } catch (err) {
            alert("❌ Login failed: " + err.message);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);

        try {
          
            const timestamp = Date.now();
            const fileRef = ref(storage, `profile-images/${timestamp}_${file.name}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            setPhotoURL(url);
        } catch (err) {
            alert("❌ Failed to upload image: " + err.message);
        }
    };

    const register = async () => {
        if (!displayName.trim()) {
            return alert("Please enter a display name");
        }

        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(userCred.user, {
                displayName: displayName.trim(),
                photoURL: photoURL || null
            });

            await sendEmailVerification(userCred.user);
            alert("✅ Registered! Check your email to verify.");
            if (onLogin) onLogin();
            navigate('/');
        } catch (err) {
            alert("❌ Registration failed: " + err.message);
        }
    };

    const resetPassword = async () => {
        if (!email) return alert("Please enter your email first.");
        try {
            await sendPasswordResetEmail(auth, email);
            alert("📧 Password reset email sent. Check your inbox.");
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    return (
        <div>
            <div className="background-fixed"></div>
            <div className="login-container">
                <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>

                <div className="auth-toggle">
                    <button
                        className={!isRegistering ? 'active' : ''}
                        onClick={() => setIsRegistering(false)}
                    >
                        Login
                    </button>
                    <button
                        className={isRegistering ? 'active' : ''}
                        onClick={() => setIsRegistering(true)}
                    >
                        Register
                    </button>
                </div>

                {isRegistering && (
                    <input
                        type="text"
                        placeholder="Display Name *"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                )}

                <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="password-input-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? '' : ''}
                    </button>
                </div>

                {isRegistering && (
                    <div className="file-upload-section">
                        <label className="file-upload-label">
                            📷 Upload Profile Picture (Optional)
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                        {photoURL && (
                            <div className="preview-container">
                                <img
                                    src={photoURL}
                                    alt="Profile preview"
                                    className="profile-preview"
                                />
                                <p>✅ Image uploaded successfully</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="button-group">
                    {isRegistering ? (
                        <button onClick={register} className="primary-btn">
                            Create Account
                        </button>
                    ) : (
                        <button onClick={login} className="primary-btn">
                            Login
                        </button>
                    )}

                    {!isRegistering && (
                        <button onClick={resetPassword} className="secondary-btn">
                            Forgot Password?
                        </button>
                    )}
                </div>

                {!isRegistering && (
                    <p className="switch-text">
                        Don't have an account?
                        <button
                            className="link-btn"
                            onClick={() => setIsRegistering(true)}
                        >
                            Sign up here
                        </button>
                    </p>
                )}

                {isRegistering && (
                    <p className="switch-text">
                        Already have an account?
                        <button
                            className="link-btn"
                            onClick={() => setIsRegistering(false)}
                        >
                            Login here
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
}