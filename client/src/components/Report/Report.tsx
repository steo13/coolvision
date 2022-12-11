import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import ReportTable from "./ReportTable/ReportTable";
import MonthSlider from "../MonthSlider";
import Navbar from "../Navbar/Navbar";
import { FormControl, InputLabel, MenuItem, Paper, Select, Toolbar } from "@mui/material";

import './Report.css'

function Report() {
    const [loading, setLoading] = useState(true)
    const [initialMonth, setInitialMonth] = useState<Dayjs>(dayjs())
    const [previousMonth, setPreviousMonth] = useState<Dayjs>(dayjs())
    const [nextMonth, setNextMonth] = useState<Dayjs>(dayjs())
    const [selectedMonth, setSelectedMonth] = useState<string>()

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
        if (loading) {
            setNextMonth(computeNext())
            setPreviousMonth(computePrevious())
            setLoading(false)
        }
    }, [loading, computeNext, computePrevious, initialMonth])

    useEffect(() => {
        setNextMonth(computeNext())
        setPreviousMonth(computePrevious())
        setSelectedMonth('previous')
    }, [initialMonth, computeNext, computePrevious])
    
    return (
        <>
            {
                loading ?
                    <div>Loading ...</div>
                :
                    <Navbar element={
                        <>
                            <Toolbar/>
                            <div className="Report-tablesMonth">
                                <div className='row'>
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
                                            <ReportTable month={selectedMonth === 'previous' ? previousMonth : nextMonth} current={false}/>
                                        </Paper>
                                    </div>
                                    <div className="col-sm-8">
                                        <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', height: 880 }}>
                                            <MonthSlider previousMonth={previousMonth} initialMonth={initialMonth} nextMonth={nextMonth} onInitialMonthChange={setInitialMonth}/>
                                            <ReportTable month={initialMonth} current={true}/>
                                        </Paper>
                                    </div>
                                </div>
                            </div>
                        </>
                    }/>
            }
        </>   
    )
}

export default Report