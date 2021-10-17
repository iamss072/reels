import React,{useContext,useState} from 'react'
import { TextField, Button, CardMedia } from "@material-ui/core"
import BackupIcon from '@material-ui/icons/Backup';
import { database, firestore, storage } from '../firebase';
import "./Signup.css"
import { AuthContext } from '../context/AuthProvider';
function Signup(props) {
    const [email,setSignupEmail]=useState("");
    const [password,setSignupPassword]=useState("");
    const [username,setUsername]=useState("");
    const [imageFile,setImageFile]=useState(null);
    const [loader,setLoader]=useState(false);
    const {Signup}=useContext(AuthContext);
    async function handleSignUp(e){
       e.preventDefault();
       console.log(email,password,username,imageFile);
       try{
           setLoader(true);
          let res=await Signup(email,password);
          let uid=res.user.uid;
          let uploadListner=storage.ref(`user/${uid}/profileImage`).put(imageFile);
          //f1=>progress
          //f2=>error
          //f3=>success
          uploadListner.on("state_changed",f1,f2,f3);
          function f1(snapshot){
              //track the progress of file uploading
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
            console.log("fn1");
          }
          function f2(error){
              setLoader(false);
            console.log(error);
          }
         async function f3(){
            console.log(uid);
             let downloadUrl=await uploadListner.snapshot.ref.getDownloadURL();
             //create document in Users collection
             database.users.doc(uid).set({
                email: email,
                userId: uid,
                username,
                createdAt: database.getUserTimeStamp(),
                profileUrl: downloadUrl,
                posts:[],
             })
             setLoader(false);
             props.history.push("/");
          }
       }catch(e){
           console.log(e);
           setLoader(false);
       }
    }
    const saveFile = (e) => {
        let file = e?.target?.files[0];
        if (file != null) {
            console.log(file);
            setImageFile(e.target.files[0]);
        }
    }
    return (
        <div className="signup__container">
            <div className="signup__form">
                <div className="image__container">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"></img>
                </div>
                <p>Sign up to see photos and videos from your friends</p>
                <TextField
                className="button"
                    id="outlined-password-input"
                    label="Username"
                    type="text"
                    autoComplete="current-password"
                    variant="outlined"
                    value={username}
                    onChange={(e)=>{setUsername(e.target.value)}}
                />
                <TextField
                className="button"
                    id="outlined-password-input"
                    label="Email"
                    type="email"
                    autoComplete="current-password"
                    variant="outlined"
                    value={email}
                    onChange={(e)=>{setSignupEmail(e.target.value)}}
                />
                <TextField
                className="button"
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="outlined"
                    value={password}
                    onChange={(e)=>{setSignupPassword(e.target.value)}}
                />
                <Button endIcon={<BackupIcon></BackupIcon>}
                    variant="outlined"
                    component="label"
                    
                    color="secondary"
                   
                >
                    Upload Profile Picture
                    <input
                        type="file"
                        hidden
                       
                       accept="image"
                       onChange={(e)=>{saveFile(e)}}
                    />
                </Button>
                <Button variant="contained" color="primary" onClick={(e)=>{handleSignUp(e)}} disabled={loader}>
                    Sign up
                </Button>
                <p>By Signing up you agree to our terms Data Policy and Cookies policy </p>
            </div>
            <div className="login__option">
                <p>Already have a account ? <a href="/login">Log in</a></p>
            </div>
        </div>
    )
}

export default Signup
