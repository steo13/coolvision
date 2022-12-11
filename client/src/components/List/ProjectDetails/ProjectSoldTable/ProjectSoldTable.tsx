import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Sold } from "../../ProjectList.types";
import ProjectSoldTableRow from "./ProjectSoldTableRow";

interface Props {
    solds: Sold[]
}

function ProjectSoldTable({solds}: Props) {
    return (
        <TableContainer className='ProjectSoldTable-containerHeight'>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Start month</TableCell>
                        <TableCell>End month</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Commercial</TableCell>
                        <TableCell>Estimate</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        solds.map((sold, key) => {
                            return (<ProjectSoldTableRow key={key} sold={sold}/>)
                        })
                    }
                </TableBody>
                <TableHead className='ProjectSoldTable-tableHeader'>
                    <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell/>
                        <TableCell/>
                        <TableCell/>
                        <TableCell>
                            { solds.map(sold => sold.total_commercial).reduce((comm1, comm2) => comm1 + comm2, 0) }
                        </TableCell>
                        <TableCell>
                            { solds.map(sold => sold.total_valued).reduce((valued1, valued2) => valued1 + valued2, 0) }
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    )
}

export default ProjectSoldTable;