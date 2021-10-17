import React, { useContext, useEffect, useState } from 'react'
import "./CommentBox.css";
import {Avatar} from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { database, firestore } from '../firebase';
import useUserData from './useUserData';
import { AuthContext } from '../context/AuthProvider';
function CommentBox(props) {
    let {videoUrl,profileUrl,username,puid}=props.videoObj;
    let postData=props.postData;
    let {currentUser}=useContext(AuthContext);
    const [usercomments,setComments]=useState([]);
    // const [commentObjs,setUserComments]=useState([]);
    let userData=useUserData(currentUser.uid);
    let currUsername=userData.username;
    let currUserProfileUrl=userData.profileUrl;
    // console.log(currUsername,currUserProfileUrl);
    const[value,setValue]=useState("");
    let color=props.isLiked?"red":"white";
   async function addNewComment(e){
       e.preventDefault();
       setValue("");
    //    alert("comment");
       try{
        let res=await firestore.collection('comments').add({
            comment:value,
            username:currUsername,
            profileUrl:currUserProfileUrl,
            createdAt:database.getUserTimeStamp(),
        })
        let cid=res.id;
        await database.posts.doc(puid).update({
            comments:[...postData.comments,cid],
        })
       
       }catch(e){

       }
     
    }
    useEffect(async ()=>{
        console.log(postData);
        let docRefSnap=await database.posts.doc(puid).onSnapshot(async (snapshot)=>{
            let data=snapshot.data();
            let cids=data.comments;
            let allComments=[];
            for(let i=0;i<cids.length;i++){
                console.log(cids[i]);
                let docRef=await database.comments.doc(cids[i]).get();
                 allComments.push(docRef.data());
               }
    setComments(allComments);
      console.log(allComments)
       })  
      },[postData])
    console.log(usercomments)
    return (
        <div className="comment__box">
           <div className="comment__leftcontainer">
           <video src={videoUrl} controls autoPlay>
            </video>
           </div>
           <div className="comment__rightcontainer">
            <div className="post__userInfo">
                <Avatar src={profileUrl}></Avatar>
                <h4>{username}</h4>
            </div> 
            <div className="comments">
                {usercomments.map((obj)=>{
                    return(
                <div className="comment__userInfo">
                <Avatar src={obj.profileUrl}></Avatar>
                <h4>{obj.username}</h4>
                <p>{obj.comment}</p>
            </div>  
                    )
                })}
            </div>
            <div className="add_newComment">
              <div className="like__option">
                  <FavoriteIcon onClick={()=>{props.handleLike(puid)}} style={{color:`${color}`}}></FavoriteIcon>
                  <p>Liked by nobody</p>
              </div>
              <div className="new__commentcontainer">
                  <input type="text" name="" id="" placeholder="Add Comment" value={value} onChange={(e)=>{setValue(e.target.value)}}/>
                  <button onClick={(e)=>{addNewComment(e)}}>Post</button>
              </div>
            </div>   
            </div>
        </div>
    )
}

export default CommentBox
