import React from 'react'
import RssFeedSharpIcon from '@mui/icons-material/RssFeedSharp';
import ChatSharpIcon from '@mui/icons-material/ChatSharp';
import PlayCircleSharpIcon from '@mui/icons-material/PlayCircleSharp';
import {Usercontext} from '../contextapi/contextlogin';
import apiClient from '../../apiclient'
import "./leftside.css"
import { Link } from "react-router-dom";
import {useContext,useState,useEffect} from 'react'
const Leftside = () => {
const {user}=useContext(Usercontext)
const [friend,setFriends]=useState([])
useEffect(()=>{
    const getfriend=async()=>{
       const res= await apiClient.get(`users/all/users`)
       const filterfriend=res.data.filter((a)=>{
        return a.city===user.city && a._id!==user._id
       })
       setFriends(filterfriend)
    
    }
    getfriend() 
},[])

    
        
    
    return (  <div className="wrapperLeftside">
        <div className="wrapperLeftsidex">
        <div  className="wrapperLeftsideup">
        <Link style={{textDecoration:'none',color:JSON.parse(localStorage.getItem('color'))==='black'?'white':'black'}} to='/' >
       <div className='mesevent'><div className="i"><RssFeedSharpIcon /> </div><div className="e">Feeds</div></div>   </Link>
       <Link style={{textDecoration:'none',color:JSON.parse(localStorage.getItem('color'))==='black'?'white':'black'}} to='/tchat' >
       <div className='mesevent'> <div className="i"><ChatSharpIcon /></div><div className="e">Tchats</div></div> </Link>
       <Link style={{textDecoration:'none',color:JSON.parse(localStorage.getItem('color'))==='black'?'white':'black'}} to='/?video=me' >
       <div className='mesevent'><div className="i"><PlayCircleSharpIcon /></div><div className="e">Videos</div> </div>
       </Link>



     
      <hr></hr>
      </div>
      <h1 style={{textAlign:'left'}}>Suggestions</h1>
      <br></br>
      <div className="wrapperLeftsidedown">
        {friend.length<1?'no suggested friends based on your info(eg:location,center of interest,...)':friend?.map((a)=>{

     return       <div ><Link className='amis' style={{textDecoration:'none',color:JSON.parse(localStorage.getItem('color'))==='black'?'white':'black'}} to={`/?username=${a.username}&id=${a._id}`}><img src={a.profilepicture?a.profilepicture:'/assets/user.png'} className='p2' /> <p >{a.username}</p></Link></div>
      
        })}
  
      </div>
      </div>
    </div>
    );
}
 
export default Leftside;