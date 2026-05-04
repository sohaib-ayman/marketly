import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { createContext, useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { store } from "../Store/store";
import { mergeCart, clearCart } from "../Store/cartSlice";
import { useDispatch } from "react-redux";
import { loadCartForUser } from "../Store/cartSlice";

export let UserContext = createContext();

export default function UserContextProvider(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);
    const previousUser = useRef(null);
    let dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {

                if (!currentUser.isAnonymous) {

                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setRole(userSnap.data().role);
                    }
                    if (!userSnap.exists()) {
                        await setDoc(userRef, {
                            uid: currentUser.uid,
                            email: currentUser.email || null,
                            name: currentUser.displayName || "",
                            role: "user",
                            isAnonymous: false,
                            createdAt: serverTimestamp(),
                        });
                        setRole("user");
                    }

                    dispatch(loadCartForUser(currentUser.uid));

                    if (previousUser.current?.isAnonymous) {
                        const guestCart =
                            JSON.parse(localStorage.getItem("cart_guest")) || [];

                        if (guestCart.length > 0) {
                            dispatch(mergeCart({
                                guestItems: guestCart,
                                userId: currentUser.uid
                            }));

                            localStorage.removeItem("cart_guest");
                        }
                    }

                } else {
                    dispatch(loadCartForUser("guest"));
                }

                previousUser.current = currentUser;
                setUser(currentUser);

            } else {
                const result = await signInAnonymously(auth);
                setUser(result.user);
                dispatch(loadCartForUser("guest"));
                setRole(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, role }}>
            {props.children}
        </UserContext.Provider>
    );
}