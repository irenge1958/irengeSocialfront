import React from "react"; // Required for JSX in React < 17
import './posted.css'
import CheckIcon from '@mui/icons-material/Check';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import { useState,useEffect } from 'react';
import {Usercontext} from '../../contextapi/contextlogin';
import {format} from 'timeago.js'
import apiClient from "../../../apiclient";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useContext,useRef,useMemo } from 'react';
import { Link } from "react-router-dom";
import SendSharpIcon from '@mui/icons-material/SendSharp';
import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';

const Posted = ({post}) => {
    const PF=process.env.REACT_APP_PUBLIC_FOLDER

    const [numbercom, setnumbercom] = useState(5);
    const [username,setUsername]=useState({})
    console.log(post)
const {user}=useContext(Usercontext)
    useEffect(() => {
        const myuser = async () => {
            try {
                const response = await apiClient.get(`users/${post.user_id}`);
                setUsername(response.data);
                
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
      myuser();
    }, []);
  
 const content=useRef()
 
    const commentore=[]
    const [usercomment,setUsercomment]=useState()            
   const [commentaire,setCommentaire]=useState([]);
   const mycomments = async (comments) => {
    try {
        
        const promises = comments.map(async (c) => {
            const res = await apiClient.get(`users/${c.id}`);
            return {...res.data,content:c.content}
        });
        const allComments = await Promise.all(promises);
       
        if (usercomment) {
            const commm = { ...user, content: usercomment };
            allComments.push(commm);
           
        }
      
        allComments.reverse();
          setnumbercom(numbercom+5)
        
          const firstresults = allComments.splice(0, numbercom);
        setCommentaire(firstresults);
      
    } catch (error) {
        // Handle errors
        console.error(error);
    }
};

const [commentairel,setCommentairel]=useState(post.comments.length);
    
const memoizedIfCondition = useMemo(() => {
    if (usercomment) {
        const commm = { ...user, content: usercomment };
        commentaire.push(commm);
        commentore.push(commm);
        setCommentairel(commentairel+1)
    }
    // Return any value you want to memoize
    return true; // For example, always returning true here
}, [usercomment]);
        const sendForm = document.getElementById('send');
 const com=async(comm,e)=>{
e.preventDefault()
const mybody={
    id:comm.idp,
    content:content.current.value
}
setUsercomment(content.current.value)
const res=await apiClient.put(`post/comment/${comm.ids}`,mybody)
sendForm.value = '';

 }


 const [likes,setLikes]=useState(post.likes.length)
 const [etat,setetat]=useState(post.likes.includes(user._id))
 const handlaime=async(myid)=>{
    
     if (!etat){
         await apiClient.put(`post/likes/${user._id}`,{id:myid})
          setLikes(likes+1)
         setetat(true)
     }
 else{
    
await apiClient.put(`post/dislikes/${user._id}`,{id:myid})
     setLikes(likes-1)
     setetat(false)
 }
 }

const color={
        fontWeight:"lighter",
        marginTop:'19px',
        marginLeft:'10px'
    }
    const deletepost=async(theid)=>{
        const valeur=window.confirm('are you sure yo want to delete this post')
        if(valeur){
           await apiClient.delete(`post/delete/${theid}`) 
           window.location.reload()
        }
        
    }
    function getFileExtension(filename) {
        
        const parts = filename.split('.');
        return parts.length > 1 ? parts.pop() : '';
      }

// Event listener for scroll events
window.addEventListener("scroll", function() {
    var videos = document.querySelectorAll(".myVideo");

    var window_height = window.innerHeight || document.documentElement.clientHeight;

    videos.forEach(function(video) {
        var rect = video.getBoundingClientRect();

        // Check if the video element is still in the document
        if (document.contains(video)) {
            // Pause the video if it's not in the viewport
            if (rect.bottom < 0 || rect.top > window_height) {
                video.pause();
            }
            // Otherwise, play the video
            else {
                video.play().catch(error => {
                    // Handle the error
                    console.error('Error attempting to play the video:', error);
                });
            }
        }
    });
});
const [mycpy,setmycpy]=useState('Copy link')
const [Op,setOp]=useState(false)
const couper=()=>{
    setTimeout(
        () => setOp(false), 
        3000
      );
}
const copyf=(lien)=>{
navigator.clipboard.writeText('localhost:3000/linkpost?mypost='+lien)
setmycpy('Copied')
couper()
} 
    return (
        <div className="post">
           
            <div className='mypostup12'> 
            <div className='mypostup1'>
         <Link style={{ textDecoration: 'none',color:JSON.parse(localStorage.getItem('color'))==='black'?'white':'black' }} to={`/?username=${username.username}&id=${username._id}`} >
            <span className='mypostup1'><img src={username.profilepicture?username?.profilepicture:'/assets/user.png'} alt="PROFILE" /> <p>{username.username}</p></span>
           </Link>
           <span style={color}>{format(post.createdAt)}</span>
           </div>
           <div className='myb32'><MoreVertSharpIcon className='myb321' onClick={()=>setOp(true)}/>{Op && <div style={{position:'absolute',marginLeft:'-59px',marginTop:'-7px'}}><div className='op' onClick={()=>copyf(post.link)} style={{border:'2px solid black',padding:'3px',textAlign: 'center',alignItems:'center' }}>{mycpy}</div>{post.user_id===user._id?<div className='op' onClick={()=>deletepost(post._id)} style={{border:'2px solid black',padding:'3px'}}>delete post</div>:''}</div>}</div>
           </div>
            <div className='myb3'>{post.Desc}</div>
            {post.Desc&&<br></br>}
            
           <div className='mypostmid' >{getFileExtension(post.postpicture)==='mp4'?<video className='myVideo'  width="100%" muted controls>
  <source src={PF+post.postpicture} type="video/mp4" />

  Your browser does not support the video tag.
</video>:<img src={post.postpicture} />} </div>
           <div style={{}}>
           <div className='mypostbot'  ><span className={!etat?'jxaime':'jaime'} onClick={() => handlaime(post._id)}
 >{!etat?<FavoriteBorderSharpIcon style={{cursor:'pointer'}} />:<FavoriteSharpIcon style={{cursor:'pointer'}}/>}</span> <p>{likes}</p> </div>
           <p className='comment' style={{cursor:'pointer'}} onClick={()=>mycomments(post.comments)}>{commentairel} comments</p>
           </div>
           <div><div style={{border:'0.01px solid gray'}}></div>
           {commentaire.length>0  && <p onClick={()=>mycomments(post.comments)} style={{cursor:'pointer',textAlign:'left',marginTop:'10px',marginBottom:'15px',marginLeft:'15px',color:'rgb(184, 182, 192)',width:'max-content'}}>{post.comments.length>commentaire.length?'See more comments':''}</p>}
            {commentaire.length>0 && commentaire.map((a)=>{
return <> 


       <Link style={{ textDecoration: 'none',color:'black' }} to={`/?username=${a.username}&id=${a._id}`} >
         <div className="" style={{textAlign:'left',margin:'7px'}} >
    <div className=""  >
        <div className="" style={{display:'flex',gap:'10px'}}>
    <img style={{width:'45px',height:'45px',borderRadius:'50%'}} src={a.profilepicture?`/assets/${a.profilepicture}`:'/assets/user.png'} />
    <div style={{backgroundColor:'rgb(238, 234, 234)',padding:'8px 12px',borderRadius:'11%',width: 'max-content'}} >
    <p style={{fontWeight:'bold'}}>{a.username}</p>
     <p>{a.content}</p>
     </div>
    </div>
    </div>
    </div></Link> </>
            }) }
             {commentaire.length===0 && usercomment && commentore.map((a)=>{
return <> 


       <Link style={{ textDecoration: 'none',color:'black' }} to={`/?username=${a.username}&id=${a._id}`} >
         <div className="" style={{textAlign:'left',margin:'7px'}} >
    <div className=""  >
        <div className="" style={{display:'flex',gap:'10px'}}>
    <img style={{width:'45px',height:'45px',borderRadius:'50%'}} src={a.profilepicture?`/assets/${a.profilepicture}`:'/assets/user.png'} />
    <div style={{backgroundColor:'rgb(238, 234, 234)',padding:'8px 12px',borderRadius:'11%',width: 'max-content'}} >
    <p style={{fontWeight:'bold'}}>{a.username}</p>
     <p>{a.content}</p>
     </div>
    </div>
    </div>
    </div></Link> </>
            }) } 
                <div className="mycom">
                <form className="mycomf" onSubmit={(e)=>com({ids:user._id,idp:post._id},e)}>
                   <input type="text" id='send' ref={content} placeholder="comment here" style={{fontSize:'15px'}} required/>  <button type='submit' style={{border:'none',background:'white'}}><SendSharpIcon  /> </button>
                </form></div>
                <div></div>
           </div>
        </div>
      );
}
 
export default Posted;