import React, { useState, useEffect } from "react";
import { OpenAI } from "openai";
import { auth, db } from "./Firebase";
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, getDoc } from "firebase/firestore";

import { savePlan } from "./db";
import { loadPlan } from "./loadPlan";
import AuthModal from "./auth";
import './AIPlanner.css';

const client = new OpenAI({
    baseURL: "https://router.huggingface.co/fireworks-ai/inference/v1",
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});

function TravelPlanner() {
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [budget, setBudget] = useState("");
    const [interests, setInterests] = useState("");
    const [plan, setPlan] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    const generatePlan = async () => {
        setLoading(true);

        const userPrompt = `Create a short personalized travel plan for someone staying in ${location} from ${startDate} to ${endDate}. Their budget is ${budget} EUR and they are interested in ${interests}. Suggest realistic activities, places to visit, and tips. If the user is visiting the city for a longer period of time, we can add day trips to other cities like Ohrid, Veles, Bitola...`;

        try {
            const chatCompletion = await client.chat.completions.create({
                model: "accounts/fireworks/models/deepseek-r1-0528",
                messages: [
                    {
                        role: "user",
                        content: userPrompt,
                    },
                ],
            });

            setPlan(chatCompletion.choices[0].message.content);
        } catch (err) {
            console.error("Error:", err);
            setPlan("Something went wrong while generating your plan.");
        }

        setLoading(false);
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
            await setDoc(userRef, {
                pinnedPlaces: [],
                likes: {},
                travelPlan: plan 
            });
        } else {
            await updateDoc(userRef, {
                travelPlan: plan
            });
        }

        alert('✅ Plan saved to your profile!');
    };

    return (
        <div className="planner-wrapper">
            <div className="background-fixed"></div>
            <div className="planner-page">
                <h2 className="title">Let us help you plan your adventure in Macedonia!</h2>

                <input type="text" placeholder="Enter apartment location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <input type="number" placeholder="Your total budget in EUR" value={budget} onChange={(e) => setBudget(e.target.value)} />
                <input type="text" placeholder="Your interests?" value={interests} onChange={(e) => setInterests(e.target.value)} />

                <button onClick={generatePlan} disabled={loading}>
                    {loading ? "Generating..." : "Generate Travel Plan"}
                </button>

                {plan && (
                    <>
                        <div className="result-box">
                            <h3>Your Travel Plan:</h3>
                            <pre>{plan}</pre>
                        </div>
                        <button className="btn btn-warning mt-3" onClick={handleSave}> Save to Profile</button>
                    </>
                )}
            </div>
        </div>
    );


}

export default TravelPlanner;
