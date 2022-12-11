import { CircularProgress, LinearProgress, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { getJiraWorklogs } from "../../../API";
import { colors } from "../../../fakedata";
import { DaylyPieChartData, Worklog } from "../ProjectList.types";

function DaylyPieChart () {
    const [total, setTotal] = useState<string>()
    const [data, setData] = useState<DaylyPieChartData[]>()
    const [activeIndex, setActiveIndex] = useState(0)

    useEffect(() => {
        let data: DaylyPieChartData[] = []
        getJiraWorklogs(dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')).then(worklogs => {
            let total = (worklogs as Worklog[]).map(worklog => worklog.worked).reduce((worked1, worked2) => worked1 + worked2).toFixed(2)
            setTotal(total+" MD");
            (worklogs as Worklog[]).forEach(worklog => {
                if (!data.find(d => d.name === worklog.type))
                    data.push({
                        name: worklog.type,
                        value: worklog.worked,
                    })
                else 
                    data = data.map(data => {
                        if (data.name === worklog.type)
                            return {
                                name: worklog.type,
                                value: Number((data.value + worklog.worked).toFixed(2))
                            }
                        else
                            return data
                    })
            })
            setData(data)
        })
    }, [])

    const renderActiveShape = (props: { cx: any; cy: any; midAngle: any; innerRadius: any; outerRadius: any; startAngle: any; endAngle: any; fill: any; payload: any; percent: any; value: any; }) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
      
        return (
            <g>
                <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#333">{`${value}`}</text>
                <text x={cx} y={cy} dy={10} textAnchor="middle" fill={fill}>{payload.name}</text>
                <text x={cx+3} y={cy} dy={31} textAnchor="middle" fill="#999">{`${(percent * 100).toFixed(2)}%`}</text>
                <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill}/>
                <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill}/>
            </g>    
        );
    };

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="#012b59" gutterBottom>Today stats</Typography>
            <Typography component="p" variant="h5">
                {total ? total : <CircularProgress color="success"/>}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>on {dayjs().format('DD MMMM YYYY')}</Typography>
            <ResponsiveContainer width="100%" height={155}>
                {
                    data ?  
                        <PieChart>
                            <Pie 
                                activeIndex={activeIndex}
                                activeShape={(props) => renderActiveShape(props)}
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={65}
                                dataKey="value"
                                onMouseEnter={(_, index) => setActiveIndex(index)}
                            >
                                {
                                    data?.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
                                    ))
                                }
                            </Pie>
                        </PieChart>  
                    : 
                        <LinearProgress color="success"/>
                }
            </ResponsiveContainer>
        </React.Fragment>
    )
}

export default DaylyPieChart;