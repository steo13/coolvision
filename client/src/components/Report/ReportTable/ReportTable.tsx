import { Collapse, IconButton, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState } from "react"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReportRow from "./ReportRow";
import CustomRadarChart from "./CustomRadarChart";
import { SoldWorklogs } from "../Report.types";
import { soldTypologies } from "../../../fakedata";
import { Dayjs } from "dayjs";
import { getAllProjects, getJiraWorklogs, getSoldsByMonth } from "../../../API";

interface Props {
    month: Dayjs,
    current: boolean
}

function ReportTable({month, current}: Props) {
    const [soldsIssues, setSoldsIssues] = useState<SoldWorklogs[]>([])
    const [loadingWorked, setLoadingWorked] = useState(true)
    const [open, setOpen] = useState(false)
    const [typologies] = useState(soldTypologies)

    useEffect(() => {
        if (month) {
            let newSoldsIssues: SoldWorklogs[] = []
            let promisesZero: any[] = []
            let promisesOne: any[] = []
            let promisesTwo: any[] = []
            let promisesThree: any[] = []
            setLoadingWorked(true)
            getSoldsByMonth(month).then(solds => {
                solds.forEach(oldSold => {
                    if (!newSoldsIssues.find(newSold => newSold.project === oldSold.project.name))
                        newSoldsIssues.push({
                            project: oldSold.project.name,
                            jira: oldSold.project.jira,
                            valid: true,
                            history: [{
                                type: oldSold.type,
                                commercial: oldSold.total_commercial,
                                month: month.format('MM/YYYY'),
                                worked: 0
                            }]
                        })
                    else {
                        newSoldsIssues = newSoldsIssues.map(soldIssue => {
                            if (soldIssue.project === oldSold.project.name) {
                                if (!soldIssue.history.find(history => history.type === oldSold.type))
                                    soldIssue.history.push({
                                        type: oldSold.type,
                                        commercial: oldSold.total_commercial,
                                        month: month.format('MM/YYYY'),
                                        worked: 0
                                    })
                                else {  
                                    soldIssue.history = soldIssue.history.map(history => {
                                        if (history.type === oldSold.type)
                                            return {
                                                type: oldSold.type,
                                                commercial: oldSold.total_commercial + history.commercial,
                                                month: month.format('MM/YYYY'),
                                                worked: 0
                                            }
                                        else
                                            return history
                                    })
                                }
                                return soldIssue
                            } else
                                return soldIssue
                        })
                    }
                })
            }).then(_ => {
                typologies.forEach(type => {
                    newSoldsIssues.forEach(soldIssue => {
                        promisesOne.push(
                            getJiraWorklogs(month.startOf('month').format('YYYY/MM/DD'), month.endOf('month').format('YYYY/MM/DD'), soldIssue.jira, type)
                            .then(worked => {
                                if (worked > 0) {
                                    if (!soldIssue.history.find(history => history.type === type))
                                        soldIssue.history.push({
                                            type: type,
                                            commercial: 0,
                                            month: month.format('MM/YYYY'),
                                            worked: worked as number,
                                        })
                                    else
                                        soldIssue.history = soldIssue.history.map(history => {
                                            if (history.type === type)
                                                return {
                                                    type: type,
                                                    commercial: history.commercial,
                                                    month: month.format('MM/YYYY'),
                                                    worked: worked as number,
                                                }
                                            return history
                                        })
                                }
                            })
                        )
                    })
                })
            }).then(_ => {
                promisesTwo.push(
                    getAllProjects().then(projects => {
                        projects.forEach(project => {
                            if (!newSoldsIssues.find(soldIssue => soldIssue.project === project.name))
                                typologies.forEach(type => {
                                    promisesZero.push(
                                        getJiraWorklogs(month.startOf('month').format('YYYY/MM/DD'), month.endOf('month').format('YYYY/MM/DD'), project.jira, type)
                                            .then(worked => {
                                                if (Number(worked) > 0) {
                                                    if (!newSoldsIssues.find(soldIssue => soldIssue.project === project.name))
                                                        newSoldsIssues.push({
                                                            project: project.name,
                                                            jira: project.jira,
                                                            valid: false,
                                                            history: [{
                                                                type: type,
                                                                commercial: 0,
                                                                month: month.format('MM/YYYY'),
                                                                worked: worked as number
                                                            }]
                                                        })
                                                    else
                                                        newSoldsIssues = newSoldsIssues.map(soldIssue => {
                                                            if (soldIssue.project === project.name)
                                                                soldIssue.history.push({
                                                                    type: type,
                                                                    commercial: 0,
                                                                    month: month.format('MM/YYYY'),
                                                                    worked: worked as number
                                                                })
                                                            return soldIssue
                                                        })
                                                }
                                            })
                                    )
                                })
                        })
                    })
                )
            }).then(_ => {
                typologies.forEach(type => {
                    promisesThree.push(
                        getJiraWorklogs(month.startOf('month').format('YYYY/MM/DD'), month.endOf('month').format('YYYY/MM/DD'), "", type)
                        .then(worked => {
                            if (!newSoldsIssues.find(newSold => newSold.project === 'Missing projects'))
                                newSoldsIssues.push({
                                    project: 'Missing projects',
                                    jira: '/',
                                    valid: true,
                                    history: [{
                                        type: type,
                                        commercial: 0,
                                        month: month.format('MM/YYYY'),
                                        worked: worked as number
                                    }]
                                })
                            else {
                                newSoldsIssues = newSoldsIssues.map(soldIssue => {
                                    if (soldIssue.project === 'Missing projects') {
                                        if (!soldIssue.history.find(history => history.type === type))
                                            soldIssue.history.push({
                                                type: type,
                                                commercial: 0,
                                                month: month.format('MM/YYYY'),
                                                worked: worked as number
                                            })
                                        else {  
                                            soldIssue.history = soldIssue.history.map(history => {
                                                if (history.type === type)
                                                    return {
                                                        type: type,
                                                        commercial: 0,
                                                        month: month.format('MM/YYYY'),
                                                        worked: Number(worked as number + history.worked)
                                                    }
                                                else
                                                    return history
                                            })
                                        }
                                        return soldIssue
                                    } else
                                        return soldIssue
                                })
                            }
                        })
                    )
                })
            }).then(_ => {
                Promise.all(promisesOne).then(_ => {
                    Promise.all(promisesTwo).then(_ => {
                        Promise.all(promisesZero).then(_ => {
                            Promise.all(promisesThree).then(_ => {
                                setSoldsIssues(newSoldsIssues)
                                setLoadingWorked(false)
                            })
                        })
                    })     
                })
            })
        }
    }, [month, typologies])

    return (
        <>
            {
                typologies && !loadingWorked ?
                    <TableContainer className='Report-tableContainerValued'>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell/>
                                    <TableCell>Project</TableCell>
                                    <TableCell>Commercial</TableCell>
                                    <TableCell>Worked</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    soldsIssues.map((soldIssue, key) => {
                                        return (
                                            <ReportRow key={key} soldIssue={soldIssue} typologies={typologies} current={current}/>
                                        )
                                    })
                                }
                            </TableBody>
                            <TableHead className="Report-tableHeader">
                                <TableRow>
                                    { 
                                        current ?
                                            <TableCell>
                                                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                                    { open ? <KeyboardArrowUpIcon fontSize='small'/> : <KeyboardArrowDownIcon fontSize='small'/> }
                                                </IconButton>
                                            </TableCell>
                                        :
                                            <TableCell/>
                                    }
                                    <TableCell>Total</TableCell>
                                    <TableCell>
                                        {
                                            soldsIssues.map(soldIssue => {
                                                return soldIssue.history
                                                    .map(history => history.commercial)
                                                    .reduce((commercial1, commercial2) => commercial1 + commercial2, 0)
                                            }).reduce((commercial1, commercial2) => Number((commercial1 + commercial2).toFixed(2)), 0)
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            soldsIssues
                                                .map(soldIssue => {
                                                    return soldIssue.history
                                                        .map(history => history.worked)
                                                        .reduce((worked1, worked2) => worked1 + worked2, 0)
                                                })
                                                .reduce((worked1, worked2) => Number((worked1 + worked2).toFixed(2)), 0)
                                        }
                                    </TableCell>
                                </TableRow>
                                {
                                    current ?
                                        <TableRow>
                                            <TableCell className='Report-cell' colSpan={6}>
                                                <Collapse in={open} timeout="auto" unmountOnExit>
                                                    <div className='row Report-table'>
                                                        <div className='col-sm-5'>
                                                            <Table size='small'>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>Type</TableCell>
                                                                        <TableCell>Commercial</TableCell>
                                                                        <TableCell>Worked</TableCell>                                          
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {
                                                                        typologies.map((typo, key) => {
                                                                            return (
                                                                                <TableRow key={key}>
                                                                                    <TableCell>{typo}</TableCell>
                                                                                    <TableCell>
                                                                                        {
                                                                                            soldsIssues
                                                                                                .map(soldIssue => {
                                                                                                    return soldIssue.history
                                                                                                        .filter(history => history.type === typo)
                                                                                                        .map(history => history.commercial)
                                                                                                        .reduce((commercial1, commercial2) => commercial1 + commercial2, 0)
                                                                                                })
                                                                                                .reduce((commercial1, commercial2) => Number((commercial1 + commercial2).toFixed(2)), 0)
                                                                                        }
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {
                                                                                            soldsIssues
                                                                                                .map(soldIssue => {
                                                                                                    return soldIssue.history
                                                                                                        .filter(history => history.type === typo)
                                                                                                        .map(history => Number(history.worked))
                                                                                                        .reduce((worked1, worked2) => worked1 + worked2, 0)
                                                                                                })
                                                                                                .reduce((worked1, worked2) => Number((worked1 + worked2).toFixed(2)), 0)
                                                                                        }
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            )
                                                                        })
                                                                    }
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                        <div className='col-sm-5'>
                                                            <CustomRadarChart soldsIssues={soldsIssues} typologies={typologies}/>
                                                        </div>
                                                    </div>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    :
                                        <></>
                                }
                            </TableHead>
                        </Table>
                    </TableContainer>
                :
                    <LinearProgress className="mt-3" color="success"/>
            }
        </>
    )
}

export default ReportTable