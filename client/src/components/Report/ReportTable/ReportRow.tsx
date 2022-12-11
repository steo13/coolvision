import { TableRow, TableCell, IconButton, LinearProgress, Collapse, Box, Typography, Table, TableHead, TableBody, Tooltip } from "@mui/material"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useEffect, useState } from "react";
import BarChartCustom from "./BarChartCustom";
import DoubleBarChartCustom from "./DoubleBarChartCustom";
import WarningIcon from '@mui/icons-material/Warning';
import { SoldWorklogs } from "../Report.types";

interface Props {
    key: number,
    soldIssue: SoldWorklogs,
    typologies: string[],
    current: boolean
}

function ReportRow({soldIssue, typologies, current}: Props) {
    const [open, setOpen] = useState(false)
    const [commercial, setCommercial] = useState(0)
    const [worked, setWorked] = useState(0)

    useEffect(() => {
        if (soldIssue) {
            setCommercial(soldIssue.history.map(history => history.commercial).reduce((commercial1, commercial2) => Number((commercial1 + commercial2).toFixed(2)), 0))
            setWorked(soldIssue.history.map(history => history.worked).reduce((worked1, worked2) => Number((worked1 + worked2).toFixed(2)), 0))
        }
    }, [soldIssue])
    
    return (
        <>
            {
                soldIssue ?
                    <>
                        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                            <TableCell>
                                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                                    { open ? <KeyboardArrowUpIcon fontSize='small'/> : <KeyboardArrowDownIcon fontSize='small'/> }
                                </IconButton>
                            </TableCell>
                            <TableCell>{soldIssue.project}</TableCell>
                            <TableCell>{commercial}</TableCell>
                            <TableCell>
                                {worked}
                                {
                                    !soldIssue.valid ? 
                                        <Tooltip className='ml-4 mb-1' followCursor title={"Warning! the value relating to the worked to which reference is made does not have a commercial sold as regards the current month. Insert it via PROJECT"}>
                                            <WarningIcon fontSize='inherit' color="warning"/>
                                        </Tooltip> 
                                    : 
                                        <></>
                                }
                                <LinearProgress 
                                    color={commercial >= worked ? 'success' : 'error'}
                                    variant="determinate" 
                                    value={worked >= commercial ? 100 : worked === 0 ? 0 : worked/commercial*100} 
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className='custom-cell' colSpan={6}>
                                <Collapse in={open} timeout="auto" unmountOnExit>
                                    <Box>
                                        <Typography variant="h6" gutterBottom component="div">Overview</Typography>
                                        <Table size="small">
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
                                                                        soldIssue.history
                                                                            .filter(history => history.type === typo)
                                                                            .map(history => history.commercial)
                                                                            .reduce((commercial1, commercial2) => Number((commercial1 + commercial2).toFixed(2)), 0)
                                                                    }
                                                                </TableCell>
                                                                <TableCell>
                                                                    {
                                                                        soldIssue.history
                                                                            .filter(history => history.type === typo)
                                                                            .map(history => history.worked)
                                                                            .reduce((worked1, worked2) => Number((worked1 + worked2).toFixed(2)), 0)
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </Box>
                                    <div className='row ReportRow-row'>
                                        {
                                            !current ?
                                                <div className='col'><BarChartCustom soldIssue={soldIssue} typologies={typologies}/></div>
                                            :
                                                <DoubleBarChartCustom soldIssue={soldIssue} typologies={typologies}/>
                                        }   
                                    </div>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                    </>
                :
                    <></>
            } 
        </>
    )
}

export default ReportRow