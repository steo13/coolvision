import { useEffect, useState } from "react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { SoldWithProject, ValuedRadarChartData } from "../Plan.types";

interface Props {
    originalSold: SoldWithProject[],
    typologies: String[]
}

function ValuedRadarChart({originalSold, typologies}: Props) {
    const [data, setData] = useState<ValuedRadarChartData[]>([])

    useEffect(() => {
        let data: ValuedRadarChartData[] = []
        if (originalSold && typologies) {
            typologies.filter(type => type !== 'Other').forEach(typo => {
                data.push({
                    type: typo,
                    commercial: originalSold.filter(originalSold => originalSold.type === typo)
                        .map(originalSold => originalSold.total_commercial)
                        .reduce((originalSold1, originalSold2) => originalSold1 + originalSold2, 0),
                    valued: originalSold.filter(originalSold => originalSold.type === typo)
                        .map(originalSold => originalSold.total_valued)
                        .reduce((originalSold1, originalSold2) => originalSold1 + originalSold2, 0)
                })
            })
            setData(data)
        }
    }, [originalSold, typologies])

    return (
        <ResponsiveContainer width='100%' height={220}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="type" />
                <PolarRadiusAxis angle={30} />
                <Radar name="Commercial" dataKey="commercial" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Estimate" dataKey="valued" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Legend />
            </RadarChart>
        </ResponsiveContainer>
    )
}

export default ValuedRadarChart;