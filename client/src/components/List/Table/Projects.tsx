import { alpha, Button, InputBase, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { Project } from "../ProjectList.types";
import { getAllProjects } from "../../../API";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

function Projects () {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>()
    const [search, setSearch] = useState("")

    useEffect(() => {
        getAllProjects().then(projects => {
            setProjects(projects.map(project => {
                return { id: project._id, name: project.name, jira: project.jira }
            }));
        })
        .catch(_ => setProjects(undefined));
    }, [])

    return (
        <>
            <div className="row">
                <div className="col-sm-1"><Typography component="h2" variant="h6" color="#012b59" gutterBottom>Projects</Typography></div>
                <div className="col-sm-5">
                    <Search>
                        <SearchIconWrapper><SearchIcon/></SearchIconWrapper>
                        <StyledInputBase 
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search…" inputProps={{'aria-label': 'search' }}
                        />
                    </Search>
                </div>
            </div>
            <TableContainer className='Projects-containerHeight'>
                <Table stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Jira ID</TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            projects ?
                                projects.filter(project => {
                                    if (search === "")
                                        return true
                                    else
                                        if (project.name.toLowerCase().includes(search.toLowerCase()) || project.jira.toLowerCase().includes(search.toLowerCase()))
                                            return true
                                    return false
                                }).map((project, idx) => {
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>{project.name}</TableCell>
                                            <TableCell>{project.jira}</TableCell>
                                            <TableCell><Button size="small" onClick={() => navigate(`/project/${project.id}`)}>Details</Button></TableCell>
                                        </TableRow>
                                    )
                                })
                            : 
                                <></>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Projects;