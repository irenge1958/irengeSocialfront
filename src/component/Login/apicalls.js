import axios from 'axios';
const apicall= async (credentials,dispatch)=>{
dispatch({type:'LOGIN_START'})
try {
    
    const res=await axios.post('Auth/login',credentials)
  
    dispatch({type:'LOGIN_SUCCESS',payload:res.data})
    
    localStorage.setItem('user', JSON.stringify(res.data));
} catch (error) {
    dispatch({type:'LOGIN_FAILURE',payload:error.response.data})
    console.log(error)
}
} 
export default apicall;