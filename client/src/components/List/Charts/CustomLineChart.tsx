import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis } from "recharts"
import { colors } from "../../../fakedata";
import { LineChartData, Worklog } from "../ProjectList.types";

interface Props {
    issues: Worklog[],
}

function CustomLineChart({issues}: Props) {
    const [data, setData] = useState<LineChartData[]>([])

    useEffect(() => {
        let data: LineChartData[] = []
        if (issues) {
            issues.forEach(issue => {
                if (!data.find(d => d.month === issue.month)) {
                    data.push({
                        month: issue.month,
                        Project: issue.type.toLowerCase().includes('project') ? Number((issue.worked).toFixed(2)) : 0,
                        AMS: issue.type.toLowerCase().includes('ams') ? Number((issue.worked).toFixed(2)) : 0,
                        Investment: issue.type.toLowerCase().includes('investment') ? Number((issue.worked).toFixed(2)) : 0,
                        Other: !issue.type.toLowerCase().includes('project') &&
                               !issue.type.toLowerCase().includes('ams') &&
                               !issue.type.toLowerCase().includes('investment') ? Number((issue.worked).toFixed(2)) : 0,
                    })                
                } else {
                    data = data.map(d => {
                        if (d.month === issue.month)
                            return {
                                month: issue.month,
                                AMS: issue.type ? issue.type.toLowerCase().includes('ams') ? Number((d.AMS + issue.worked).toFixed(2)) : d.AMS : d.AMS,
                                Project: issue.type ? issue.type.toLowerCase().includes('project') ? Number((d.Project + issue.worked).toFixed(2)) : d.Project : d.Project,
                                Investment: issue.type ? issue.type.toLowerCase().includes('investment') ? Number((d.Investment + issue.worked).toFixed(2)) : d.Investment : d.Investment,
                                Other: !issue.type.toLowerCase().includes('project') &&
                                       !issue.type.toLowerCase().includes('ams') &&
                                       !issue.type.toLowerCase().includes('investment') ? Number((d.Other + issue.worked).toFixed(2)) : 0,
                            }
                        return d
                    })
                }
            })
            setData(data)
        }
    }, [issues])
 
    return (
        <ResponsiveContainer className='mt-3' width="100%" height='100%'>
            <AreaChart data={data} margin={{left: 10, bottom: 10}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month" reversed/>
                <Tooltip/>
                <Legend/>
                <Area type="monotone" dataKey="Project" stackId="1" stroke={colors[0]} fill={colors[0]} fillOpacity={0.6}/>
                <Area type="monotone" dataKey="Investment" stackId="1" stroke={colors[1]} fill={colors[1]} fillOpacity={0.6}/>
                <Area type="monotone" dataKey="AMS" stackId="1" stroke={colors[2]} fill={colors[2]} fillOpacity={0.6}/>
                <Area type="monotone" dataKey="Other" stackId="1" stroke={colors[3]} fill={colors[3]} fillOpacity={0.6}/>
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default CustomLineChart