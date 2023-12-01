export const initialState={
    isConnected:false,
    account:"",
    instance:"",
    isadmin:false,
    flag:false
}

export const reducer=(state,action)=>{
    if(action.type==="login")
    return {
        isConnected:true,
        account:action.payload.account,
        instance:action.payload.instance,
        isadmin:action.payload.isadmin,
        flag:action.payload.flag
    }
    if(action.type==="register")
    return {...state,flag:false}
}