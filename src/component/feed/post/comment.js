import React from "react"; // Required for JSX in React < 17
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import { useState,useEffect } from 'react';
import {Usercontext} from '../../contextapi/contextlogin';
import {format} from 'timeago.js'
import axios from 'axios'
import { useContext,useRef,useMemo } from 'react';
import { Link } from "react-router-dom";
import SendSharpIcon from '@mui/icons-material/SendSharp';
// import ExpandCircleDownRoundedIcon from '@mui/icons-material/ExpandCircleDownRounded';
const Commentlink = ({post}) => {
    const [numbercom, setnumbercom] = useState(5);
    const [username,setUsername]=useState({})
const {user}=useContext(Usercontext)
    useEffect(() => {
        const myuser = async () => {
            try {
                const response = await axios.get(`users/${post.user_id}`);
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
   useEffect(()=>{
    const mycomments = async (comments) => {
        try {
            
            const promises = comments.map(async (c) => {
                const res = await axios.get(`users/${c.id}`);
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
    mycomments(post.comments)
   },[])
   const mycomments = async (comments) => {
    try {
        
        const promises = comments.map(async (c) => {
            const res = await axios.get(`users/${c.id}`);
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
        if(firstresults){
            document.getElementById("scrollvalue").scrollTop += 310;
        }
       

    } catch (error) {
        // Handle errors
        console.error(error);
    }
};

const [commentairel,setCommentairel]=useState(post.comments.length);
    
 useEffect(() => {
    if(commentaire.length>5){
        document.getElementById("scrollvalue").scrollTop += 310;
    }
   
    // Return any value you want to memoize

}, [commentaire]);
const memoizedIfConditions = useMemo(() => {
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
const res=await axios.put(`post/comment/${comm.ids}`,mybody)
sendForm.value = '';

 }

 const [likes,setLikes]=useState(post.likes.length)
 const [etat,setetat]=useState(post.likes.includes(user._id))
 const handlaime=async(myid)=>{
    
     if (!etat){
         await axios.put(`post/likes/${user._id}`,{id:myid})
          setLikes(likes+1)
         setetat(true)
     }
 else{
    
await axios.put(`post/dislikes/${user._id}`,{id:myid})
     setLikes(likes-1)
     setetat(false)
 }
 }
const color={
        fontWeight:"lighter",
        marginTop:'19px',
        marginLeft:'10px'
    }
    return (<>
        <div className='mypostup12'>
        <div className='mypostup1'>
     <Link style={{ textDecoration: 'none',color:'black' }} to={`/?username=${username.username}&id=${username._id}`} >
        <span className='mypostup1'><img src={username.profilepicture?username.profilepicture:'/assets/user.png'} alt="PROFILE" /> <p>{username.username}</p></span>
       </Link>
       <span style={color}>{format(post.createdAt)}</span>
       </div>
       <div className='myb32'><MoreVertSharpIcon /></div>
       </div>
       <div className='myb3'>{post.Desc}</div>
       <br></br>
        
       
       <div style={{}}>
       <div className='mypostbot'  ><span className={!etat?'jxaime':'jaime'} onClick={() => handlaime(post._id)}
>{!etat?<FavoriteBorderSharpIcon style={{cursor:'pointer'}} />:<FavoriteSharpIcon style={{cursor:'pointer'}}/>}</span> <p>{likes}</p> </div>
       <p className='comment' style={{cursor:'pointer'}} onClick={()=>mycomments(post.comments)}>{commentairel} comments</p>
       </div>
       <div><div style={{border:'0.01px solid gray'}}></div>
       {commentaire.length>0  && commentaire.length!==post.comments.length  ?<p onClick={()=>mycomments(post.comments)} style={{cursor:'pointer',textAlign:'left',marginTop:'10px',marginBottom:'15px',marginLeft:'15px',color:'rgb(184, 182, 192)',width:'max-content'}}>{post.comments.length>5 || commentaire.length>5?'See more comments':''}</p>:<div style={{marginBottom:'15px'}}></div>}
        {commentaire.length>0 && <div className="" id='scrollvalue' style={{textAlign:'left',height:'310px',overflowY:'scroll'}} > {commentaire.map((a)=>{
return <> 

   <Link style={{ textDecoration: 'none',color:'black' }} to={`/?username=${a.username}&id=${a._id}`} >
     
<div className=""  >
    <div className="" style={{display:'flex',gap:'10px',margin:'7px'}}>
<img style={{width:'45px',height:'45px',borderRadius:'50%'}} src={a.profilepicture?a.profilepicture:'/assets/user.png'} />
<div style={{backgroundColor:'rgb(238, 234, 234)',padding:'8px 12px',borderRadius:'11%',width: 'max-content'}} >
<p style={{fontWeight:'bold'}}>{a.username}</p>
 <p>{a.content}</p>
 </div>
</div>
</div>
</Link> </>
        })}</div> }
        {/* {commentaire.length>0  &&<div onClick={()=>mycomments(post.comments)} style={{ textAlign: 'center',alignItems:'center' ,cursor:'pointer'}}>
        <ExpandCircleDownRoundedIcon />
    </div>}  */}
         {commentaire.length===0 && usercomment && commentore.map((a)=>{
return <> 

   <Link style={{ textDecoration: 'none',color:'black' }} to={`/?username=${a.username}&id=${a._id}`} >
     <div className="" style={{textAlign:'left',margin:'7px'}} >
<div className=""  >
    <div className="" style={{display:'flex',gap:'10px'}}>
<img style={{width:'45px',height:'45px',borderRadius:'50%'}} src={a.profilepicture?a.profilepicture:'/assets/user.png'} />
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
       </>
    );
}

export default Commentlink;

