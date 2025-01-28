import React from "react";
import './toobar.css' ;
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import PersonSharpIcon from '@mui/icons-material/PersonSharp';
import MessageSharpIcon from '@mui/icons-material/MessageSharp';
import NotificationsNoneSharpIcon from '@mui/icons-material/NotificationsNoneSharp';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Link } from "react-router-dom";
import notification  from './notification.mp3';
import useSound from "use-sound";
import HomeIcon from '@mui/icons-material/Home';
import { useContext } from 'react';
import {Usercontext} from '../contextapi/contextlogin';
import apiClient from '../../apiclient'
import { useState,useEffect } from "react";
import Modal from "./modal";
import Modalnot from "./modalnot";
import {useRef} from "react"
import Modalinfo from "./modalinfo";
 import { useMediaQuery } from 'react-responsive';
 import TimelineIcon from '@mui/icons-material/Timeline';
const Toolbar =({socket,arrivalmessage})=> {
   
    const isDesktop = useMediaQuery({ minWidth: 1224 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1224 });
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const nom=useRef();
    const {user,isfetching,error}=useContext(Usercontext);
    const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);

    const toggleModalInfo = () => {
        setIsModalInfoOpen(!isModalInfoOpen);
    };   
    const [results, setResults] = useState([]);
    const [lengths, setLength] = useState();
    const [found,SetFound]=useState(false)
    const dosearch=async(e)=>{
     e.preventDefault()
        const q=nom.current.value
    
        if(q){
            const myfriends=await apiClient.get(`users/searchs/${q}`)
            if(myfriends.data.length!==0){
             setResults(myfriends.data)     
             alert(false)
            }
  else{
    SetFound(true)
 
  }
    
    window.addEventListener('click', () => {
        setResults([])
        setparam(false)
    });
        }
    else{
       setResults([])
    }
    }
const search=async(q)=>{
    SetFound(false)
    if(q){
        
        const myfriends=await apiClient.get(`users/search/${q}`)
setResults(myfriends.data)
window.addEventListener('click', () => {
    setResults([])
    setparam(false)
});
    }
else{
   setResults([])
}

}
const result= results.filter((a)=>{
    return a._id!==user._id
})


const firstresults = result.splice(0, 5);
const [param2,setparam2]=useState(false)
const [param,setparam]=useState(false)
const [nb,setNb]=useState(0)


