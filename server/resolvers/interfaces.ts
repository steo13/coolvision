interface AddProjectProps {
    name: String,
    jira: String
}

interface IdUserProps {
    id_user: String
}

interface UpdateProjectProps {
    id_project: String,
    name: string,
    jira: string
}

interface IdProjectProps {
    id_project: String
}

interface Planning {
    month: string,
    year: string,
    valued: number,
    commercial: number
}

interface AddSoldProps {
    soldInput: { 
        _id_project: string, 
        initial_month: string, 
        final_month: string, 
        type: string,
        planning: Planning[],
        total_valued: number,
        total_commercial: number
    }
}

interface UpdateAssignmentsProps {
    _id_project: string,
    month: string,
    assignments: {
        user: {_id: string, name: string, jira: string}, 
        assigned: number
    }[]
}

interface MonthProps {
    month: String
}

interface ProjectInformation {
    _id: String,
    name: String,
    jira: String
}

export type { 
    ProjectInformation,
    AddProjectProps, 
    UpdateProjectProps, 
    IdProjectProps, 
    UpdateAssignmentsProps, 
    Planning, 
    AddSoldProps, 
    MonthProps,
    IdUserProps
}