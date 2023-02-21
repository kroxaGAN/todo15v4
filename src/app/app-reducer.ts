
export type  StatusLoadingType='loading' | 'idle' | 'false' | 'successed'

const initialAppState={
    statusLoading:'idle' as StatusLoadingType
}

type InitialAppStateType=typeof initialAppState

export const appReducer =(state:InitialAppStateType=initialAppState, action:AppActionType): InitialAppStateType=>{
    switch (action.type) {
        case 'CHANGE-LOADING-STATUS':{
            return {...state,statusLoading: action.status}
        }
        default: return state
    }
}

export const changeLoadingStatusAC=(status:StatusLoadingType)=>{
    return{
        type:"CHANGE-LOADING-STATUS",status
    }as const
}

export type AppActionType= ReturnType<typeof changeLoadingStatusAC>
