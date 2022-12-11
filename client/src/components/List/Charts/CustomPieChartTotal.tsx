import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Sector, Cell } from "recharts"
import { colors, soldTypologies } from "../../../fakedata";
import { CustomPieChartData, Sold } from "../ProjectList.types";

interface Props {
    solds: Sold[],
}

function CustomPieChartTotal({solds}: Props) {
    const [activeIndexCommercial, setActiveIndexCommercial] = useState(0)
    const [activeIndexValued, setActiveIndexValued] = useState(0)
    const [data, setData] = useState<CustomPieChartData[]>([])

    useEffect(() => {
        let data: CustomPieChartData[] = []
        if (solds) {
            solds.forEach(sold => {
                if (!data.find(d => d.name === sold.type))
                    data.push({ name: sold.type, commercial: sold.total_commercial, valued: sold.total_valued })
                else 
                    data = data.map(data => {
                        if (data.name === sold.type)
                            return {
                                name: sold.type,
                                commercial: sold.total_commercial + data.commercial,
                                valued: sold.total_valued + data.valued
                            }
                        else
                            return data
                    })  
            })
            setData(data)
        }
    }, [solds])

    const renderActiveShape = (props: { cx: any; cy: any; midAngle: any; innerRadius: any; outerRadius: any; startAngle: any; endAngle: any; fill: any; payload: any; percent: any; value: any; }) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
      
        return (
            <g>
                <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill}>{payload.name}</text>
                <text x={cx} y={cy} dy={10} textAnchor={"middle"} fill="#333">{`${value}`}</text>
                <text x={cx} y={cy} dy={30} textAnchor={"middle"} fill="#999">{`${(percent * 100).toFixed(2)}%`}</text>
                <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill}/>
                <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill}/>
            </g>    
        );
    };

    return (
        <>
            <div className='col-sm-6 justify-content-center'>
                <div className='grid justify-content-center'>
                    <Table className='mt-1' size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Commercial</TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                soldTypologies.filter(type => type !== 'Other').map((type, key) => {
                                    return (
                                        <TableRow key={key}>
                                            <TableCell>{data.find(data => data.name === type) ? data.find(data => data.name === type)?.commercial : 0}</TableCell>
                                            <TableCell>{type}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                    <ResponsiveContainer width="100%" height={230}>
                        <PieChart>
                            <Pie
                                activeIndex={activeIndexCommercial}
                                activeShape={(props) => renderActiveShape(props)}
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={80}
                                dataKey="commercial"
                                onMouseEnter={(_, index) => setActiveIndexCommercial(index)}
                            >
                                {
                                    data?.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
                                    ))
                                }
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className='col-sm-6 justify-content-center'>
                <div className='grid justify-content-center'>
                    <Table className='mt-1' size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Estimate</TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                soldTypologies.filter(type => type !== 'Other').map((type, key) => {
                                    return (
                                        <TableRow key={key}>
                                            <TableCell>{data.find(data => data.name === type) ? data.find(data => data.name === type)?.valued : 0}</TableCell>
                                            <TableCell>{type}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                    <ResponsiveContainer width="100%" height={230}>
                        <PieChart>
                            <Pie
                                activeIndex={activeIndexValued}
                                activeShape={(props) => renderActiveShape(props)}
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={80}
                                dataKey="valued"
                                onMouseEnter={(_, index) => setActiveIndexValued(index)}
                            >
                                {
                                    data?.map((_, index) => (
                                        <Cell key={`cell3-${index}`} fill={colors[index % colors.length]} />
                                    ))
                                }
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}

export default CustomPieChartTotal