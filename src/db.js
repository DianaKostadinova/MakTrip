import { doc, setDoc } from "firebase/firestore";
import { db } from "./Firebase";

export function savePlan(uid, planText) {
    return setDoc(doc(db, "plans", uid), { plan: planText });
}
