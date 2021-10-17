import React, { useContext, useState } from 'react'
import "./Login.css"
import { TextField, Button, CardMedia } from "@material-ui/core"
// import Carousel from 'react-material-ui-carousel'
import { AuthContext } from '../context/AuthProvider'
import { CarouselProvider, Slider, Slide, Image } from 'pure-react-carousel';
import Img1 from '../Assets/img1.jpg'
import Img2 from '../Assets/img2.jpg'
import Img3 from '../Assets/img3.jpg'
import Img4 from '../Assets/img4.jpg'
import Img5 from '../Assets/img5.jpg'
import Insta from '../Assets/insta.png'
function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loader, setLoader] = useState(false);
    let { Signin } = useContext(AuthContext);
    console.log(Signin);
    async function handleSignIn(e) {
        e.preventDefault();
        try {
            setLoader(true);
            let res = await Signin(email, password);
            console.log(res.id);
            setLoader(false);
            props.history.push("/");
        } catch (e) {
            console.log(e);
            setLoader(false);
        }
    }
    return (
        <div className="login__page">
            <div className="cousel__container" >
                <img src={Insta} alt="" />
                <div className="caro">
                    <figure>
                        <img className="image" src="https://www.instagram.com/static/images/homepage/screenshot1.jpg/d6bf0c928b5a.jpg" />
                        <img className="image" src="https://www.instagram.com/static/images/homepage/screenshot2.jpg/6f03eb85463c.jpg" />
                        <img className="image" src="https://www.instagram.com/static/images/homepage/screenshot4.jpg/842fe5699220.jpg" />
                        <img className="image" src="https://www.instagram.com/static/images/homepage/screenshot5.jpg/0a2d3016f375.jpg" />
                    </figure>
                </div>

                
                {/* style={{ backgroundImage: `url(` + Insta + `)`, backgroundSize: 'cover' }} */}

            </div>
            <div className="loginform__container">
                <div className="instalogotext">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1024px-Instagram_logo.svg.png"></img>
                </div>

                <div className="loginform">

                    <TextField
                        id="outlined-password-input"
                        label="Email"
                        type="Email"
                        autoComplete="current-password"
                        variant="outlined"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="Password"
                        autoComplete="current-password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={(e) => { handleSignIn(e) }}
                        disabled={loader}>Login</Button>
                </div>
                <div className="signup__option">
                    Don't have an Account <a href="/signup">Sign Up</a>
                </div>
            </div>
        </div>
    )
}

export default Login

{/* */ }
{/* <Carousel className="carousel" animation="fade" indicators={false} swipe={false} navButtonsAlwaysInvisible={true} autoPlay interval="3000">
<img className="image" src="https://www.instagram.com/static/images/homepage/screenshot1.jpg/d6bf0c928b5a.jpg" />
<img className="image" src="https://www.instagram.com/static/images/homepage/screenshot2.jpg/6f03eb85463c.jpg" />
<img className="image" src="https://www.instagram.com/static/images/homepage/screenshot4.jpg/842fe5699220.jpg" />
<img className="image" src="https://www.instagram.com/static/images/homepage/screenshot5.jpg/0a2d3016f375.jpg" />
</Carousel> */}
{/* <img className="crousel__image" src="https://www.instagram.com/static/images/homepage/home-phones.png/43cc71bb1b43.png">

</img> */}