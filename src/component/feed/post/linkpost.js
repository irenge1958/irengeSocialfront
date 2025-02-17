import React from "react"; // Required for JSX in React < 17
import './linkpost.css'
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import { useState,useEffect } from 'react';
import {Usercontext} from '../../contextapi/contextlogin';
import {format} from 'timeago.js'
import apiClient from "../../../apiclient";
import {useLocation} from 'react-router-dom';
import { useContext,useRef,useMemo } from 'react';
import { Link } from "react-router-dom";
import SendSharpIcon from '@mui/icons-material/SendSharp';
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
import Commentlink from './comment';
const Linkpost = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const posti = JSON.parse(queryParams.get('mypost'));
    console.log(typeof posti)
    console.log(posti)

  const [post,setPost]=useState({})
   useEffect( ()=>{
    const fetch=async()=>{
      const res=await apiClient.get(`post/mypost/${posti._id}`) 
   console.log(res.data)
setPost(res.data)
    }
    
fetch()
   },[])
   function getFileExtension(filename) {
        if(filename){
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop() : '';}
  }

    return (
               <div className='myallxx'>
               {!post?<div style={{textAlign:'center',alignItems:'center'}}>This post is no longer available</div>:

   <div className='photo'><div className='mypostmidxx' >{getFileExtension(post.postpicture)==='mp4'?<video className='myVideo'  width="100%" muted controls>
  <source src={post.postpicture} type="video/mp4" />

  Your browser does not support the video tag.
</video>:<img src={post.postpicture} /> }</div>
          
             </div> }
            <div className='autre'>
              {post._id && <Commentlink post={post}/>}  
            </div>
        </div>
      );
}
 
export default Linkpost;

