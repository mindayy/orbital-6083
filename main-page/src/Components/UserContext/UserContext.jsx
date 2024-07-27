import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const db = getFirestore();

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUser({ ...currentUser, ...userDoc.data() });
                } else {
                    setUser(currentUser);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (email) => {
        const auth = getAuth();
        const db = getFirestore();
        const currentUser = auth.currentUser;

        if (currentUser) {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
                setUser({ ...currentUser, ...userDoc.data() });
            } else {
                await setDoc(doc(db, 'users', currentUser.uid), { email });
                setUser({ ...currentUser, email });
            }
        }
    };

    return (
        <UserContext.Provider value={{ user, login }}>
            {children}
        </UserContext.Provider>
    );
};
