export interface User {
    _id: String,
    name: String,
    holidays: number,
    photo: String,
    role: String
}

export interface Sold {
    _id_project: String,
    total_commercial: number,
    total_valued: number
}

export interface SoldWithProject {
    project: {_id: String, name: String, jira: String},
    type: String,
    total_valued: number
    total_commercial: number
}

export interface MonthAssignment {
    _id_user: String,
    assigned: number
}

export interface Assignment {
    user: { id: String, name: String, photo: String, role: String }
    assigned: number
}

export interface SoldAssignment {
    month: String,
    assignments: UserAssignment[]
}

export interface UserAssignment {
    _id_user: String
    assigned: number
}

export interface ValuedRadarChartData {
    type: String,
    commercial: number
    valued: number
}

export interface IntranetUser {
    id: Number,
    firstName: String,
    lastName: String,
    googleProfilePhoto: String,
    role: String,
}