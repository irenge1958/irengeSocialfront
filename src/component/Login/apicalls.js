import axios from 'axios';
import apiClient from '../../apiclient'
const apicall= async (credentials,dispatch)=>{
dispatch({type:'LOGIN_START'})
try {
    
    const res=await apiClient.post('Auth/login',credentials)
  
    dispatch({type:'LOGIN_SUCCESS',payload:res.data})
    
    localStorage.setItem('user', JSON.stringify(res.data));
} catch (error) {
    dispatch({type:'LOGIN_FAILURE',payload:error.response.data})
    console.log(error)
}
} 
export default apicall;