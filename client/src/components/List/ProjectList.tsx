import { useState, useEffect } from 'react';
import { Container, Grid, LinearProgress, Paper, Toolbar } from '@mui/material';
import Projects from './Table/Projects';
import { Project } from './ProjectList.types';
import { getAllProjects } from '../../API';
import DaylyAreaChart from './Charts/DaylyAreaChart';
import DaylyPieChart from './Charts/DaylyPieChart';
import Navbar from '../Navbar/Navbar';

import './ProjectList.css'

function ProjectList() {
    const [projects, setProjects] = useState<Project[]>()
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        getAllProjects().then(projects => {
            setProjects(projects.map(project => {
                return { id: project._id, name: project.name, jira: project.jira }
            }));
            setLoading(false)
        })
        .catch(_ => setLoading(true));
    }, [])

    return (
        <Navbar element={
            loading ? <LinearProgress className="mt-4" color="success"/> :
            <>
                <Toolbar/>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: 280}}><DaylyAreaChart/></Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: 280}}><DaylyPieChart/></Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}}>{projects ? <Projects/> : <></>}</Paper>
                        </Grid>  
                    </Grid> 
                </Container>
            </>
        }/>
    )
}

export default ProjectList