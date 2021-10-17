//it is an custom hook to get data of currentUser 
import React,{useState,useEffect} from 'react';

import { database } from '../firebase';
function useUserData(uid) {
    
    const [user,setUser]=useState({});
   
    useEffect(async () => {
        let docRef = await database.users.doc(uid).get();
        let data = docRef.data();
        console.log(data);
        setUser(data);
     
    }, [])
    return user;
}

export default useUserData