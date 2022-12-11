import { useEffect, useState } from "react"
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, XAxis, Tooltip, YAxis } from "recharts"
import { ChartCustomData, SoldWorklogs } from "../Report.types"
import BarChartCustom from "./BarChartCustom"

interface Props {
    soldIssue: SoldWorklogs,
    typologies: string[]
}

function DoubleBarChartCustom({soldIssue, typologies}: Props) {
    const [data, setData] = useState<ChartCustomData[]>([])

    useEffect(() => {
        if (soldIssue && typologies) {
            let bars: any = {}
            typologies.forEach(typo => {
                bars[typo] = soldIssue.history
                                .filter(history => history.type === typo)
                                .map(history => history.commercial)
                                .reduce((commercial1, commercial2) => Number((commercial1+commercial2).toFixed(2)), 0) -
                            soldIssue.history
                                .filter(history => history.type === typo)
                                .map(history => history.worked)
                                .reduce((commercial1, commercial2) => Number((commercial1 + commercial2).toFixed(2)), 0)
            })
            setData([{
                name: 'Delta ' + soldIssue.project,
                AMS: bars['AMS'],
                Project: bars['Project'],
                Investment: bars['Investment'],
                Other: bars['Other']
            }])
        }
    }, [soldIssue, typologies])
    
    return (
        <>
            <div className='col-sm-5'><BarChartCustom soldIssue={soldIssue} typologies={typologies}/></div>
            <div className='col-sm-7'>
                <ResponsiveContainer width='100%' height={280}>
                    <BarChart barGap={20} data={data} margin={{ top: 22, right: 5, left: 5 }}>
                        <XAxis dataKey="name"/>
                        <YAxis domain={['dataMin - 30', 'dataMax + 30']}/>
                        <Tooltip/>
                        <ReferenceLine y={0} ifOverflow="extendDomain"/>
                        {
                            data?.map(entry => {
                                return (
                                    Object.keys(entry).filter(entry => entry!== 'name').map(e => {
                                        if (entry[e as keyof ChartCustomData] !== 0) 
                                            return (
                                                <Bar dataKey={e}
                                                    fill={entry[e as keyof ChartCustomData] >= 0 ? '#198754' : '#dc3545'}
                                                    label={(props) => { 
                                                        const {x, y, fill, value } = props; 
                                                        return (<text fontSize="12" x={x} y={value < 0 ? y+12 : y-5} fill={fill}>{e}/{value}</text>)
                                                    }}
                                                >
                                                    <YAxis height={400}/>
                                                    <Cell fill={entry[e as keyof ChartCustomData] >= 0 ? '#198754' : '#dc3545'}/>
                                                </Bar>
                                            )
                                        else
                                            return (
                                                <Bar dataKey={e}
                                                    fill={entry[e as keyof ChartCustomData] >= 0 ? '#198754' : '#dc3545'}
                                                >
                                                    <Cell fill={entry[e as keyof ChartCustomData] > 0 ? '#198754' : '#dc3545'}/>
                                                </Bar>
                                            )
                                    })
                                )
                            })
                        }
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default DoubleBarChartCustom