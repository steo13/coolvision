import { useEffect, useState } from "react"
import { BarChart, XAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts"
import { colors } from "../../../fakedata"
import { ChartCustomData, SoldWorklogs } from "../Report.types"

interface Props {
    soldIssue: SoldWorklogs,
    typologies: String[]
}

function BarChartCustom({soldIssue, typologies}: Props) {
    const [data, setData] = useState<ChartCustomData[]>() 

    useEffect(() => {
        let categories = ['Commercial', 'Worked']
        let data: ChartCustomData[] = []
        if (soldIssue && typologies) {
            categories.forEach(category => {
                data.push({
                    name: category,
                    AMS: soldIssue.history
                            .filter(history => history.type === "AMS")
                            .map(history => category === 'Commercial' ? history.commercial : history.worked)
                            .reduce((value1, value2) => Number((value1 + value2).toFixed(2)), 0),
                    Project: soldIssue.history
                                .filter(history => history.type === "Project")
                                .map(history => category === 'Commercial' ? history.commercial : history.worked)
                                .reduce((value1, value2) => Number((value1 + value2).toFixed(2)), 0),
                    Investment: soldIssue.history
                                    .filter(history => history.type === "Investment")
                                    .map(history => category === 'Commercial' ? history.commercial : history.worked)
                                    .reduce((value1, value2) => Number((value1 + value2).toFixed(2)), 0),
                    Other: soldIssue.history
                                .filter(history => history.type === "Other")
                                .map(history => category === 'Commercial' ? history.commercial : history.worked)
                                .reduce((value1, value2) => Number((value1 + value2).toFixed(2)), 0),
                })
            })
            setData(data)
        }
    }, [soldIssue, typologies])

    return (
        <ResponsiveContainer width='100%' height={300}>
            <BarChart data={data} margin={{ top: 20, right: 5, left: 5 }}>
                <XAxis dataKey="name" padding={{ left: 80, right: 70 }}/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="Project" stackId="a" fill={colors[0]}/>
                <Bar dataKey="Investment" stackId="a" fill={colors[1]}/>
                <Bar dataKey="AMS" stackId="a" fill={colors[2]}/>
                <Bar dataKey="Other" stackId="a" fill={colors[3]}/>
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarChartCustom