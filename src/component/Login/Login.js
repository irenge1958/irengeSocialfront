import React from 'react'
import { useRef,useContext } from 'react';
import './Login.css';
import {Usercontext} from '../contextapi/contextlogin';
import apicall from './apicalls';
import {CircularProgress} from '@mui/material'
import {Link} from 'react-router-dom'; 
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import {auth,provider} from '../../firebase'
import { signInWithPopup } from "firebase/auth";
import apicall2 from './apicall2';
import apiClient from '../../apiclient'
import { useHistory } from "react-router-dom";
const Login =()=>{
    const isDesktop = useMediaQuery({ minWidth: 1224 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1224 });
    const isMobile = useMediaQuery({ maxWidth: 767 });

  const [erreur,setErreur]=useState(null)
    const email=useRef();
    const password=useRef();
    const {user,isfetching,error,dispatch}=useContext(Usercontext);
const handlesubmission=(e)=>{
 e.preventDefault();
    apicall({email:email.current.value, password:password.current.value},dispatch)
    setErreur(error)

}
const white={
    color:'white',
    size:'2px'
}
const navigateto=useHistory()
const handleGoogleSignIn = () => {
    signInWithPopup(auth,provider)
  .then(async(result)=>{
    try{
      const response = await axios.post('/Auth/signinwithgoogle', {
        email: result.user.email,
        img: result.user.photoURL,
        username: result.user.displayName,
      })
      apicall2(response.data,dispatch)
    
    }catch(err){
console.log(err)
    }})
  .catch((err)=>{console.log(err)})
  };
return(
      
    <div className="loginwrapperall">
    <div className="loginwrapper">
      {!isMobile &&  <div className="welcome">
             <h1 className="logologin">
                Irengesocial
            </h1>
            <p>Connect with friends and the world around you on Irengesocial</p>
        </div>}
        <div className="loginstyle">
        {isMobile && <div><h1 className='logologin' style={{position:'absolute',marginTop:'-100px'}}>Irengesocial</h1></div>}
            <form className='formlogin' onSubmit={handlesubmission}> 
                <input type="email" required ref={email} placeholder='your email'/>
                <input type="password" required ref={password} placeholder='your password '/>
                <button type="submit"  className='submbutton'>{isfetching?<CircularProgress size="20px" style={white}/>:'Log in'}</button>
                <p className='error'>{erreur?erreur:''}</p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
  <div className='regbutton' 
       style={{ 
         backgroundColor: 'white', 
         border: '1px solid gray', 
         color: 'gray', 
         display: 'flex', 
         alignItems: 'center', 
         justifyContent: 'center', 
     
         borderRadius: '5px',
         cursor: 'pointer'
       }} 
       onClick={handleGoogleSignIn}
  >
    <img
      src="https://developers.google.com/identity/images/g-logo.png"
      alt="Google logo"
      style={{ width: '20px', marginRight: '10px' }}
    />
    Continue with Google
  </div>
</div>

                <Link to='/register'>
                <button className='regbutton'>create an account</button>
                </Link>
            </form>
        </div>
    </div>
    </div>
)
}
export default Login
