import { useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import ValuedTable from "./ValuedTable/ValuedTable";
import MonthSlider from "../MonthSlider";
import Navbar from "../Navbar/Navbar";
import { FormControl, InputLabel, MenuItem, Paper, Select, Toolbar } from "@mui/material";

import './Plan.css'

function Plan() {
    const [initialMonth, setInitialMonth] = useState<Dayjs>(dayjs())
    const [previousMonth, setPreviousMonth] = useState<Dayjs>(dayjs())
    const [selectedMonth, setSelectedMonth] = useState<string>()
    const [nextMonth, setNextMonth] = useState<Dayjs>(dayjs())

    const computePrevious = useCallback(() => {
        return initialMonth.get('month') === 0 ?
            dayjs().set('month', initialMonth.get('month')-1).set('year', initialMonth.get('year')-1)
        :
            dayjs().set('month', initialMonth.get('month')-1).set('year', initialMonth.get('year'))
    }, [initialMonth])

    const computeNext = useCallback(() => {
        return initialMonth.get('month') === 11 ?
            dayjs().set('month', initialMonth.get('month')+1).set('year', initialMonth.get('year')+1)
        :
            dayjs().set('month', initialMonth.get('month')+1).set('year', initialMonth.get('year'))
    }, [initialMonth])

    useEffect(() => {
        setNextMonth(computeNext())
        setPreviousMonth(computePrevious())
        setSelectedMonth('previous')
    }, [computeNext, computePrevious, initialMonth])

    return (
        <Navbar element={
            <>
                {
                    previousMonth && nextMonth && selectedMonth && initialMonth ?
                        <>
                            <Toolbar/>
                            <div className="Plan-tablesMonth">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: 880 }}>
                                            <div className='row justify-content-center'>
                                                <FormControl sx={{ m: 1, width: 250 }} size="small">
                                                    <InputLabel id="demo-select-small">History</InputLabel>
                                                    <Select 
                                                        labelId="demo-select-small" id="demo-select-small" 
                                                        value={selectedMonth ? selectedMonth : ""} 
                                                        label="History" 
                                                        onChange={(e) => e.target.value === 'previous' ? setSelectedMonth('previous') : setSelectedMonth('next')}>
                                                            <MenuItem value={'previous'}>{previousMonth.format('MMMM YYYY')}</MenuItem>
                                                            <MenuItem value={'next'}>{nextMonth.format('MMMM YYYY')}</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <ValuedTable month={selectedMonth === 'previous' ? previousMonth : nextMonth} current={false}/>
                                        </Paper>
                                    </div>
                                    <div className="col-sm-8">
                                        <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: 880 }}>
                                            <MonthSlider previousMonth={previousMonth} initialMonth={initialMonth} nextMonth={nextMonth} onInitialMonthChange={setInitialMonth}/>
                                            <ValuedTable month={initialMonth} current={true}/>
                                        </Paper>
                                    </div>
                                </div>
                            </div>
                        </> 
                    : <></>
                }
            </>
        }/>
    )
}

export default Plan;