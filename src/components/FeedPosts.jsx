import React, {useState, useEffect, useContext } from 'react'
import "./FeedPosts.css"
import ReactDOM from 'react-dom';
import {Avatar} from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import { database } from '../firebase'
import { AuthContext } from '../context/AuthProvider';
import CommentBox from './CommentBox';
import CircularProgress from '@material-ui/core/CircularProgress';
function FeedPosts() {
    const[posts,setPosts]=useState(null);
    useEffect( async ()=>{
        let unsub=await database.posts.orderBy("uploadedAt","desc").onSnapshot(async (snapshot)=>{
            let videoObjs=snapshot.docs.map((doc)=>{return doc.data()});
            let videoArr=[];
            for(let i=0;i<videoObjs.length;i++){
                let videoUrl = videoObjs[i].postUrl;
                let auid = videoObjs[i].username;
                let id = snapshot.docs[i].id;

                //  console.log(videoUrl,auid);
                let docRef = await database.users.doc(auid).get();
                let data = docRef.data();
                let username = data.username;
                let profileUrl = data.profileUrl;
                videoArr.push({ videoUrl, username, profileUrl, puid: id });
            }
            setPosts(videoArr);
            console.log(videoArr);
        })
    },[]);

    console.log(posts);
    return (
        <>
            {posts==null?<CircularProgress style={{ position: 'absolute',left: '50%',top: '50%'}}></CircularProgress>:posts.map((postObj)=>{
                return <Video postObj={postObj} ></Video>
            })}
        </>
    )
}

export default FeedPosts
function Video(props){
     let {videoUrl,profileUrl,username,puid}=props.postObj;
     let {currentUser}=useContext(AuthContext);
     let [isCommentActive,setCommentActive]=useState(false);
     let [postData,setPostData]=useState(null);
     let [isLiked,setLiked]=useState(false);
    async function handleLike(puid){
       let postRef=await database.posts.doc(puid).get();
       let post = postRef.data();
       let likes = post.likes;
       console.log(isLiked);
       if (isLiked == false) {
           database.posts.doc(puid).update({
               "likes": [...likes, currentUser.uid]
           })
           setLiked(true);
       } else {
           console.log(post);
        //    console.log(currentUser.uid);
        
           let newlikes = post.likes.filter(lkuid => {
               console.log(lkuid,currentUser.uid);
               return lkuid != currentUser.uid;
           })
           database.posts.doc(puid).update({
               likes: newlikes
           });
           setLiked(false);
     }
    }
    function handleCommentActive(event){
        setCommentActive(true);
        let videoElem= event.currentTarget.parentNode.parentNode.firstChild;
        videoElem.pause()
         console.log(event.target.parentNode);
        document.body.onkeydown = (e) => {
            console.log(e.key);
            if (e.key === "Escape") {
                setCommentActive(false);
                videoElem.play();
            }
        }
        
    }
    useEffect(async ()=>{
        
        // let postRef=await database.posts.doc(puid).get();
        // let post = postRef.data();
        if(postData!==null){
            console.log(postData);
            let likes = postData.likes;
            console.log(likes);

            for(let i=0;i<likes.length;i++){
                if(likes[i]===currentUser.uid){
                    console.log(1);
                    setLiked(true);
                }
            }
        }
     },[postData])
    console.log(isLiked);
    useEffect( async ()=>{
        let docRefSnap=await database.posts.doc(puid).onSnapshot((snapshot)=>{
             let data=snapshot.data();
             setPostData(data);
        })
        return docRefSnap;
    },[])
    let color=isLiked?"red":"White";
    function callBack(enteries) {
        enteries.forEach((entry) => {
            let child = entry.target.children[0];
            child.play().then(() => {
                if (entry.isIntersecting == false) {
                    child.pause();
                }
            })
        })
    }
    let conditionObject = {
        root: null,
        threshold: "0.9",
    }
    const handleMutted=(e)=>{
        e.preventDefault();
        e.target.muted=!e.target.muted;
      }
    useEffect(() => {

        let observer = new IntersectionObserver(callBack, conditionObject);
        let allVideos = document.querySelectorAll(".videoContainer");
        console.log(allVideos);
        allVideos.forEach((video) => {
            observer.observe(video);
        })
    },[])
    const handleNextVideo=(e)=>{
        let next=ReactDOM.findDOMNode(e.target).parentNode.nextSibling;
        if(next){
            next.scrollIntoView({behavior:"smooth"});
        }
    }
    return (
        <div className="videoContainer">
            <video onEnded={(e)=>{handleNextVideo(e)}} src={videoUrl} autoPlay onClick={(e)=>{handleMutted(e)}}></video>
            <div className="user__info featuresame">
                <Avatar src={profileUrl}></Avatar>
                 <h4>{username} </h4>
            </div>
            <div className="video__features featuresame">
               <FavoriteIcon onClick={()=>{handleLike(puid)}} style={{color:`${color}`}}></FavoriteIcon>
               <ChatBubbleIcon onClick={(e)=>{handleCommentActive(e)}}></ChatBubbleIcon>
            </div>
            {isCommentActive?<CommentBox videoObj={props.postObj} isLiked={isLiked} 
            handleLike={handleLike} postData={postData}></CommentBox>:null}
        </div>
    )
}