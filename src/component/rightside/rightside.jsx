import React from 'react'
import './rightside.css'
import {Usercontext} from '../contextapi/contextlogin';
import { useLocation} from 'react-router-dom';
import axios from 'axios';
import { useState,useEffect } from 'react';
import { useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link } from "react-router-dom";
import {Image} from './img'
const Rightside = ({onlinefriend}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id'); 
  const{user}=useContext(Usercontext);
  const [updateduser,setupdateduser]=useState(user)
  const [guest,setguest]=useState({})

  console.log(onlinefriend)
  const follow=async()=>{
await axios.put(`users/follow/${user._id}`,{id:id,profilepicture:user.profilepicture,username:user.username})
const newuser=await axios.get(`users/${user._id}`)
        setupdateduser(newuser.data)
  }
  const unfollow=async()=>{
    await axios.put(`users/unfollow/${user._id}`,{id:id})
    const newuser=await axios.get(`users/${user._id}`)
            setupdateduser(newuser.data)
      }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newuser=await axios.get(`users/${user._id}`)
        const uservisit=await axios.get(`users/${id}`)
        setguest(uservisit.data)
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
 
   



    return (<div className="wrapperRightside">
      {id?<div>
       <div className="wrapofbutanddesc" style={{alignItems:'left',textAlign:'left',marginTop:'16px'}}>
        {user._id!==id && <div className="myfolandunfol" style={{marginBottom:'12px'}}>
              {updateduser.followings.includes(id)?<button style={{display:'flex',gap:'2px'}} onClick={unfollow}>Unfollow <RemoveIcon /></button>:<button style={{display:'flex',gap:'2px'}} onClick={follow}>Follow <AddIcon /></button>}  
            </div>}     
            <div className="descri">
                <h1 >User information</h1>
                <p>City:{user.city?user.city:'--'}</p>
                <p>From:{user.from?user.from:'--'}</p>
                <p>Went to:{user.school?user.school:'--'}</p>
                <p>relationship:{user.relationship?user.relationship:'--'}</p>
                <p>N of followers:{id?guest.followers?.length:updateduser.followers?.length}</p>
                <p>N of followings:{id?guest.followings?.length:updateduser.followings?.length}</p>
            </div>
        </div>
      </div> : <div>  <div className="rigthsideup">
        <img src="/assets/hbd.png" alt='gift' />
       <p> <strong>shrum</strong>  and  <strong>4 other friends</strong>  have the birthday today </p>
       </div>
       <div className="rightsideup1">  <img src="/assets/adv.jpg" alt='advertising' /></div> </div>} 
       <br></br>
<div className="rightsidebot">
    <h2>{id?'Followings':'Online friends'}</h2>
    <br></br>
    {!id?<>{onlinefriend.map((x)=>{
   return <Link style={{ textDecoration: 'none',color:'black',cursor:'pointer' }} to={`/?username=${x.user.username}&id=${x.user._id}`} >   <div> 
      <img src={x?.user.profilepicture?x?.user.profilepicture:'/assets/user.png'} alt="onlineami" style={{
     position: 'relative',
     width:'55px',
     height:'50px',
     borderRadius: '50%',
 objectFit: 'cover',
  marginTop: '2px',cursor: 'pointer'
}}  /> <span className="onlinbage"></span> <p>{x?.user.username}</p>

    </div> </Link>
    })}
   </>:<>{guest.followings?.length===0 ?<div>0 followings</div>:<div class="image-grid">{guest.followings?.map((a)=>{
        return <div>
        
            <Image a={a} index={a._id} />
      
        </div>})}
       
    </div>
    }</>
}
</div>
    </div>
    
    );
}
 
export default Rightside;