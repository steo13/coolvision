import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { getJiraWorklogs, getProjectById, getSoldsByIdProject } from '../../../API';
import { ProjectWithSold, Sold, Worklog } from '../ProjectList.types';
import SoldForm from './ProjectModal/SoldForm'
import { Card, CardActions, CardContent, Button, TextField, LinearProgress, TextFieldProps, Toolbar, Paper, Typography } from '@mui/material';
import ProjectSoldTable from './ProjectSoldTable/ProjectSoldTable';
import CustomPieChartTotal from '../Charts/CustomPieChartTotal';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs from 'dayjs';
import ProjectInformation from './ProjectInformation/ProjectInformation';
import Navbar from '../../Navbar/Navbar';
import CustomLineChart from '../Charts/CustomLineChart';

function ProjectDetails() {
    const [worklogs, setWorklogs] = useState<Worklog[]>([])
    const [loadingChart, setLoadingChart] = useState<boolean | String>(true)
    const [project, setProject] = useState<ProjectWithSold>()
    const [loading, setLoading] = useState(true)
    const [solds, setSolds] = useState<Sold[]>([])
    const [showModal, setShowModal] = useState(false)
    const [begin, setBegin] = useState(dayjs().subtract(4, 'month'))
    const [end, setEnd] = useState(dayjs())
    const { id } = useParams();

    useEffect(() => {
        if (loading && id) {
            getProjectById(id).then(prj => setProject(prj)).catch(_ => setLoading(true));
            getSoldsByIdProject(id).then(solds => { 
                setSolds(solds); 
                setLoading(false); 
            }).catch(_ => setLoading(true));
        }
    }, [id, loading])

    useEffect(() => {
        if (project && begin && end) {
            setLoadingChart(true)
            getJiraWorklogs(begin.startOf('month').format('YYYY/MM/DD'), end.endOf('month').format('YYYY/MM/DD'), project.jira).then(worklogs => {
                let newWorklogs: Worklog[] = [];
                (worklogs as Worklog[]).forEach((worklog: Worklog) => {
                    if (!newWorklogs.find(newWorklog => newWorklog.month === worklog.month && newWorklog.type === worklog.type)) {
                        newWorklogs.push({ 
                            month: worklog.month, 
                            worked: worklog.worked, 
                            type: worklog.type 
                        })
                    } else {
                        newWorklogs = newWorklogs.map(newWorklog => {
                            if (newWorklog.month === worklog.month && newWorklog.type === worklog.type) {
                                let mapWorklog: Worklog = {
                                    month: newWorklog.month,
                                    worked: worklog.worked + newWorklog.worked,
                                    type: newWorklog.type
                                }
                                return mapWorklog 
                            } else
                                return newWorklog
                        })
                    }
                })
                setWorklogs(newWorklogs)
                setLoadingChart(false)
            })
            .catch(_ => setLoadingChart('Invalid Jira code ...'))
        }
    }, [project, begin, end])

    return (
        <> 
            { 
                project && !loading ? 
                    <>
                        <Navbar element={
                            <>
                                <Toolbar/>
                                <div className='ProjectDetails-container'>
                                    <div className='row'>
                                        <div className='col-sm-6'>
                                            <Card className='mt-3 mb-3'>
                                                <CardContent><ProjectInformation project={project} setLoading={(value) => setLoading(value)}/></CardContent>
                                                <CardActions><Button onClick={() => setShowModal(true)}>Add effort</Button></CardActions>
                                            </Card>
                                            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                                                <Typography component="h2" variant="h6" color="#012b59" gutterBottom>Effort List</Typography>
                                                <ProjectSoldTable solds={solds}/>
                                            </Paper>
                                        </div>
                                        <div className='col-sm-6 mt-3'>
                                            <Paper sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                                                <Typography component="h2" variant="h6" color="#012b59" gutterBottom>Effort history</Typography>
                                                <div className='row justify-content-center'>
                                                    <CustomPieChartTotal solds={solds}/>
                                                </div>
                                            </Paper>
                                            <Paper sx={{p: 2, mt: 2, display: 'flex', flexDirection: 'column', height: 408}}>
                                                <div className='row justify-content-end'>
                                                    <div className='col'>
                                                        <Typography component="h2" variant="h6" color="#012b59" gutterBottom>Erogate history</Typography>
                                                    </div>
                                                    <div className='col-sm-3'>
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DatePicker
                                                                openTo="month"
                                                                views={['year', 'month']}
                                                                label="From"
                                                                inputFormat="MM/yyyy"
                                                                value={begin}
                                                                maxDate={end}
                                                                onChange={(value) => setBegin(dayjs(value))}
                                                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField size="small" {...params} helperText={null}/>}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>
                                                    <div className='col-sm-3'>
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DatePicker
                                                                openTo="month"
                                                                views={['year', 'month']}
                                                                label="To"
                                                                inputFormat="MM/yyyy"
                                                                value={end}
                                                                minDate={begin}
                                                                onChange={(value) => setEnd(dayjs(value))}
                                                                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField size="small" {...params} helperText={null}/>}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>
                                                </div>
                                                {
                                                    worklogs && loadingChart === false ?
                                                        <CustomLineChart issues={worklogs}/>
                                                    :
                                                        loadingChart === true ? 
                                                            <LinearProgress className='mt-3' color='success'/>
                                                        : 
                                                            <div>{loadingChart as String}</div>
                                                }
                                            </Paper>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }/>
                        {
                            showModal ? 
                                <SoldForm open={showModal} handleClose={() => setShowModal(false)}/> 
                            : 
                                <></>
                        }
                    </> 
                : 
                    <div>Loading ...</div>      
            }
        </>
    )
}

export default ProjectDetails