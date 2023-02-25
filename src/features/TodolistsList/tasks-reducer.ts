import {
    AddTodolistActionType,
    ClearTodolistsActionType,
    RemoveTodolistActionType,
    SetTodolistsActionType
} from './todolists-reducer'
import {
    DomainTaskType,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {AppActionType, changeErrorStatusAC, changeLoadingStatusAC, StatusLoadingType} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {appServerAppError, appServerNetworkError} from "../../utils/error-util";

const initialState: TasksDomainStateType = {}

export const tasksReducer = (state: TasksDomainStateType = initialState, action: ActionsType): TasksDomainStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {
                ...state,
                [action.task.todoListId]: [{...action.task, entityStatus: 'idle'}, ...state[action.task.todoListId]]
            }
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            return {
                ...state, [action.todolistId]: action.tasks.map(el => ({
                    ...el,
                    entityStatus: 'idle'
                }))
            }
        case "CHANGE-TASK-ENTITY-STATUS": {
            return {
                ...state, [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId
                    ? {...el, entityStatus: action.entityStatus}
                    : el)
            }
        }
        case'CLEAR-TODO': {
            return {}
        }
        default:
            return state
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)
export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, entityStatus: StatusLoadingType) => {
    return {
        type: "CHANGE-TASK-ENTITY-STATUS", todolistId, taskId, entityStatus
    } as const
}

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(changeLoadingStatusAC("loading"))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            if (res.data.error === null) {
                const tasks = res.data.items
                const action = setTasksAC(tasks, todolistId)
                dispatch(action)
            } else {
                dispatch(changeErrorStatusAC(res.data.error))
                dispatch(changeLoadingStatusAC("false"))
            }
        })
        .catch((err) => {
            appServerNetworkError(dispatch, err)
        })
        .finally(() => {
            dispatch(changeLoadingStatusAC("successed"))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(changeLoadingStatusAC("loading"))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, "loading"))
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
            } else {
                appServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            appServerNetworkError(dispatch, err)
        })
        .finally(() => {
            dispatch(changeLoadingStatusAC("successed"))
        })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(changeLoadingStatusAC("loading"))
    todolistsAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                const action = addTaskAC(task)
                dispatch(action)
            } else {
                appServerAppError(res.data, dispatch)
            }

        })
        .catch((err: AxiosError) => {
            appServerNetworkError(dispatch, err)
        })
        .finally(() => {
            dispatch(changeLoadingStatusAC("successed"))
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }
        dispatch(changeLoadingStatusAC("loading"))
        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(taskId, domainModel, todolistId))
                } else {
                    appServerAppError(res.data, dispatch)
                }
            })
            .catch((err: AxiosError) => {
                appServerNetworkError(dispatch, err)
            })
            .finally(() => {
                dispatch(changeLoadingStatusAC("successed"))
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type TasksDomainStateType = {
    [key: string]: Array<DomainTaskType>
}

type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | AppActionType
    | ReturnType<typeof changeTaskEntityStatusAC>
    | ClearTodolistsActionType
