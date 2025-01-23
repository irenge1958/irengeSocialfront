import React from 'react'
import { useContext } from 'react';
import {Usercontext} from '../contextapi/contextlogin';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import './toobar.css' ;
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useEffect,useState } from 'react';
import {format} from 'timeago.js'
import axios from 'axios'
import CheckIcon from '@mui/icons-material/Check';
 const Modalnot=()=>{
    const setasread=async(id)=>{
    await axios.put(`post/notification/${id}`)
  
}

    const {user}=useContext(Usercontext)
    const [notifitio,setnotifitio]=useState([])
    const [all,setAll]=useState(false)
    const [myview,setMyview]=useState(false)
    useEffect(()=>{
        const fecth=async()=>{
         if(user.notifications.length){
             const res=await axios.get(`post/not/${user.notifications}`)
             const mynot=all?res.data.filter((a)=>{return a.read===false}):res.data
             
       setnotifitio(mynot.sort((p1,p2)=>{
        return new Date(p2.createdAt)-new Date(p1.createdAt)
       }))  
         }
      
        }
fecth()
    },[all])
   const All=(o)=>{
setAll(o)

   }
   const readAll=async()=>{
    setMyview(false)
    notifitio.map(async(a)=>{
        return await axios.put(`post/notification/${a._id}`)
    })
    
    
}
   const myall=all?{padding:'10px',cursor:'pointer'}:{backgroundColor:'gray',padding:'10px',userSelect:'none'}
   const unread=all?{backgroundColor:'gray',padding:'10px',userSelect:'none'}:{padding:'10px',cursor:'pointer'}
    const view=myview?{display:'block'}:{display:'none'}
   const mesnonvue={cursor:'pointer',display:'flex',gap:'10px',padding:'6px',marginTop:'7px',
    backgroundColor:'gray'}
   const mesnotall={cursor:'pointer',display:'flex',gap:'10px',padding:'6px',marginTop:'7px'}
   return(
    <div >

        <span style={{display:'flex',gap:'10px',justifyContent:'space-between'}}>
<h1 style={{marginTop:'10px',fontWeight:'bolder',fontSize:'24px'}}>Notifications</h1>

        <p className='THREEDOT' style={{marginTop:'15px',cursor:'pointer',flexDirection:'column'}} onClick={()=>setMyview(true)}><MoreHorizIcon /> <div onClick={readAll} style={{cursor:'pointer',backgroundColor:'antiquewhite',padding:'10px',gap:'10px',baseline:'1',display:'flex'}}><CheckIcon style={view} /><div style={view}>mark all as read</div> </div></p>
 
       </span>
<div style={{display:'flex',gap:'10px',marginTop:'10px'}}><p style={myall} onClick={()=>All(false)}>All</p><p style={unread} onClick={()=>All(true)}>Unread</p></div>
      <br></br>
       
        <div className='mynot'  style={{overflowY:'scroll',maxHeight:'400px'}}>
            {notifitio?.map((a)=>{
                return (
                  
                    <Link style={{ textDecoration: 'none',color:'black' }} to={a?.link} >
             
                <div style={a?.read?mesnotall:mesnonvue} onClick={()=>setasread(a._id)}> <img style={{width:'45px',height:'45px',borderRadius:'50%'}} src={a?.profilepicture?`/assets/${a.profilepicture}`:'/assets/user.png'} /><div style={{display:'flex',gap:'10px',paddingTop:'5px'}}><p style={{fontWeight:'bolder'}}>{a?.username}</p><span>{a?.message}</span><span>{format(a?.createdAt)}</span></div></div>   </Link>)
           
          })}
            <div style={{justifyContent:'center',textAlign:'center'}}>{notifitio.length===0 &&  '0 notification' }</div>
            
          <div/>
        </div>
    </div>
)};
export default Modalnot