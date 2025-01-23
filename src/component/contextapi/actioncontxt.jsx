const actioncontxt =(state,action)=>{
switch (action.type) {
    case 'LOGIN_START':
        return{
            user:null,
            isfetching:true,
            error:false
        }
        break;
        case 'LOGIN_SUCCESS':
            return{
                user:action.payload ,
                isfetching:false,
                error:false
            }
            break;
            case 'LOGIN_FAILURE':
                return{
                    user:null,
                    isfetching:false,
                    error:action.payload                }
                break;
            
    default:
        return state;
        break;
}
}
export default actioncontxt;