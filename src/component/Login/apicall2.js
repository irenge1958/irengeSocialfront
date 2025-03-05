
const apicall2= async (credentials,dispatch)=>{
console.log(credentials)
try {
    dispatch({type:'LOGIN_SUCCESS',payload:credentials})
    
    localStorage.setItem('user', JSON.stringify(credentials));
} catch (error) {
    dispatch({type:'LOGIN_FAILURE',payload:error.response.data})
    console.log(error)
}
} 
export default apicall2;