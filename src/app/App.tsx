import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'

// You can learn about the difference by reading this guide on minimizing bundle size.
// https://mui.com/guides/minimizing-bundle-size/
// import { AppBar, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {useAppDispatch, useAppSelector} from "./store";
import {StatusLoadingType} from "./app-reducer";
import LinearProgress from "@mui/material/LinearProgress";
import {ErrorSnackbar} from "../components/ErrorSnackbar/erorSnackbar";
import {Login} from "../features/Login/Login";
import {Routes,Route,Navigate} from "react-router-dom";
import {logOutTC, meTC} from "../features/Login/auth-reducer";
import CircularProgress from "@mui/material/CircularProgress";


function App() {

    const status = useAppSelector<StatusLoadingType>(state => state.app.statusLoading)
    const isInitialized=useAppSelector<boolean>(state=>state.auth.isInitialised)
    const dispatch=useAppDispatch()

    useEffect(()=>{
        dispatch(meTC())
    },[])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }



    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit" onClick={()=>{dispatch(logOutTC())}}>Logout</Button>
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary"/>}
            <Container fixed>
                <Routes>
                    <Route path={'/'} element=<TodolistsList/> />
                    <Route path={'/login'} element=<Login/>/>
                    <Route path={'/404'} element={<h1>404 something wrong ....</h1>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>

                </Routes>

            </Container>
            <ErrorSnackbar/>

        </div>
    )
}

export default App
