import { TableRow, TableCell, IconButton, Collapse, Table, TableHead, TableBody } from "@mui/material"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from "react";
import { Legend, Bar, BarChart, Tooltip, XAxis } from "recharts";
import { Sold } from "../../ProjectList.types";

interface Props {
    sold: Sold,
}

function ProjectSoldTableRow ({sold}: Props) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon fontSize='small'/> : <KeyboardArrowDownIcon fontSize='small'/>}
                    </IconButton>
                </TableCell>
                <TableCell>{sold.initial_month}</TableCell>
                <TableCell>{sold.final_month}</TableCell>
                <TableCell>{sold.type}</TableCell>
                <TableCell>{sold.total_commercial}</TableCell>
                <TableCell>{sold.total_valued}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <div className="ProjectSoldTableRow-div">
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Month</TableCell>
                                        <TableCell>Commercial</TableCell>
                                        <TableCell>Estimate</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        sold.planning.map((plan, key) => {
                                            return (
                                                <TableRow key={key}>
                                                    <TableCell>{plan.month}/{plan.year}</TableCell>
                                                    <TableCell>{plan.commercial}</TableCell>
                                                    <TableCell>{plan.valued}</TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                            <BarChart className='mt-1'
                                height={300}
                                width={450}
                                data={sold.planning.map(plan => { 
                                    return { 
                                        month: plan.month+"/"+plan.year, 
                                        Commercial: plan.commercial, 
                                        Estimate: plan.valued
                                    }
                                })}
                                margin={{top: 5, right: 20, left: 20, bottom: 5}}
                            >
                                <XAxis dataKey="month"/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="Commercial" fill="#8884d8"/>
                                <Bar dataKey="Estimate" fill="#82ca9d"/>
                            </BarChart>
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

export default ProjectSoldTableRow