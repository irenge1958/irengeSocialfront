import React from "react"; // Required for JSX in React < 17
import { createContext,useReducer } from "react";
import actioncontxt from './actioncontxt'

const initialuser={
    user:JSON.parse(localStorage.getItem('user')),
    isfetching:false,
    error:false,
}

export const Usercontext=createContext(initialuser);
export const Contextprovider=({children})=>{
const [state,dispatch]=useReducer(actioncontxt,initialuser);
return(
<Usercontext.Provider
    value={{
       user:state.user,
       isfetching:state.isfetching,
       error:state.error,
       dispatch
    }}
    >
   {children}
   </Usercontext.Provider>
   )
 }