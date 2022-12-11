import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Table, TableContainer, InputAdornment, OutlinedInput, TableHead, TableRow, TableCell, TableBody, FormControl, Button, FormLabel } from '@mui/material'
import { addSold } from '../../../../API';
import { Sold } from '../../ProjectList.types';
import { Dayjs } from 'dayjs';

interface Props {
    start: Dayjs,
    end: Dayjs,
    valued: number,
    commercial: number,
    type: String,
    handleClose: () => void
}

function SoldTable({start, end, valued, commercial, type, handleClose}: Props) {
    const { id } = useParams()
    const [text, setText] = useState<String>()
    const [sumCommercial, setSumCommercial] = useState(0)
    const [sumValued, setSumValued] = useState(0)
    const [sold, setSold] = useState<Sold>({
        _id_project: id as String, 
        type: type, 
        initial_month: start.format('MM/YYYY'),
        final_month: end.format('MM/YYYY'),
        total_valued: valued,
        total_commercial: commercial,
        planning: []
    })
    const months = Array(end.get('month') - start.get('month') + 12*(end.get('year') - start.get('year')) + 1).fill(0)
        .map((_, idx) => { 
            let date = start.add(idx, 'month')
            return { month: date.format('MM'), year: date.format('YYYY') }
        });
    const updatePlan = (value: number, month: String, year: String, commercial: boolean) => {
        const plan = [...sold.planning]
        if (plan.length === 0)
            plan.push({ month: month, year: year, commercial: commercial ? value : '', valued: !commercial ? value : '' })
        else {
            let check = false
            plan.map(plan => {
                if (plan.month === month && plan.year === year) {
                    if (commercial)
                        plan.commercial = value
                    else
                        plan.valued = value
                    check = true
                }
                return plan
            })
            if (!check)
                plan.push({ month: month, year: year, commercial: commercial ? value : '', valued: !commercial ? value : '' })
        }
        setSold({...sold, planning: plan})
    }

    useEffect(() => {
        if (start.format('MM/YYYY') !== sold.initial_month || end.format('MM/YYYY') !== sold.final_month ||
            type !== sold.type || valued !== sold.total_valued || commercial !== sold.total_commercial) {
            setSold({
                _id_project: id as String,
                planning: sold.planning.filter(p => 
                    Number(p.month) + Number(p.year) >= start.get('month')+1 + start.get('year') &&
                    Number(p.month) + Number(p.year) <= end.get('month')+1 + end.get('year')
                ),
                type: type,
                initial_month: start.format('MM/YYYY'),
                final_month: end.format('MM/YYYY'),
                total_valued: valued,
                total_commercial: commercial
            })
        }
    }, [id, commercial, valued, type, end, start, sold])

    useEffect(() => {
        let sum_commercial = 0
        let sum_valued = 0
        let check = true
        sold.planning.forEach(p => {
            sum_commercial += Number(p.commercial)
            sum_valued += Number(p.valued)
        })
        setSumValued(sum_valued)
        setSumCommercial(sum_commercial)
        months.forEach(m => {
            if (!sold.planning.find(p => p.month === m.month && p.year === m.year)) {
                check = false;
                return
            }
            if (sold.planning.find(p => p.valued === '' || p.commercial === '')) {
                check = false;
                return
            }
        })
        if (sum_commercial !== commercial || sum_valued !== valued) {
            if (sum_commercial !== commercial)
                setText(`The commercial total must be ${commercial} MD`)
            if (sum_valued !== valued)
                setText(`The estimate total must be ${valued} MD`)
        } else 
            if (commercial && valued)
                setText("")
        if (!type)
            setText('Select a project type')
        if (!check) 
            setText('All estimate and commercial cells must be filled')
    }, [sold.planning, months, commercial, valued, start, end, type])  

    const handleSubmit = () => {
        addSold(sold)
        handleClose()
        window.location.reload()
    }

    return (
        <>
            <div className='SoldTable-tableContainer'> 
                <TableContainer className='SoldTable-containerHeightTable'>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Month</TableCell>
                                <TableCell>Commercial</TableCell>
                                <TableCell>Estimate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            months.map((month, key) => {
                                return (
                                    <TableRow hover key={key}>
                                        <TableCell>{month.month}/{month.year}</TableCell>
                                        <TableCell>
                                            <FormControl fullWidth>
                                                <OutlinedInput type="number" placeholder="Commercial value"
                                                    value={sold.planning.find(plan => plan.month === month.month && plan.year === month.year) ?
                                                        sold.planning.find(plan => plan.month === month.month && plan.year === month.year)?.commercial : ""
                                                    }
                                                    size="small" 
                                                    startAdornment={<InputAdornment position="start">MD</InputAdornment>}
                                                    onChange={e => Number(e.target.value) < 0 ?
                                                        updatePlan(0, month.month, month.year, true) :
                                                        updatePlan(Number(e.target.value), month.month, month.year, true)
                                                    }
                                                />
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <FormControl fullWidth>
                                                <OutlinedInput placeholder="Estimate value" type="number"
                                                    value={sold.planning.find(plan => plan.month === month.month && plan.year === month.year) ?
                                                        sold.planning.find(plan => plan.month === month.month && plan.year === month.year)?.valued : ""                                          
                                                    }
                                                    size="small"  
                                                    startAdornment={<InputAdornment position="start">MD</InputAdornment>}
                                                    onChange={e => Number(e.target.value) < 0 ?
                                                        updatePlan(0, month.month, month.year, false) :
                                                        updatePlan(Number(e.target.value), month.month, month.year, false)
                                                    }
                                                />
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                        </TableBody>
                        <TableHead className="SoldTable-tableHeader">
                            <TableRow>
                                <TableCell>Total</TableCell>
                                {
                                    commercial ? 
                                        sumCommercial < commercial || !!text ? 
                                            <TableCell className='col-less'>{sumCommercial + ' / ' + commercial}</TableCell>
                                        : sumCommercial === Number(commercial) ?
                                            <TableCell className='col-equal'>{sumCommercial + ' / ' + commercial}</TableCell> 
                                        : 
                                            <TableCell className='col-greater'>{sumCommercial + ' / ' + commercial}</TableCell> 
                                    :
                                        <TableCell className='col-greater'>{sumCommercial} / ?</TableCell> 
                                }
                                {
                                    valued ? 
                                        sumValued < valued || !!text ?
                                            <TableCell className='col-less'>{sumValued + ' / ' + valued}</TableCell>
                                        : sumValued === Number(valued) ?
                                            <TableCell className='col-equal'>{sumValued + ' / ' + valued}</TableCell> 
                                        : 
                                            <TableCell className='col-greater'>{sumValued + ' / ' + valued}</TableCell> 
                                    :
                                        <TableCell className='col-greater'>{sumValued} / ?</TableCell> 
                                }
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </div>
            {
                text ? 
                    <div className="SoldTable-tableTextButton"><FormLabel className='mt-2'>{text}</FormLabel></div>
                : 
                    <FormLabel/>
            }
            <div className="SoldTable-footer">
                <Button className='mt-2' onClick={handleClose}>Close</Button>
                <Button color="success" disabled={!!text} className='mt-2' onClick={() => handleSubmit()}>Add</Button>
            </div>
        </>
    )
}   

export default SoldTable