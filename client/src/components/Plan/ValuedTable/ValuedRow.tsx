import EditIcon from "@mui/icons-material/Edit"
import { TableRow, TableCell, IconButton, Collapse, Box, Typography, Table, TableHead, TableBody, CircularProgress, Icon } from "@mui/material"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React, { useEffect, useState } from "react";
import { getProjectById, getUserByIdInIntranet, updateAssignments } from "../../../API";
import AssignedModal from "./AssignedModal";
import { ProjectWithSold } from "../../List/ProjectList.types";
import { Assignment, MonthAssignment, Sold, SoldAssignment, SoldWithProject } from "../Plan.types";
import { Dayjs } from "dayjs";
import ValuedRadarChart from "./ValuedRadarChart";
import { roles } from "../../../fakedata";

interface Props {
    typologies: String[],
    originalSold: SoldWithProject[],
    monthAssignments: MonthAssignment[],
    setUpdate: (value: boolean) => void
    sold: Sold,
    current: boolean,
    month: Dayjs,
}

function ValuedRow ({sold, current, month, originalSold, typologies, monthAssignments, setUpdate}: Props) {
    const [project, setProject] = useState<ProjectWithSold>()
    const [assignments, setAssignments] = useState<Assignment[]>()
    const [open, setOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        getProjectById(sold._id_project).then(prj => setProject(prj))
    }, [sold])

    useEffect(() => {
        if (project) {
            let projAssignments = project.sold.find(sold => sold.month === month.format('MM/YYYY')) as SoldAssignment
            let newAssignments: Assignment[] = []
            let idAssignments: Number[] = []
            if (projAssignments) {
                projAssignments.assignments.forEach(assignment => {
                    idAssignments.push(Number(assignment._id_user))
                })
                getUserByIdInIntranet(idAssignments).then(users => {
                    users.forEach(user => {
                        newAssignments.push({
                            user: { id: String(user.id), name: user.firstName + ' ' + user.lastName, photo: user.googleProfilePhoto, role: user.role },
                            assigned: Number(projAssignments.assignments.find(assignment => assignment._id_user === String(user.id))?.assigned)
                        })
                    })
                    setAssignments(newAssignments)
                })
            } else
                setAssignments([])
        }
    }, [project, month])

    return (
        <>
            {
                project ?
                    <>
                        <TableRow sx={{'& > *': { borderBottom: 'unset' }}}>
                            <TableCell>
                                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                    { open ? <KeyboardArrowUpIcon fontSize='small'/> : <KeyboardArrowDownIcon fontSize='small'/> }
                                </IconButton>
                            </TableCell>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>{sold.total_commercial}</TableCell>
                            <TableCell>{sold.total_valued}</TableCell>
                            <TableCell>
                                {
                                    assignments ?
                                        Number(assignments.map(assignment => assignment.assigned).reduce((assign1, assign2) => assign1 + assign2, 0).toFixed(2)) + " MD"
                                    :
                                        <CircularProgress color='success'/>
                                }
                            </TableCell>
                            <TableCell>
                                {
                                    current ?
                                        <IconButton onClick={() => setShowModal(true)}><EditIcon sx={{color: "#0d6efd"}}/></IconButton>
                                    : 
                                        <></>
                                }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='ValuedTable-cell' colSpan={6}>
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <Box sx={{ margin: 1 }}>
                                        <Typography variant="h6" gutterBottom component="div">Month overview:</Typography>
                                        <div className='row justify-content-center'>
                                            <div className={current ? 'col-sm-6' : ''}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Type</TableCell>
                                                            <TableCell>Commercial</TableCell>
                                                            <TableCell>Estimate</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            typologies.filter(typo => typo !== 'Other').map((typo, key) => {
                                                                return (
                                                                    <TableRow key={key}>
                                                                        <TableCell>{typo}</TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                originalSold.filter(originalSold => originalSold.type === typo)
                                                                                    .map(originalSold => originalSold.total_commercial)
                                                                                    .reduce((originalSold1, originalSold2) => originalSold1 + originalSold2, 0)
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                originalSold.filter(originalSold => originalSold.type === typo)
                                                                                    .map(originalSold => originalSold.total_valued)
                                                                                    .reduce((originalSold1, originalSold2) => originalSold1 + originalSold2, 0)
                                                                            }
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            })
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            { 
                                                current ?
                                                    <div className='col-sm-5'><ValuedRadarChart originalSold={originalSold} typologies={typologies}/></div>
                                                :
                                                    <></>
                                            }   
                                        </div>
                                        <Typography className='mt-3'variant="h6" gutterBottom component="div">Staffing for {month.format("MM/YYYY").toString()}:</Typography>
                                        <Table size='small'>
                                            {
                                                roles.map((role, idx) => {
                                                    if (assignments?.find(assignment => assignment.user.role === role)) 
                                                        return (
                                                            <React.Fragment key={idx}>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell size="small">Photo</TableCell>
                                                                        <TableCell>{role}</TableCell>
                                                                        <TableCell>Assigned</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {
                                                                        assignments.filter(assignment => assignment.user.role === role).map((assignment, key) => {
                                                                            return (
                                                                                <TableRow key={key}>
                                                                                    <TableCell size="small">
                                                                                        <Icon>
                                                                                            <img className='image' alt="" src={String(assignment.user.photo)} height={25} width={25}/>
                                                                                        </Icon>
                                                                                    </TableCell>
                                                                                    <TableCell>{assignment.user.name}</TableCell>
                                                                                    <TableCell><Typography><b>{assignment.assigned+" MD"}</b></Typography></TableCell>
                                                                                </TableRow>
                                                                            )
                                                                        })
                                                                    }
                                                                </TableBody>
                                                            </React.Fragment>
                                                        )
                                                    else
                                                        return (<React.Fragment key={idx}/>)
                                                }) 
                                            }
                                        </Table>
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                        {
                            showModal ?
                                <AssignedModal month={month} monthAssignments={monthAssignments} assignments={assignments} open={showModal} 
                                    handleClose={() => setShowModal(false)} project={project.name}
                                    handleSubmit={(rows: any[]) => {
                                        let newAssignments: Assignment[] = []
                                        newAssignments = rows
                                            .filter(row => row['Project assigned'] > 0)
                                            .map(row => {
                                                return {
                                                    user: { id: row.id, name: row.Name, photo: row.Photo, role: row.Role },
                                                    assigned: row['Project assigned']
                                                }
                                            })
                                        assignments?.forEach(assignment => {
                                            if (!newAssignments.find(newAssignment => newAssignment.user.id === assignment.user.id))
                                                newAssignments.push(assignment)
                                        })
                                        setAssignments(newAssignments)
                                        updateAssignments(project._id, (month?.format("MM/YYYY") as string), newAssignments)
                                        setUpdate(true)
                                        setShowModal(false)
                                    }}
                                />
                            :
                                <></>
                        }
                    </>
                :
                    <TableRow><TableCell>Loading ...</TableCell></TableRow>
            }
        </> 
    )
}

export default ValuedRow;