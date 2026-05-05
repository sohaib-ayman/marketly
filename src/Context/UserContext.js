import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { createContext, useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { mergeCart, loadCartForUser } from "../Store/cartSlice";
import { useDispatch } from "react-redux";

export let UserContext = createContext();

export default function UserContextProvider(props) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const previousUser = useRef(null);
    const dispatch = useDispatch();

    useEffect(()=>{
        if(!user) return;
        const userId = user.isAnonymous ? "guest" : user.uid;
        dispatch(loadCartForUser(userId));
    }, [user]);

    async function attachRole(currentUser) {
        try {
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return {
                    ...currentUser,
                    role: userSnap.data().role || "user",
                };
            }

            await setDoc(userRef, {
                uid: currentUser.uid,
                email: currentUser.email || null,
                name: currentUser.displayName || "",
                role: "user",
                isAnonymous: false,
                createdAt: serverTimestamp(),
            });

            return {
                ...currentUser,
                role: "user",
            };

        } catch (err) {
            console.error("Role fetch error:", err);

            return {
                ...currentUser,
                role: "user",
            };
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

            if (currentUser) {

                if (!currentUser.isAnonymous) {

                    const userWithRole = await attachRole(currentUser);
                    setUser(userWithRole);

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
                    setUser({
                        ...currentUser,
                        role: "guest"
                    });

                    dispatch(loadCartForUser("guest"));
                }

                previousUser.current = currentUser;

            } else {
                const result = await signInAnonymously(auth);

                setUser({
                    ...result.user,
                    role: "guest"
                });

                dispatch(loadCartForUser("guest"));
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