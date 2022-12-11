import { IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ProjectWithSold } from "../../ProjectList.types";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from "@mui/icons-material/Edit"
import { updateProject } from "../../../../API";

interface Props {
    project: ProjectWithSold,
    setLoading: (value: boolean) => void
}

function ProjectInformation({project, setLoading}: Props) {
    const [modifyName, setModifyName] = useState<boolean | String>(false)
    const [modifyJira, setModifyJira] = useState<boolean | String>(false)

    const modifyProject = (name: String, jira: String) => {
        if (project)
            updateProject(project._id, name, jira).then(_ => setLoading(true)).catch(_ => setLoading(true))
    }

    return(
        <>
            {
                !modifyName ?
                    <Typography variant="h5" component="div">
                        Project name: <b>{project.name}</b>
                        <IconButton onClick={() => setModifyName(true)}><EditIcon fontSize='small' sx={{color: "#0d6efd"}}/></IconButton>
                    </Typography>
                :
                    <Typography variant="h5" component="div">
                        Project name:
                        <TextField 
                            onChange={(e) => setModifyName(e.target.value)} 
                            size='small'variant='standard' 
                            style={{marginLeft: '8px'}}
                        />
                        <IconButton onClick={() => { 
                            modifyProject(modifyName as String, project.jira); 
                            setModifyName(false);  
                        }}>
                            <DoneIcon sx={{color: "#0d6efd"}} fontSize='small'/>
                        </IconButton>
                        <IconButton onClick={() => setModifyName(false)}><CloseIcon fontSize='small'/></IconButton>
                    </Typography>   
            }
            {
                !modifyJira ?
                    <Typography className='mt-2' variant="body2">
                        Jira code: <b>{project.jira}</b>
                        <IconButton onClick={() => { setModifyJira(true) }}><EditIcon fontSize='small' sx={{color: "#0d6efd"}}/></IconButton>
                    </Typography>
                :
                    <Typography className='mt-2' variant="body2" component="div">
                        Jira code:
                        <TextField onChange={(e) => setModifyJira(e.target.value)} 
                            size='small'variant='standard' 
                            style={{marginLeft: '8px'}}
                        />
                        <IconButton onClick={() => { 
                            modifyProject(project.name, modifyJira as String); 
                            setModifyJira(false);  
                        }}>
                            <DoneIcon sx={{color: "#0d6efd"}} fontSize='small'/>
                        </IconButton>
                        <IconButton onClick={() => setModifyJira(false)}><CloseIcon fontSize='small'/></IconButton>
                    </Typography>
            }     
        </>
    )
}

export default ProjectInformation;