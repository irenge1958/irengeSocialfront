import React, { useEffect } from "react"; // Required for JSX in React < 17
import './post.css'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../../firebase';
import PermMediaSharpIcon from '@mui/icons-material/PermMediaSharp';
import LabelSharpIcon from '@mui/icons-material/LabelSharp';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import EmojiEmotionsSharpIcon from '@mui/icons-material/EmojiEmotionsSharp';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import { useState,useRef } from 'react';
import {Usercontext} from '../../contextapi/contextlogin';
import { useContext } from 'react';
import apiClient from "../../../apiclient";
import EmojiPickerComponent from './EmojiPickerComponent'
   import { useMediaQuery } from 'react-responsive';
   import CircularProgressBar from './progress'
const Post = () => {
 
    const [myprogress,setmyprogress]=useState(0)
        const isDesktop = useMediaQuery({ minWidth: 1224 });
        const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1224 });
        const isMobile = useMediaQuery({ maxWidth: 767 });
    const{user}=useContext(Usercontext)
    const [myfile,SetMyfile]=useState(null)
    const desc=useRef('')
    const [mydesc,setMydesc]=useState(desc.current.value)
    const handleSelectEmoji = (selectedEmoji) => {
        console.log(selectedEmoji)
        if(desc.current.value!==''){
            setMydesc((prevContent) => prevContent + selectedEmoji);
        }
        else{
            setMydesc(selectedEmoji)
        }
       
      }; 
const [newPost,setNewPost]=useState({})
    const handlepost=async(e)=>{
        e.preventDefault()
        setNewPost({
            desc:mydesc,
            user_id:user._id,
            profilepicture:user.profilepicture,
            username:user.username
        })
        
if(myfile){
   


        const uploadFile = (file) => {
        
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setmyprogress(progress)
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                      
                        setNewPost((prev) => ({ ...prev, postpicture: downloadURL }));
                    });
                }
            );
        };
        uploadFile(myfile)
       
        
}

    }
    useEffect(()=>{
        const fetch=async()=>{
            try { 
        await apiClient.post('post/createpost',newPost)
        window.location.reload()  
    
    } catch (err) {
    // Handle error
    console.log('Error uploading file:', err.response.data);
    } 
        }
        if(newPost.postpicture){
           fetch() 
        }
    
    },[newPost.postpicture])
    const red={
color:'crimson'
    }
    const blue={
        color:'blue'
    }
    const green={
        color:'rgb(0, 230, 122)'
    }
    const yellow={
        color:'yellow'
    }
    const share={
        backgroundColor:'rgb(0, 230, 122)',
      innerHeight:'80px',
      borderRadius:'10%',
      marginTop:'-7px',
      cursor:"pointer"
    }
    const view={
        display:'none'
    }
    function getFileExtension(filename) {
        
        const parts = filename.name.split('.');
        return parts.length > 1 ? parts.pop() : '';
      }
      const handleChange = (e) => {
        setMydesc(e.target.value); // Update the state on input change
      };
    return (
        <div>
             {myprogress!==0 && <div style={{ position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark background with transparency
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,  }}>
      <CircularProgressBar progress={myprogress} />
    </div>}
{ !isMobile && <div className='post1'>
            
            <form onSubmit={handlepost}>
            <div className='mypostup'>
            <img src={user.profilepicture?user.profilepicture:'/assets/user.png'} alt="PROFILE" />
            <input value={mydesc} placeholder='what is in your mind?' ref={desc} onChange={handleChange}/>
            </div>
            <hr></hr>
            {myfile && <div className='mypostmidx' >{getFileExtension(myfile)==='mp4'?<video width="600" controls>
  <source src={URL.createObjectURL(myfile)} type="video/mp4" />

  Your browser does not support the video tag.
</video>:<img src={URL.createObjectURL(myfile)} />} <HighlightOffSharpIcon style={{color:'red'}} className='closepost' onClick={()=>SetMyfile(null)} /> </div>}
           {!isMobile &&  <div className='mypostdown1'>
            <div className='mypostdown'>
          <label htmlFor='file1'><div className='mediapost'><span style={red}><PermMediaSharpIcon /></span> <p>Photo et video</p>   <input type='file'  id='file1' accept='.png,.jpeg,.jpg,.mp4' style={view} onChange={(e)=>SetMyfile(e.target.files[0])} /></div></label> 
          
           </div >
           <EmojiPickerComponent style={{ position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,  }} onSelectEmoji={handleSelectEmoji} />
            <button style={share}>share</button></div>}
            </form>
        </div>}
        {isMobile &&         <div >
            
            <form onSubmit={handlepost}>
               <div className='mypostup' style={{marginTop:'10px'}}>  
            <img src={user.profilepicture?user.profilepicture:'/assets/user.png'} alt="PROFILE" />
            <div className='post2' style={{marginLeft:'-5px'}} >
            <input style={{margin:'7px'}} placeholder='what is in your mind?' ref={desc} onChange={handleChange}/>
            </div>
            {!myfile?<label htmlFor='file1' style={{marginTop:'20px',marginLeft:'10px'}}><div className='mediapost'><span style={{position:'absolute',color:'red',marginLeft:'-40px'}}><PermMediaSharpIcon /></span> <input type='file' id='file1' accept='.png,.jpeg,.jpg,.mp4' style={view} onChange={(e)=>SetMyfile(e.target.files[0])} /></div></label>:<div style={{marginTop:'18px',marginLeft:'10px'}}><button  style={{position:'absolute',marginLeft:'-39px', backgroundColor:'rgb(0, 230, 122)',innerHeight:'80px',borderRadius:'38px',cursor:"pointer",padding:'5px',border:'none'}} onClick={handlepost}>Post</button></div>} 

   </div>
            {myfile && <div className='mypostmidx' >{getFileExtension(myfile)==='mp4'?<video width="600" controls>
  <source src={URL.createObjectURL(myfile)} type="video/mp4" />

  Your browser does not support the video tag.
</video>:<img src={URL.createObjectURL(myfile)} />} <HighlightOffSharpIcon style={{color:'red'}} className='closepost' onClick={()=>SetMyfile(null)} /> </div>}
           {!isMobile &&  <div className='mypostdown1'>
            <div className='mypostdown'>
          <label htmlFor='file1'><div className='mediapost'><span style={red}><PermMediaSharpIcon /></span> <p>Photo et video</p>   <input type='file' id='file1' accept='.png,.jpeg,.jpg,.mp4' style={view} onChange={(e)=>SetMyfile(e.target.files[0])} /></div></label> 
           </div > <button style={share}>share</button></div>}
            </form>
        </div>}
        </div>
      );
}
 
export default Post;