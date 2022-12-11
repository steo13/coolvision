import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Collapse } from "@mui/material"
import { useEffect, useState } from "react"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { MonthAssignment, Sold, SoldWithProject } from "../Plan.types";
import { soldTypologies } from "../../../fakedata";
import ValuedRow from "./ValuedRow";
import { getMonthAssignments, getSoldsByMonth } from "../../../API";
import { Dayjs } from "dayjs";
import ValuedRadarChart from "./ValuedRadarChart";

interface Props {
    month: Dayjs,
    current: boolean,
}

function ValuedTable({month, current}: Props){
    // eslint-disable-next-line
    const [typologies] = useState(soldTypologies)
    const [solds, setSolds] = useState<Sold[]>([])
    const [monthAssignments, setMonthAssignments] = useState<MonthAssignment[]>([])
    const [originalSolds, setOriginalSolds] = useState<SoldWithProject[]>([])
    const [totalCommercial, setTotalCommercial] = useState(0)
    const [totalValued, setTotalValued] = useState(0)
    const [update, setUpdate] = useState(true)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        let newSolds: Sold[] = []
        getSoldsByMonth(month).then(solds => {
            solds.forEach(oldSold => {
                if (!newSolds.find(newSold => newSold._id_project === oldSold.project._id))
                    newSolds.push({
                        _id_project: oldSold.project._id,
                        total_commercial: oldSold.total_commercial,
                        total_valued: oldSold.total_valued
                    })
                else
                    newSolds = newSolds.map(newSold => {
                        if (newSold._id_project === oldSold.project._id) 
                            return {
                                    _id_project: newSold._id_project,
                                    total_commercial: newSold.total_commercial + oldSold.total_commercial,
                                    total_valued: newSold.total_valued + oldSold.total_valued
                                }
                        else
                            return newSold
                    })
            })
            setOriginalSolds(solds)
            setSolds(newSolds)
            getMonthAssignments(month.format('MM/YYYY')).then(assignments => setMonthAssignments(assignments))
        })
        
    }, [month])

    useEffect(() => {
        if (update) 
            getMonthAssignments(month.format('MM/YYYY')).then(assignments => {
                setMonthAssignments(assignments);
                setUpdate(false)
            })
    }, [update, month])

    useEffect(() => {
        let totC = 0
        let totV = 0
        solds.forEach(s => { totC += s.total_commercial; totV += s.total_valued })
        setTotalCommercial(totC)
        setTotalValued(totV)
    }, [solds])

    return (
        <>
            {
                !solds ?
                    <div>Loading ...</div>
                :
                    <TableContainer className='ValuedTable-tableContainerValued'>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell size='small'/>
                                    <TableCell>Project</TableCell>
                                    <TableCell>Commercial</TableCell>
                                    <TableCell>Estimate</TableCell>
                                    <TableCell>Assigned</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    solds.map((sold, key) => {
                                        return (
                                            <ValuedRow
                                                key={key}
                                                typologies={typologies}
                                                sold={sold}
                                                originalSold={originalSolds?.filter(os => os.project._id === sold._id_project)} 
                                                current={current} 
                                                month={month} 
                                                monthAssignments={monthAssignments}
                                                setUpdate={(value: boolean) => setUpdate(value)}
                                            />
                                        )
                                    })
                                }
                            </TableBody>
                            <TableHead className="ValuedTable-tableHeader">
                                <TableRow>
                                    <TableCell>
                                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                            { open ? <KeyboardArrowUpIcon fontSize='small'/> : <KeyboardArrowDownIcon fontSize='small'/> }
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell>{totalCommercial}</TableCell>
                                    <TableCell>{totalValued}</TableCell>
                                    <TableCell>
                                        { monthAssignments.map(monthAssignments => monthAssignments.assigned).reduce((assign1, assign2) => assign1 + assign2, 0) }
                                    </TableCell>
                                    <TableCell/>
                                </TableRow>
                                <TableRow>
                                    <TableCell className='ValuedTable-cell' colSpan={6}>
                                        <Collapse in={open} timeout="auto" unmountOnExit>
                                            <div className='row justify-content-center'>
                                                <div className={current ? 'col-sm-6' : ''}>
                                                    <Table size='small'>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Type</TableCell>
                                                                <TableCell>Commercial</TableCell>
                                                                <TableCell>Estimate</TableCell>                                          
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                typologies.map((typo, key) => {
                                                                    return (
                                                                        <TableRow key={key}>
                                                                            <TableCell>
                                                                                {typo}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {
                                                                                    originalSolds?.filter(os => os.type === typo)
                                                                                        .map(os => os.total_commercial)
                                                                                        .reduce((os1, os2) => os1 + os2, 0)
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {
                                                                                    originalSolds?.filter(os => os.type === typo)
                                                                                        .map(os => os.total_valued)
                                                                                        .reduce((os1, os2) => os1 + os2, 0)
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
                                                        <div className='col-sm-4'><ValuedRadarChart originalSold={originalSolds} typologies={typologies}/></div>
                                                    :
                                                        <></>
                                                } 
                                            </div>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>
            }
        </>
    )
}

export default ValuedTable