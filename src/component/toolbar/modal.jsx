import React from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeSharpIcon from '@mui/icons-material/DarkModeSharp';
import FeedbackSharpIcon from '@mui/icons-material/FeedbackSharp';
import { useContext } from 'react';
import {Usercontext} from '../contextapi/contextlogin';
import { Link } from 'react-router-dom/cjs/react-router-dom';

import './toobar.css' ;
 const Modal=({toggleModalInfo})=>{
    const {user}=useContext(Usercontext)
    const logout = () => {
     const valeur= window.confirm('Do you really want to log out?');
   if(valeur){
    localStorage.removeItem('user');
    window.location.reload();
   }
           
  
    }
    
    const setblack=()=>{
        if(!JSON.parse(localStorage.getItem('color'))||JSON.parse(localStorage.getItem('color'))==='white' ){
            localStorage.setItem('color', JSON.stringify('black'));
            window.location.reload();
        }
        else{
            localStorage.setItem('color', JSON.stringify('white'));
            window.location.reload();
        }
    }
    return(
    <div >
        <Link style={{ textDecoration: 'none',color:'black' }} to={`/?username=${user?.username}&id=${user?._id}`} >
        <span style={{display:'flex',gap:'10px',marginBottom:'10px'}}>

        <img style={{ borderRadius: '50%',width: '50px',height: '50px',objectFit: 'cover'}} src={user?.profilepicture?`/assets/${user?.profilepicture}`:'/assets/user.png'}  alt="PROFILE" /><p style={{marginTop:'15px',fontWeight:'bolder'}}>{user?.username}</p>
       </span>
</Link>
        <hr></hr>
        <Link  to={`/?username=${user?.username}&id=${user?._id}`} >
        <p style={{marginTop:'10px'}}>see your profile</p>
        </Link>
        <div className='myparams'>
    
            <div onClick={setblack}><p>set {JSON.parse(localStorage.getItem('color'))==='black'?'light':'dark'} mode</p><DarkModeSharpIcon /></div>
            <div onClick={toggleModalInfo}><p>Update Info</p><FeedbackSharpIcon /></div>
            
            <div onClick={logout}><p>Log out</p><LogoutIcon /></div>
        </div>
        
    </div>
)};
export default Modal