import Box from '@mui/material/Box';
import { Button, Checkbox, FormControlLabel, LinearProgress, Modal, TextField } from "@mui/material";
import { useEffect, useState } from 'react';
import { DataGrid, enUS, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import dayjs, { Dayjs } from 'dayjs';
import { getUsersHolidays } from '../../../API';
import { Assignment, MonthAssignment, User } from '../Plan.types';

function CustomToolbar (props: {setFilter: (arg0: boolean) => void}) {
    const [filter, setFilter] = useState(false)
    return (
        <GridToolbarContainer style={{display: 'flex'}}>
            <FormControlLabel className='AssignedModal-toolbar' control={<Checkbox size='small'/>} 
                label='Show only available'
                onChange={() => { setFilter(!filter); props.setFilter(!filter) }}
            />
            <GridToolbarQuickFilter className='custom-toolbar-component' debounceMs={0}/>
        </GridToolbarContainer>
    );
}

interface Props {
    monthAssignments: MonthAssignment[],
    month: Dayjs
    open: boolean,
    assignments: Assignment[] | undefined,
    handleClose: () => void,
    handleSubmit: (rows: any[]) => void,
    project: String
}

function AssignedModal ({month, open, handleClose, monthAssignments, handleSubmit, project, assignments}: Props) {
    function getWeekdaysInMonth(year: number, month: number) {
        const days = [];
        let date = new Date(year, month, 1);
        while (date.getMonth() === month) {
            if (![0, 6].includes(date.getDay())) 
                days.push(date.getDate());
            date.setDate(date.getDate() + 1);
        }
        return days.length 
    }
    const [users, setUsers] = useState<User[]>([])
    const [columns, setColumns] = useState<any[]>([])
    const [disableSave, setDisableSave] = useState(false)
    const [rows, setRows] = useState<any[]>([])
    const [filter, setFilter] = useState(false)

    useEffect(() => {
        if (month)
            getUsersHolidays(month).then(users => {
                let newUsers: User[] = []
                users.forEach(user => {
                    newUsers.push({
                        _id: String(user.user.id),
                        name: user.user.firstName + " " + user.user.lastName,
                        holidays: user.holidays
                            .map((holiday: any) => {
                                if (holiday.status === 'APPROVED_BY_HR') {
                                    if (month.startOf('month') > dayjs(holiday.startDateTime.date)) 
                                        return - month.startOf('month').diff(dayjs(holiday.endDateTime.date).format('YYYY-MM-DD'), 'day')
                                    else {
                                        if (month.endOf('month') < dayjs(holiday.endDateTime.date)) 
                                            return month.endOf('month').diff(dayjs(holiday.startDateTime.date).format('YYYY-MM-DD'), 'day')
                                        else
                                            if (dayjs(holiday.endDateTime.date).diff(dayjs(holiday.startDateTime.date), 'hour') > 0)
                                                return Number((dayjs(holiday.endDateTime.date).diff(dayjs(holiday.startDateTime.date), 'hour')/8).toFixed(2))
                                            else
                                                return 1  
                                    }
                                } return 0
                            })
                            .reduce((day1: any, day2: any) => day1 + day2, 0),
                        photo: user.user.googleProfilePhoto,
                        role: user.user.role,
                    })
                })
                setUsers(newUsers)
            })
    }, [month]) 
    
    useEffect(() => {
        if (users && assignments && month && monthAssignments)
            setRows(
                users.map(user => {
                    return {
                        id: user._id,
                        Name: user.name,
                        Role: user.role,
                        Photo: user.photo,
                        'Monthly Assigned': 
                            monthAssignments.find(assignment => assignment._id_user === user._id) ?
                                monthAssignments.find(assignment => assignment._id_user === user._id)?.assigned : 0,
                        'Project assigned': 
                            assignments?.find(assignment => assignment.user.id === user._id) ?
                                assignments.find(assignment => assignment.user.id === user._id)?.assigned : 0,
                        Remaining: 
                            monthAssignments.find(assignment => assignment._id_user === user._id) ?
                                getWeekdaysInMonth(Number(month?.get('year')), Number(month?.get('month'))) 
                                    - Number(monthAssignments?.find(assignment => assignment._id_user === user._id)?.assigned) 
                                    - Number(user.holidays) : 
                                getWeekdaysInMonth(Number(month?.get('year')), Number(month?.get('month'))) 
                                - Number(user.holidays),
                    }
                })
            )
    }, [users, assignments, month, monthAssignments])

    useEffect(() => {
        if (rows.length > 0)
            setColumns([
                { field: "Photo", width: 90, filterable: false, sortable: false, 
                    renderCell: (params: any) => {
                        return (<img src={String(params.row.Photo)} alt="" width={25} height={25}/>)
                    } 
                },
                { field: "Name", width: 200, filterable: false },
                { field: "Role", width: 150, filterable: false },
                { field: "Project assigned", width: 180, filterable: false, sortable: false, getApplyQuickFilterFn: undefined, 
                    renderCell: (params: any) => {
                        return (
                            <TextField value={params.row['Project assigned']} variant='standard' type='number' size='small' label='Assign' error={params.row.Remaining < 0}
                                onChange={(e) => {
                                    if (Number(e.target.value) >= 0) {
                                        let newRows = rows.map(row => {
                                            if (row.id === params.row.id) {
                                                if (Number(row.Remaining) - (Number(e.target.value) - Number(row['Project assigned'])) < 0)
                                                    setDisableSave(true)
                                                else
                                                    setDisableSave(false)
                                                return {
                                                    ...row,
                                                    'Project assigned': Number(e.target.value),
                                                    'Monthly Assigned': Number(row['Monthly Assigned']) + Number(e.target.value) - Number(row['Project assigned']),
                                                    Remaining: Number(row.Remaining) - (Number(e.target.value) - Number(row['Project assigned'])) 
                                                }
                                            } else
                                                return row
                                        })
                                        setRows(newRows)
                                    }
                                }}
                            />
                        )
                    }
                },
                { field: "Monthly Assigned", width: 200, sortable: false, filterable: false, getApplyQuickFilterFn: undefined }, 
                { field: "Remaining", type: 'number', width: 150, sortable: false, filterable: false, getApplyQuickFilterFn: undefined }
            ])
    }, [rows])
  
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box className='AssignedModal-box'>
                <h6 className='mb-2'>Staffing for <b>{project}</b> - <b>{month?.format('MM/YYYY').toString()}</b></h6>
                <div className='AssignedModal-dataGrid'>
                    {
                        rows.length > 0 ?
                            <DataGrid
                                localeText={enUS.components.MuiDataGrid.defaultProps.localeText}
                                rows={filter ? rows?.filter((r: { Remaining: number; }) => r.Remaining !== 0) : rows}
                                disableColumnMenu
                                disableColumnSelector
                                disableDensitySelector
                                disableColumnFilter
                                hideFooter
                                columns={columns}
                                components={{ Toolbar: CustomToolbar }}
                                componentsProps={{ toolbar: { setFilter: (value: boolean | ((prevState: boolean) => boolean)) => setFilter(value) }}}
                            /> 
                        :
                            <LinearProgress color="success"/>
                    }
                </div>
                <div className='AssignedModal-footer'>
                    <Button className='mt-2  mb-2' onClick={handleClose}>Close</Button>
                    <Button className='mt-2 mb-2' color="success" disabled={disableSave} onClick={() => handleSubmit(rows)}>Save</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default AssignedModal
