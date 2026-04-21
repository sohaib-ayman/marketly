import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export let UserContext = createContext();

export default function UserContextProvider(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

            if (currentUser) {
                setUser(currentUser);
            } else {
                const result = await signInAnonymously(auth);
                setUser(result.user);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {props.children}
        </UserContext.Provider>
    );
}