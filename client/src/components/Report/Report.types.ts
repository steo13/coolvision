import { Dayjs } from "dayjs";

export interface workedVsSold {
    project: String,
    history: History[]
}

export interface workedVsSoldTableProps {
    month: Dayjs,
    workedVsSold: workedVsSold[],
    current: boolean
}

export interface ChartCustomData {
    name: String,
    AMS: number,
    Project: number,
    Investment: number,
    Other: number
}

export interface CustomRadarChartData {
    type: String,
    commercial: number,
    worked: number
}

export interface SoldWorklogs {
    project: String,
    jira: String,
    valid: boolean,
    history: History[]
}

export interface History {
    commercial: number,
    month: String,
    type: String,
    worked: number
}