const params=()=>{
    setparam(true)
}
const params2=()=>{
    setparam2(true)
}
useEffect(() => {
    const handleClickOutside = (event) => {
        if (param && event.target.id !== 'modal') {
            
            setparam(false);
        }
        if (param2 && !event.target.closest('#modal1')) {
            setparam2(false);
        }
    };

    window.addEventListener('click', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
        window.removeEventListener('click', handleClickOutside);
    };
}, [param, param2]);
useEffect(()=>{
    const fecth=async()=>{
     if (user?.notifications.length>0){const res=await apiClient.get(`post/not/${user?.notifications}`)
     const mynot=res.data?.filter((a)=>{return a?.read===false})
     setLength(mynot.length)}
         
 
     
  
    }
fecth()
},[])
if (found){
    window.addEventListener('click',()=>{
SetFound(false)
    })
   
}
useEffect(()=>{
    const message = [];
    const getit = async () => {
        try {
            const res = await apiClient.get(`tchat/messagefromconvs/${user._id}`);
            const promises = res.data.map(async (x) => {
                const res1 = await apiClient.get(`tchat/message/${x._id}`);
                const unreadMessages = res1.data.filter((msg) => msg.read === 'false' || msg.read === '');
                return unreadMessages;
            });
    
            // Wait for all promises to resolve
            const allUnreadMessages = await Promise.all(promises);
    
            // Flatten the array of arrays
            const flattenedUnreadMessages = allUnreadMessages.flat();
    
            // Use push to add the elements to the message array
            flattenedUnreadMessages.forEach((msgs) => {
                message.push(msgs);
            });
    
            setNb(message.length);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    
    
    getit()
},[])
useEffect(()=>{socket.current.on('theinstantmess',({senderid,text,maconv})=>{
    setNb((prevNb) => prevNb + 1)
console.log({senderid,text,maconv})
  }) },[socket,arrivalmessage])

    return (
        <div className="toolbar" style={isMobile?{height:'107px'}:{}}>
           <div className="toolbarwrapper" style={isMobile?{display:'block'}:{}}>
          {!isMobile && <div className="logo1">
            Irengesocial
            </div>}  
            <div className="search"  style={isMobile?{width:'100%'}:{}}>
             
            <div className="searchx" style={isMobile?{width:'240px',marginLeft:'120px'}:{}}>
  
               <div style={{display:'flex'}}> {isMobile && <div style={{fontSize:'16px',position:'absolute',marginLeft:'-115px',marginTop:'10px'}}><p style={{fontWeight:'bolder',fontFamily:'Georgia, Times New Roman, Times, serif',color:'white'}}>Irengesocial</p></div>}<form  className="form" onSubmit={dosearch}>
                    <span><SearchSharpIcon onClick={dosearch} /></span><input style={isMobile?{width:'195px'}:{}} type="text" id="me" ref={nom} onChange={(e) => search(e.target.value)} placeholder="search for friend and post here" />
                </form>
             {isMobile &&  <img id='modal'  className="photopro" style={{marginLeft:'23px'}} src={user?.profilepicture?user?.profilepicture:'/assets/user.png'} alt="image" onClick={params} />}  
                </div>
                   
                   {firstresults.length>0 && found===false  && firstresults.map((a)=>{
                   return<>
                    <div style={{border:'0.01px solid gray'}}></div>
                     <Link style={{ textDecoration: 'none',color:'black' }} to={`/?username=${a.username}&id=${a._id}`} >
                     <div className="searchpp" >
                <div className="searched">
                  <div className="searcheduser">
                <img src={a.profilepicture?a.profilepicture:'/assets/user.png'} />
                <div style={{position:'relative',top:'6.5px'}}>
                <p style={{fontWeight:'bold'}}>{a.username}</p>
                 <p>{user.followings.includes(a._id) && user.followers.includes(a._id)?'Friend':'Not Friend'}</p></div>
                </div>
                </div>
                </div></Link> </>})
                   }
              {
                 found &&  <> <div style={{border:'0.01px solid gray'}}></div>
                   
                    <div className="searchpp" >
               <div className="searched">
                 <div style={{ 
   
      paddingTop: '6px',
  paddingBottom: '10px'}} >
         
               <div style={{position:'relative',top:'6.5px',alignItems:'center',textAlign:'center'}}>
               <p style={{fontWeight:'bold'}}>{nom.current.value} Not Found</p>
               </div>
               </div>
               </div>
               </div></>
                } 
               
               </div>
          
            </div>
            {isMobile && <br></br>}
            <div className="other" >
                <div  className={isMobile?"":"homepagelink"} >
                <Link style={{ textDecoration: 'none',color:'white' }} to={`/?username=${user?.username}&id=${user?._id}`} >
                   {isMobile?<HomeIcon style={{fontSize:isMobile && '35px' }} />:'Homepage' }
                    </Link>
                </div>
                <div className={isMobile?"":"timelinelink"}>
                    <Link to='/' style={{ textDecoration: 'none',color:'white',}}>
                    {isMobile?<TimelineIcon style={{fontSize:isMobile && '35px' }} />:'Timeline' }
               
                     </Link>
                </div>
{         isMobile && <div >
                    <Link to='/?video=me' style={{ textDecoration: 'none',color:'white' }}>
                   <OndemandVideoIcon style={{fontSize:'35px'}} />
                     </Link>
                </div>}
               
                <div className={isMobile?"":"notification"} style={isMobile?{display:'flex',gap:'50px'}:{}}>
                    <Link to='/tchat' style={{ textDecoration: 'none',color:'white' }}>
                    <div className="iconot"  >
                     <div className="usericon"><MessageSharpIcon style={{fontSize:'35px'}}/></div>    
                   {nb!==0 && <div className="userbadge">{nb}</div>}       
                    </div></Link>
                    <div id='modal1' className="iconot" onClick={params2} >
                     <div className="usericon"><NotificationsNoneSharpIcon style={{fontSize:'35px'}} /></div>    
                     {lengths?<div className="userbadge">{lengths}</div>:''}     
                    </div>
                </div>
             
              {!isMobile && <img id='modal'  className="photopro" src={user?.profilepicture?user?.profilepicture:'/assets/user.png'} alt="image" onClick={params} />}  
              
            </div> 
           </div>
   {param && <div id='modal' className='modal' style={{position:'absolute',width:'360px',height:'auto',right:'0px'}}><Modal toggleModalInfo={toggleModalInfo} /></div>}   
  {param2 && <div  className='modal' id="modal1" style={{position:'absolute',width:'360px',height:'auto',right:'0px'}}><Modalnot/></div>} 

            {isModalInfoOpen && <Modalinfo toggleModalInfo={toggleModalInfo}  />}
        </div>   
      );
}
 
export default Toolbar;