import React from 'react'
import { useContext,useRef } from 'react';
import {Usercontext} from '../contextapi/contextlogin';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import './modalinfo.css'
import apiClient from '../../apiclient'
 const Modalinfo=({toggleModalInfo})=>{
    const {user}=useContext(Usercontext)
   const password=useRef()
   const state=useRef()
   const city=useRef()
   const username=useRef()
   const school=useRef()
   const handleupdate=async(e)=>{
    e.preventDefault()
   
    if(state.current.value){
      await apiClient.put(`users/updateinfo/${user._id}`,{relationship:state.current.value})
     
    }
    if(password.current.value){
      await apiClient.put(`users/updateinfo/${user._id}`,{password:password.current.value})
    }
    if(city.current.value){
      await apiClient.put(`users/updateinfo/${user._id}`,{city:city.current.value,ati:'city'})
    }
    if(username.current.value){
      await apiClient.put(`users/updateinfo/${user._id}`,{username:username.current.value})
    }
    if(school.current.value){
      await apiClient.put(`users/updateinfo/${user._id}`,{school:school.current.value})
    }
    const res=await apiClient.get(`users/${user._id}`)
    localStorage.setItem('user', JSON.stringify(res.data));
    window.location.reload()
   }
   
    return(
    <div  >
      <div class="form-container">
        <div style={{backgroundColor:'#f0f0f0',width:'600px',padding:'10px'}}>
          <div style={{display:'flex',justifyContent:'space-between'}}><h1>Update Info</h1><span style={{cursor:'pointer'}} onClick={toggleModalInfo}><HighlightOffSharpIcon /></span></div>
          <br></br>
        <form class="styled-form" onSubmit={(e)=>handleupdate(e)}>
            <div class="form-group">
                <label for="username" class="form-label">Username:</label>
                <input ref={username} type="text" id="username" class="form-input" placeholder="Enter your new username" />
            </div>
            <div class="form-group">
                <label for="relationship" class="form-label">marital state:</label>
                <input ref={state} type="text" id="relationship" class="form-input" placeholder="Maried/single" />
            </div>
            <div class="form-group">
                <label for="city" class="form-label">City:</label>
                <input ref={city} type="text" id="city" class="form-input" placeholder="you leave in" />
            </div>
            <div class="form-group">
                <label for="password" class="form-label">Password:</label>
                <input ref={password} type="password" id="password" class="form-input" placeholder="New password" />
            </div>
            <div class="form-group">
                <label for="school" class="form-label">School:</label>
                <input ref={school} type="text" id="school" class="form-input" placeholder="you went to which school" />
            </div>
            <div class="form-group">
                <button type="submit" class="form-button">Submit</button>
            </div>
        </form>
    </div></div>
    </div>
)};
export default Modalinfo