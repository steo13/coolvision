import { ArrowBackIosOutlined, ArrowForwardIosOutlined } from "@mui/icons-material";
import { IconButton, TextField, TextFieldProps } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs, { Dayjs } from "dayjs";

type Props = {
    previousMonth: Dayjs;
    initialMonth: Dayjs;
    nextMonth: Dayjs;
    onInitialMonthChange: (newType: Dayjs) => void;
};

const MonthSlider = ({previousMonth, initialMonth, nextMonth, onInitialMonthChange}: Props) => {
    return (
        <div className="row">
            <div className='col Plan-centerColumn'>
                <IconButton aria-label="previous" onClick={() => onInitialMonthChange(previousMonth)}>
                    <ArrowBackIosOutlined/>
                </IconButton>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        openTo="month"
                        views={['year', 'month']}
                        label="Month"
                        inputFormat="MM/yyyy"
                        value={initialMonth}
                        onChange={(date) => onInitialMonthChange(dayjs(date))}
                        renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField size='small' fullWidth {...params} helperText={null}/>}
                    />
                </LocalizationProvider>
                <IconButton aria-label="previous" onClick={() => onInitialMonthChange(nextMonth)}>
                    <ArrowForwardIosOutlined/>
                </IconButton>
            </div>
        </div>
    )
}

export default MonthSlider