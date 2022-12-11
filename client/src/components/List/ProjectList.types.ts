export interface Project {
    id: String
    name: String
    jira: String
}

export interface DaylyAreaChartData {
    hour: String,
    Project: number,
    AMS: number,
    Investment: number,
    Other: number,
}

export interface DaylyPieChartData {
    name: String,
    value: number
}

export interface ProjectWithSold {
    _id: String,
    name: String,
    jira: String,
    sold: ProjectSold[]
}

export interface ProjectSold {
    month: String,
    assignments: UserAssignment[]
}

export interface UserAssignment {
    _id_user: String
    assigned: number
}

export interface Worklog {
    month: String,
    worked: number,
    type: String
}

export interface DaylyWorklog {
    hour: String,
    worked: number,
    type: String
}

export interface CustomPieChartData {
    name: String
    commercial: number,
    valued: number
}

export interface Sold {
    _id_project: String,
    type: String,
    initial_month: String,
    final_month: String,
    total_valued: number,
    total_commercial: number,
    planning: Plan[]
}

export interface Plan {
    month: String,
    year: String,
    commercial: number | String,
    valued: number | String
}

export interface LineChartData {
    month: String,
    AMS: number,
    Project: number,
    Investment: number,
    Other: number
}