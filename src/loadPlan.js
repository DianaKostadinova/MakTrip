import { doc, getDoc } from "firebase/firestore";
import { db } from "./Firebase";

export async function loadPlan(uid) {
    const docSnap = await getDoc(doc(db, "plans", uid));
    return docSnap.exists() ? docSnap.data().plan : null;
}
