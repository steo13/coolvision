import { LinearProgress, Typography } from "@mui/material";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { getJiraWorklogs } from "../../../API";
import { colors } from "../../../fakedata";
import { DaylyAreaChartData, DaylyWorklog } from "../ProjectList.types";

function DaylyAreaChart () {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<DaylyAreaChartData[]>([])

    useEffect(() => {
        let data: DaylyAreaChartData[] = []
        getJiraWorklogs(dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')).then(worklogs => {
            (worklogs as DaylyWorklog[]).forEach(worklog => {
                if (!data.find(d => d.hour === worklog.hour)) {
                    data.push({
                        hour: worklog.hour,
                        Project: worklog.type.toLowerCase().includes('project') ? Number(worklog.worked.toFixed(2)) : 0,
                        AMS: worklog.type.toLowerCase().includes('ams') ? Number(worklog.worked.toFixed(2)) : 0,
                        Investment: worklog.type.toLowerCase().includes('investment') ? Number(worklog.worked.toFixed(2)) : 0,
                        Other: !worklog.type.toLowerCase().includes('project') &&
                               !worklog.type.toLowerCase().includes('ams') &&
                               !worklog.type.toLowerCase().includes('investment') ? Number(worklog.worked.toFixed(2)) : 0,
                    })
                } else {
                    data = data.map(d => {
                        if (d.hour === worklog.hour)
                            return {
                                hour: worklog.hour,
                                AMS: worklog.type ? worklog.type.toLowerCase().includes('ams') ? Number((d.AMS + worklog.worked).toFixed(2)) : d.AMS : d.AMS,
                                Project: worklog.type ? worklog.type.toLowerCase().includes('project') ? Number((d.Project + worklog.worked).toFixed(2)) : d.Project : d.Project,
                                Investment: worklog.type ? worklog.type.toLowerCase().includes('investment') ? Number((d.Investment + worklog.worked).toFixed(2)) : d.Investment : d.Investment,
                                Other: !worklog.type.toLowerCase().includes('project') &&
                                       !worklog.type.toLowerCase().includes('ams') &&
                                       !worklog.type.toLowerCase().includes('investment') ? Number((d.Other + worklog.worked).toFixed(2)) : 0,
                            }
                        else
                            return d
                    })
                }
            })
            setData(data.sort((data1, data2) => (data1.hour < data2.hour) ? 1 : -1))
            setLoading(false)
        }).catch(_ => setLoading(true))
    }, [])

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="#012b59" gutterBottom>Today worklogs</Typography>
            {
                loading ?
                    <LinearProgress color="success"/>
                :
                    <ResponsiveContainer>
                        <AreaChart data={data} margin={{top: 16, right: 16, bottom: 0, left: 24}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="hour" reversed/>
                            <Tooltip/>
                            <Legend/>
                            <Area type="monotone" dataKey="Project" stackId="1" stroke={colors[0]} fill={colors[0]} fillOpacity={0.6}/>
                            <Area type="monotone" dataKey="Investment" stackId="1" stroke={colors[1]} fill={colors[1]} fillOpacity={0.6}/>
                            <Area type="monotone" dataKey="AMS" stackId="1" stroke={colors[2]} fill={colors[2]} fillOpacity={0.6}/>
                            <Area type="monotone" dataKey="Other" stackId="1" stroke={colors[3]} fill={colors[3]} fillOpacity={0.6}/>
                        </AreaChart>
                    </ResponsiveContainer>
            } 
        </React.Fragment>
    )
}

export default DaylyAreaChart;