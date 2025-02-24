import React from 'react'
import { useRef,useContext } from 'react';
import './Login.css';
import {Usercontext} from '../contextapi/contextlogin';
import apicall from './apicalls';
import {CircularProgress} from '@mui/material'
import {Link} from 'react-router-dom'; 
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
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
        {isMobile && <div><h1 className='logologin' style={{position:'absolute',marginTop:'-90px'}}>Irengesocial</h1></div>}
            <form className='formlogin' onSubmit={handlesubmission}> 
                <input type="email" required ref={email} placeholder='your email'/>
                <input type="password" required ref={password} placeholder='your password '/>
                <button type="submit"  className='submbutton'>{isfetching?<CircularProgress size="20px" style={white}/>:'Log in'}</button>
                <p className='error'>{erreur?erreur:''}</p>
                {/* <p className='loginforget'>Forgot password?</p> */}
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
