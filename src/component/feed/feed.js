import React from "react"; // Required for JSX in React < 17
import Post from './post/post'
import Posted from './post/posted'
import { useContext,useEffect,useState } from 'react';
import {Usercontext} from '../contextapi/contextlogin';
import { useLocation} from 'react-router-dom';
import axios from 'axios';

const Feed =() => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const username = queryParams.get('username'); 
    const id = queryParams.get('id');
    const video = queryParams.get('video');  
    const {user,isfetching,error}=useContext(Usercontext);
    const [posts, setPosts] = useState([]);
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
                   response = await axios.get(`post/seepost/${id}`, {
                    headers: {
                      'Cache-Control': 'no-cache' // Disable caching
                    }
                  });;
                }
             
                else {
                    response = await axios.get(`post/Timeline/${user._id}`, {
                        headers: {
                          'Cache-Control': 'no-cache' // Disable caching
                        }
                      });
                } if(video){
              
                  reponse=response.data.filter((a)=>{return getFileExtension(a.postpicture)==='mp4'})
                 
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

    return ( <div className="wrapperfeed">
     {(username===user.username || username==null) && <Post />}
 {posts.length>0 ? posts.map(post => (
  <Posted key={post._id} post={post} />
)):<div style={{postion:'relative',marginTop:'30px'}}><div style={{marginTop:'15%',fontWeight:'500',fontSize:'24px'}}>No post</div></div>}   

    
    </div> );
}
 
export default Feed;