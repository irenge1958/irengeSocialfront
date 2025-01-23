import React from "react";
   import { useState,useEffect } from "react"
   import axios from 'axios'
   import { Link } from "react-router-dom";
 
   
   export const Image=({a})=>{
   
    const [b,sb]=useState({})

    const followings=async()=>{
        const res= await axios.get(`users/${a}`)
        sb(res.data)
       }
  useEffect(()=>{
followings()
  },[a])

       return(
        <Link style={{ textDecoration: 'none',color:'black' }} to={`/?username=${b.username}&id=${b._id}`} >
   <img src={b.profilepicture?b.profilepicture:'/assets/user.png'} alt={b.username} />
</Link>
  
       ) };
     
      