import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import ProjectDetails from './components/List/ProjectDetails/ProjectDetails';
import ProjectList from './components/List/ProjectList';
import Login from './components/Login';
import Plan from './components/Plan/Plan';
import Report from './components/Report/Report';
import env from './environment';

import './App.css'

function App() {
    const [login, setLogin] = useState(false)

    useEffect(() => {
        fetch(`${env.server.scheme}://${env.server.host}:${env.server.port}/auth/login/success`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "true"
            },
        })
        .then((response) => {
            if (response.status === 200) 
                return response.json();
        })
        .then((_) => {
            setLogin(true)
        })
    }, [])
    
    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login login={login} setLogin={(value) => setLogin(value)}/>}/>
                <Route path='/' element={!login ? <Navigate to='/login'/> : <Navigate to='/projects'/>}/>
                <Route path='/projects' element={!login ? <Navigate to='/login'/> : <ProjectList/>}/>
                <Route path={'/project/:id'} element={!login ? <Navigate to='/login'/> : <ProjectDetails/>}/>
                <Route path='/plan' element={!login ? <Navigate to='/login'/> : <Plan/>}/>
                <Route path='/report' element={!login ? <Navigate to='/login'/> : <Report/>}/>
            </Routes>
        </Router>   
    );
}

export default App;