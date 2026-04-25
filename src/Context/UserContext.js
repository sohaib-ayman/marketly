import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { createContext, useEffect, useRef, useState } from "react";
import { auth } from "../firebase";
import { store } from "../Store/store";
import { mergeCart, clearCart } from "../Store/cartSlice";

export let UserContext = createContext();

export default function UserContextProvider(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const previousUser = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                if (!currentUser.isAnonymous && previousUser.current?.isAnonymous) {
                    let guestCart = store.getState().cart.items;
                    if (guestCart.length > 0) {
                        store.dispatch(clearCart());
                        store.dispatch(mergeCart(guestCart));
                    }
                }
                previousUser.current = currentUser;
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