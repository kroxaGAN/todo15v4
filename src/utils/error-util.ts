import {AppActionType, changeErrorStatusAC, changeLoadingStatusAC} from "../app/app-reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolists-api";

export const appServerNetworkError=(dispatch:Dispatch<AppActionType>, error:{message:string})=>{
    dispatch(changeErrorStatusAC(error.message))
    dispatch(changeLoadingStatusAC("false"))
}

export const appServerAppError=<D>(data:ResponseType<D>,dispatch:Dispatch<AppActionType>)=>{
    if(data.messages.length){
        dispatch(changeErrorStatusAC(data.messages[0]))
    }else{
        dispatch(changeErrorStatusAC("something not good ...."))
        dispatch(changeLoadingStatusAC("false"))
    }
}
