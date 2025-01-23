import React from 'react'
import './message.css'
import { useContext,useState,useEffect,useRef } from 'react';
import {Usercontext} from '../contextapi/contextlogin';
import axios from 'axios'
import {format} from 'timeago.js'

import { useMediaQuery } from 'react-responsive';
const  Message=({own,a,currenttchat})=>{
    const isDesktop = useMediaQuery({ minWidth: 1224 });
     const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1224 });
     const isMobile = useMediaQuery({ maxWidth: 767 });
    const{user}=useContext(Usercontext)
    const [b,setB]=useState({})
const myuser=currenttchat.members?.find((s)=>s!==user?._id )
useEffect(()=>{
    const fecth=async()=>{
     const res=await axios.get(`users/${myuser}`)
     setB(res.data)   
    }
fecth()
},[])
    const color=own?{
        backgroundColor:'#1877f2'
    }:{backgroundColor:'rgb(245,241,241)',color:'black'}
    const margin=own?{marginLeft:'10px'}:{display:'flex', justifyContent: 'flex-end'}
return(
    <div className="mymessages">
       
<div className="mytexte" style={margin}>
 <img src={own?user.profilepicture?`/assets/${user?.profilepicture}`:'/assets/user.png':b.profilepicture?`/assets/${b.profilepicture}`:'/assets/user.png'} style={{
     position: 'relative',
     width:'40px',
     height:'40px',
     borderRadius: '50%',
 objectFit: 'cover',
  marginTop: '8px'}} alt="" />
   <div  className='myboxtimeandmessage'>
    <div style={color} className='messagebox'>
    {a.messagee}
    </div>
   <div>{format(a.createdAt)}</div>
    </div> 
</div>
<div></div>
    </div>
)
}
export default Message;