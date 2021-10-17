import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { database } from '../firebase';
import NavBar from './NavBar'
import useUserData from './useUserData'
import {Avatar} from "@material-ui/core";
import "./Profile.css"
function Profile() {
    let {currentUser}=useContext(AuthContext);
    let userData=useUserData(currentUser.uid);
    let [allPosts,setAllPosts]=useState([]);
    let postIds=userData.posts;
    console.log(userData);
    useEffect( async ()=>{
        if(postIds){
            let allPostdObjs=[];
            for(let i=0;i<postIds.length;i++){
              let docRef=await database.posts.doc(postIds[i]).get();
              allPostdObjs.push(docRef.data());
            }
            setAllPosts(allPostdObjs);
        }
    
    },[postIds])
    console.log(allPosts);
    return (
        <>
          <NavBar></NavBar>
            <div>
             <div className="currentuser__info">
                <div className="profileImage__currentuser">
                  <Avatar src={userData=={}?"":userData.profileUrl}></Avatar>
                </div>
                <div className="currentuser__detao">
                <h3>{userData.username}</h3>
                <p>Number of Posts :<h4 style={{display:"inline"}}>{postIds==undefined?0:postIds.length}</h4> </p>
                <p>Email : <h4 style={{display:"inline"}}>{userData=={}?"":userData.email}</h4></p>
                </div>
             </div>
             <div className="currentuser__posts">
                  {allPosts.map((post)=>{
                      return (
                          <div className="currentUserpost">
                              <video src={post.postUrl} controls></video>
                          </div>
                      )
                  })

                  }
             </div>
            </div>
            </>
           
       
    )
}

export default Profile
