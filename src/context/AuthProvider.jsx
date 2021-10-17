import React, { createContext, useEffect, useState } from 'react'
import auth from '../firebase';


export const AuthContext = React.createContext();
function AuthProvider(props) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    function Signin(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }
    function Signup(email,password){
        return auth.createUserWithEmailAndPassword(email,password);
    }
    function Signout(){
        return auth.signOut();
    }
    let value = {
        currentUser,
        Signin,
        Signup,
        Signout,
    }
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        })
        return unsubscribe;
    },[])
    return (
        <AuthContext.Provider value={value}>
            {!loading&&props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
