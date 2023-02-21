export type  StatusLoadingType = 'loading' | 'idle' | 'false' | 'successed'

const initialAppState = {
    statusLoading: 'idle' as StatusLoadingType,
    error: null as null | string
}

type InitialAppStateType = typeof initialAppState

export const appReducer = (state: InitialAppStateType = initialAppState, action: AppActionType): InitialAppStateType => {
    switch (action.type) {
        case 'CHANGE-LOADING-STATUS': {
            return {...state, statusLoading: action.status}
        }
        case 'CHANGE-ERROR-STATUS':{
            return {...state, error: action.error}
        }
        default:
            return state
    }
}

export const changeLoadingStatusAC = (status: StatusLoadingType) => {
    return {
        type: "CHANGE-LOADING-STATUS", status
    } as const
}
export const changeErrorStatusAC = (error: null | string) => {
    return {
        type: 'CHANGE-ERROR-STATUS', error
    }as const
}

export type AppActionType = ReturnType<typeof changeLoadingStatusAC> | ReturnType<typeof changeErrorStatusAC>
