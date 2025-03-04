import React from 'react'
import './register.css'
import { useRef } from 'react'
import apiClient from '../../apiclient'
import { useState } from 'react';
import {Link,useHistory} from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
const Register =()=>{
    const [erreur,seterreur]=useState(null)
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const email=useRef()
        const username=useRef()
        const password=useRef()
        const passwordagain=useRef()
        const history=useHistory()
    const register=async(e)=>{
        e.preventDefault()
       
        if(password.current.value!==passwordagain.current.value){
         
            password.current.setCustomValidity('Password don\'t match')
            document.getElementById('formloginx').reportValidity();
            return;
        }
        else{
            try {
            const res=await apiClient.post('Auth/register',{email:email.current.value,username:username.current.value,password:password.current.value})
          history.push('/') 
          
        } catch (error) {
             
                seterreur(error.response.data)
                console.log(erreur)
            }
        }
            
    }
    return(
        <div className="loginwrapperallx">
        <div className="loginwrapperxx">
        {!isMobile && <div className="welcomex">
                <h1 className="logologinx">
                    Irengesocial
                </h1>
                <p>Connect with friends and the world around you on Irengesocial</p>
            </div>}
            <div className="loginstylex">
            {isMobile && <div><h1 className='logologin' style={{position:'absolute',marginTop:'-90px'}}>Irengesocial</h1></div>}
                <form className='formloginx' id='formloginx'> 
                <input type="email" ref={email}   placeholder='your email' required/>
                    <input type="text" required ref={username}  placeholder='username'/>
                    <input type="password" ref={password} minlength='6' required placeholder='your password'/>
                    <input type="password" ref={passwordagain}  required placeholder='confirm password '/>
                    <button type="submit" className='submbuttonx' onClick={register}>Sign in</button>
<p className='erreurx'>{erreur?erreur:''}</p>
<Link to='/'>
    
                    <button className='regbuttonx'>Log into account</button></Link>
                </form>
            </div>
        </div>
        </div>
    )
    }
    export default Register
    