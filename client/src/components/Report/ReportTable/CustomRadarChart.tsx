import { useEffect, useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from "recharts";
import { CustomRadarChartData, SoldWorklogs } from "../Report.types";

interface Props {
    soldsIssues: SoldWorklogs[]
    typologies: String[]
}

function CustomRadarChart({soldsIssues, typologies}: Props) {
    const [data, setData] = useState<CustomRadarChartData[]>([])

    useEffect(() => {
        let data : CustomRadarChartData[] = []
        if (soldsIssues && typologies) {
            typologies.forEach(typo => {
                data.push({
                    type: typo,
                    commercial: soldsIssues
                        .map(soldIssue => {
                            return soldIssue.history
                                .filter(history => history.type === typo)
                                .map(history => history.commercial)
                                .reduce((commercial1, commercial2) => commercial1 + commercial2, 0)
                        })
                        .reduce((commercial1, commercial2) => Number((commercial1 + commercial2).toFixed(2)), 0),
                    worked: soldsIssues
                        .map(soldIssue => {
                            return soldIssue.history
                                .filter(history => history.type === typo)
                                .map(history => history.worked)
                                .reduce((worked1, worked2) => worked1 + worked2, 0)
                        })
                        .reduce((worked1, worked2) => Number((worked1 + worked2).toFixed(2)), 0)
                })
            })
            setData(data)
        }
    }, [soldsIssues, typologies])
      
    return (
        <ResponsiveContainer width='100%' height={250}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="type" />
                <PolarRadiusAxis angle={30} />
                <Radar name="Commercial" dataKey="commercial" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Worked" dataKey="worked" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                <Legend />
            </RadarChart>
        </ResponsiveContainer>
        
    )
}

export default CustomRadarChart;