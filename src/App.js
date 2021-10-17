import logo from './logo.svg';
import './App.css';
import {Route, Switch,Redirect} from "react-router-dom";
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import Feed from './components/Feed';
import AuthProvider, { AuthContext } from './context/AuthProvider';
import { useContext } from 'react';
import NavBar from './components/NavBar';
//PrivateRoutes for pages where a user can only access if he/she is logged in 
//authentication is provided from context (AuthProvider)
function App() {
  return (
    <div>
      
      <AuthProvider>
      <Switch>
        
       <Route path="/signup" component={Signup}></Route>
       <Route path="/login" component={Login}></Route>
       <PrivateRoute path="/profile" comp={Profile}></PrivateRoute>
       <PrivateRoute path="/" comp={Feed}></PrivateRoute>
      </Switch>
      </AuthProvider>
     </div>
  );
}
function PrivateRoute(props){
  let Component=props.comp;
 let {currentUser}=useContext(AuthContext);
 console.log(currentUser);
 //if currUser is not null or user he logged in he can access to private Routes(profile,feed) else redirect
 //to login Page
 return(
   <Route {...props} render={(props)=>{return currentUser!==null?<Component {...props}></Component>:
  <Redirect to="/login"></Redirect>  }}></Route>
 )
  
}
export default App;
{/* <Route path="/profile" component={Profile}></Route>
<Route path="/" component={Feed}></Route> */}