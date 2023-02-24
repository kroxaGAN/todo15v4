import {Dispatch} from "redux";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {appServerAppError, appServerNetworkError} from "../../utils/error-util";
import {changeLoadingStatusAC} from "../../app/app-reducer";

const initialState={
    isLoggedIn:false
}
type InitialSateType=typeof initialState

export const authReducer = (state:InitialSateType=initialState, action: AuthActions) => {
    switch (action.type) {
        case 'CHANGE-LOGGED-STATUS': {
            return {...state, isLoggedIn: action.valueLogged}
        }
        default:
            return state
    }
}

export const setIsLoggedInAC=(valueLogged:boolean)=>{
    return{
        type: 'CHANGE-LOGGED-STATUS', valueLogged
    }
}


export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(changeLoadingStatusAC("loading"))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                console.log(res.data.data.userId)
                dispatch(setIsLoggedInAC(true))
            } else {
                appServerAppError(res.data, dispatch)
            }
        })
        .catch((err)=>{
            appServerNetworkError(dispatch,err)
        })
        .finally(()=>{
            dispatch(changeLoadingStatusAC("successed"))
        })
}

type AuthActions=ReturnType<typeof setIsLoggedInAC >
