import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import { v4 as uuidv4 } from 'uuid';
import { Button, makeStyles } from "@material-ui/core"
import FeedPosts from './FeedPosts'
import BackupIcon from '@material-ui/icons/Backup';
import "./Feed.css"
import { database, firestore, storage } from '../firebase';
import { AuthContext } from '../context/AuthProvider';
import useUserData from './useUserData';
function Feed(props) {
  const[loading,setLoading]=useState(false);
  const [error,setError]=useState();
  let {currentUser} =useContext(AuthContext);
  let userData=useUserData(currentUser.uid);
//   console.log(userData);
   useEffect(()=>{
       
   },[])
  async function handleNewVideo(e){
      e.preventDefault();
      try{
        setLoading(true);
        let file=e?.target?.files[0];
        let video;
        if(file!=null){
          video=e.target.files[0];
        }
        if (video.size / (1024 * 1024) > 40) {
          alert("The selected file is very big");
          setLoading(false);
          return;
        }
        let puid=uuidv4();//this will give us unique id 
      //   console.log(puid);
      //   console.log(video);
        let uploadListner=storage.ref(`/posts/${puid}/`).put(video);
        uploadListner.on("state_changed",f1,f2,f3);
        function f1(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        }
        function f2(e){
         setError(e);
         setLoading(false);
        }
        async function f3(){
            let downloadUrl=await uploadListner.snapshot.ref.getDownloadURL();
            let res=await firestore.collection('posts').add({
                username: currentUser.uid,
                uploadedAt: database.getUserTimeStamp(),
                postUrl: downloadUrl,
                likes: [],
                comments: [],
            })
            let pid=res.id;
            await database.users.doc(currentUser.uid).update({
                posts:[...userData.posts,pid]
            })
            props.history.push("/");
            setLoading(false);
        }
        
       
      }catch(err){
          
      }

  }
    return (

        <>
            <NavBar></NavBar>
            <div className="feed__container">
                <div className="upload__button">
                    <Button endIcon={<BackupIcon></BackupIcon>}
                        variant="outlined"
                        component="label"
                        disabled={loading}
                        color="secondary"

                    >
                        Upload Video
                        <input
                            type="file"
                            hidden
                            onChange={(e)=>{
                                handleNewVideo(e)
                            }}
                        />
                    </Button>
                </div>

                <div className="posts__container">
                    <FeedPosts></FeedPosts>
                 </div>
           </div>
          </>
    )
}

export default Feed
