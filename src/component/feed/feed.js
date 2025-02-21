import React from "react"; // Required for JSX in React < 17
import Post from './post/post'
import './feed.css'
import Posted from './post/posted'
import { useContext,useEffect,useState } from 'react';
import {Usercontext} from '../contextapi/contextlogin';
import { useLocation} from 'react-router-dom';
import apiClient from '../../apiclient'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useMediaQuery } from 'react-responsive';
import {CircularProgress} from '@mui/material'
const Feed =() => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get('username'); 
    const id = queryParams.get('id');
    const video = queryParams.get('video');  
    
    const {user,isfetching,error}=useContext(Usercontext);
    const [updateduser,setupdateduser]=useState(user)
    const [posts, setPosts] = useState([]);
    const [guest,setguest]=useState({})
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const follow=async()=>{
      await apiClient.put(`users/follow/${user._id}`,{id:id,profilepicture:user.profilepicture,username:user.username})
      const newuser=await apiClient.get(`users/${user._id}`)
              setupdateduser(newuser.data)
        }
        const unfollow=async()=>{
          await apiClient.put(`users/unfollow/${user._id}`,{id:id})
          const newuser=await apiClient.get(`users/${user._id}`)
                  setupdateduser(newuser.data)
            }
    useEffect(() => {
      function getFileExtension(filename) {
        
        const parts = filename.split('.');
        return parts.length > 1 ? parts.pop() : '';
      }
      
        const fetchPosts = async () => {
            try {
                let response;
                let reponse
                if (id) {
                   response = await apiClient.get(`post/seepost/${id}`);
                }
             
                else {
                    response = await apiClient.get(`post/Timeline/${user._id}`);
                      if(response.data.length<10){
                        response = await apiClient.get('post/randomv');
                      }
                   
                } if(video){
                  
                  reponse=response.data.filter((a)=>{return a.postpicture.includes('mp4')})
                  if(reponse.length<10){
                    reponse = await apiClient.get('post/randomv');
                    reponse=reponse.data?.filter((a)=>{return a.postpicture.includes('mp4')})
                  }
                  setPosts(reponse.sort((p1,p2)=>{
                    return new Date(p2.createdAt)-new Date(p1.createdAt)
                  }));
                 }else{
                  setPosts(response.data.sort((p1,p2)=>{
                  return new Date(p2.createdAt)-new Date(p1.createdAt)
                })); // Assuming the response contains the posts data
                }
                
            } catch (error) {
                console.log('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [username, user.username, user._id,video]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const newuser=await apiClient.get(`users/${user._id}`);
          if(id){
             const uservisit=await apiClient.get(`users/${id}`);
          setguest(uservisit.data)
          }
         
          setupdateduser(newuser.data)
          
            
        } catch (error) {
          // Handle error
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchData(); // Call the function immediately when the component renders
  
      // Optionally, return a cleanup function if needed
      // return () => {
      //   // Cleanup code (if needed)
      // };
    }, [id]);
    return ( <div className="wrapperfeed">
      {isMobile && <> {id && <div className="descrie" style={{marginTop:'-50px',marginBottom:'10px'}}>
      <p>City: {user._id === id ? (user.city ? user.city : "--") : (guest.city ? guest.city : "--")}</p>
      <p>From: {user._id === id ? (user.from ? user.from : "--") : (guest.from ? guest.from : "--")}</p>
      <p>Went to: {user._id === id ? (user.school ? user.school : "--") : (guest.school ? guest.school : "--")}</p>
      <p>status: {user._id === id ? (user.relationship ? user.relationship : "--") : (guest.relationship ? guest.relationship : "--")}</p>

               
         </div>} 
      {user._id!==id && id && <div className="myfolandunfoli" style={{ display: "flex",
    justifyContent: "center", // Centers horizontally
    alignItems: "center", // Centers vertically
  
  }}>
    
      <div className="descrie" style={{display:'flex',gap:'10px'}}>
      {updateduser.followings.includes(id)?<button style={{display:'flex',gap:'2px'}} onClick={unfollow}>Unfollow <RemoveIcon /></button>:<button style={{display:'flex',gap:'2px'}} onClick={follow}>Follow <AddIcon /></button>}  
                <p>Followers:{guest.followers?.length}</p>
                <p>Followings:{guest.followings?.length}</p>
                </div>
      
            </div>} 
            {user._id===id && <div className="myfolandunfoli" style={{ display: "flex",
    justifyContent: "center", // Centers horizontally
    alignItems: "center", // Centers vertically
  
  }}>
    
      <div className="descrie" style={{display:'flex',gap:'10px'}}>
      
                <p>Followers:{updateduser.followers?.length}</p>
                <p>Followings:{updateduser.followings?.length}</p>
                </div>
      
            </div>}   
            { id &&    <hr style={{
 height: "3px",
 width: "95%",
 backgroundColor: "#b0b0b0", // Light gray
 border: "none", // Remove default border
 margin: "20px auto", // Center horizontally
 borderRadius: "5px" // Smooth edges
}}></hr>}</>} 

     {(username===user.username || username==null) && <Post />}
 {posts.length>0 ? posts.map(post => (
  <Posted key={post._id}  post={post} />
)):<div style={{postion:'relative',marginTop:'30px'}}><div style={{marginTop:'5%',fontWeight:'500',fontSize:'24px'}}>{id?'No post':<CircularProgress size="60px" style={{color:'#4db8ff',size:'2px'}}/>}</div></div>}   

    
    </div> );
}
 
export default Feed;