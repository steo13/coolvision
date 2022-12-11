import { useState } from 'react'
import SoldTable from './SoldTable'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, FormControl, Input, InputAdornment, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField, TextFieldProps } from '@mui/material'
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface Props {
    open: boolean,
    handleClose: () => void
}

function SoldForm({open, handleClose}: Props) {
    const [totalValued, setTotalValued] = useState<number>()
    const [totalCommercial, setTotalCommercial] = useState<number>()
    const [type, setType] = useState<string>()
    const [initialMonth, setInitialMonth] = useState<Dayjs>(dayjs())
    const [finalMonth, setFinalMonth] = useState<Dayjs>(dayjs())

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="SoldForm-box">
                <div className="row justify-content-center SoldForm-row">
                    <FormControl fullWidth variant="standard">
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            value={type ? type : ""}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Type"
                            onChange={(e: SelectChangeEvent) => setType(e.target.value)}
                        >
                            <MenuItem value={"AMS"}>AMS</MenuItem>
                            <MenuItem value={"Project"}>Project</MenuItem>
                            <MenuItem value={"Investment"}>Investment</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="row mt-3 justify-content-center SoldForm-row">
                    <FormControl className='custom-formControl' fullWidth variant="standard">
                        <InputLabel>Commercial total</InputLabel>
                        <Input 
                            value={totalCommercial ? totalCommercial : ""}
                            type="number"
                            placeholder="Value"
                            size="small" 
                            startAdornment={<InputAdornment position="start">MD</InputAdornment>}
                            onChange={e => Number(e.target.value) > 0 ? setTotalCommercial(Number(e.target.value)) : setTotalCommercial(0)}
                        />
                    </FormControl>
                </div>
                <div className="row mt-3 justify-content-center SoldForm-row">
                    <FormControl fullWidth className='custom-formControl' variant="standard">
                        <InputLabel>Estimate total</InputLabel>
                        <Input 
                            value={totalValued ? totalValued : ""}
                            type="number"
                            placeholder="Value"
                            size="small" 
                            startAdornment={<InputAdornment position="start">MD</InputAdornment>}
                            onChange={e => Number(e.target.value) > 0 ? setTotalValued(Number(e.target.value)) : setTotalValued(0)}
                        />
                    </FormControl>
                </div>
                <div className="mt-3 row justify-content-center SoldForm-row">
                    <LocalizationProvider dateAdapter={AdapterDateFns} >
                        <DatePicker
                            openTo='month'
                            views={['year', 'month']}
                            label="Start month"
                            inputFormat="MM/yyyy"
                            maxDate={finalMonth}
                            value={initialMonth ? initialMonth : ''}
                            onChange={date => setInitialMonth(dayjs(date))}
                            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField size="small" {...params} error={false} helperText={null}/>}
                        />
                    </LocalizationProvider>
                </div>
                <div className="mt-3 row justify-content-md-center SoldForm-row">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            openTo='month'
                            views={['year', 'month']}
                            inputFormat="MM/yyyy"
                            label="End month"
                            minDate={initialMonth}
                            value={finalMonth ? finalMonth : ''}
                            onChange={date => setFinalMonth(dayjs(date))}
                            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField size='small' {...params} error={false} helperText={null}/>}
                        />
                    </LocalizationProvider>
                </div>
                {
                    finalMonth && initialMonth ?
                        <SoldTable handleClose={handleClose} start={initialMonth} end={finalMonth} valued={totalValued as number} commercial={totalCommercial as number} type={type as String}/>
                    : 
                        <></>
                }
            </Box>
        </Modal>
    )
}

export default SoldForm
