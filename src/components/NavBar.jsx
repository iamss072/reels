import React,{useContext, useEffect,useState} from 'react'
import {Button,Avatar} from "@material-ui/core"
import HomeIcon from '@material-ui/icons/Home';
import ExploreIcon from '@material-ui/icons/Explore';
import "./NavBar.css"
import { AuthContext } from '../context/AuthProvider';
import { database } from '../firebase';
import useUserData from './useUserData';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
function NavBar(props) {
    //  const [profileImage,setProfileImage]=useState();
    const {currentUser,Signout}=useContext(AuthContext);
    const userData=useUserData(currentUser.uid);
       
   async function handleLogout(){
       let res=await Signout();
    }     
   
    return (
        <div className="app__bar">
            <div className="insta__logoImage">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"></img>
            </div>
            <div className="header__options">
             <Button href="/">
              <HomeIcon></HomeIcon>
             </Button>
             <Button href="/">
              <ExploreIcon></ExploreIcon>
             </Button>
             <Button href="/profile">
                 <Avatar className="header__profileimage"
                 src={userData.profileUrl}></Avatar>
             </Button>
             <Button variant="outlined" color="secondary" onClick={()=>{handleLogout()}} style={{fontSize:"x-small"}}>
                 Logout
             </Button>
            </div>
           
        </div>
    )
}

export default NavBar
