import { Sold } from "./components/List/ProjectList.types"

const getAllProjectsQuery = 
    `{
        getAllProjects {
            _id, 
            name, 
            jira,
            sold {month, assignments {_id_user, assigned}}
        }
    }`

const addProjectQuery = (name: String | undefined, jira: String | undefined) => {
    return (
        `mutation {
            addProject (name: "${name}", jira: "${jira}") {
                _id, 
                name, 
                jira,
                sold {month, assignments {_id_user, assigned}}
            }
        }`
    )
}

const updateProjectQuery = (id_project: String, name: String, jira: String) => {
    return (
        `mutation {
            updateProject (id_project: "${id_project}", name: "${name}", jira: "${jira}") {
                _id,
                name,
                jira,
                sold {month, assignments{_id_user, assigned}}
            }
        }`
    )
}

const getProjectByIdQuery = (id: String) => {
    return (
        `{
            getProjectById (id_project: "${id}") {
                _id, 
                name, 
                jira,
                sold {month, assignments {_id_user, assigned}}
            }
        }`
    )
}

const getSoldsByIdProjectQuery = (id_project: String) => {
    return (
        `{
            getSoldsByIdProject(id_project: "${id_project}") {
                _id, 
                _id_project, 
                initial_month, 
                final_month, 
                type, 
                planning {month, year, valued, commercial}, 
                total_commercial, 
                total_valued
            }
        }`
    )
}

const addSoldQuery = (sold: Sold) => {
    return (
        `mutation {
            addSold (soldInput: {
                _id_project: "${sold._id_project}",
                type: "${sold.type}",
                initial_month: "${sold.initial_month}",
                final_month: "${sold.final_month}",
                total_valued: ${sold.total_valued},
                total_commercial: ${sold.total_commercial},
                planning: [
                    ${sold.planning.map(p =>
                        `{ 
                            month: "${p.month}",
                            year: "${p.year}",
                            valued: ${p.valued},
                            commercial: ${p.commercial}
                        }`
                    ).join(",")}
                ]
            }) {
                _id,
                _id_project,
                initial_month, 
                final_month, 
                type, 
                total_valued, 
                total_commercial, 
                planning {month, year, commercial, valued}
            }
        }`
    )
}

const updateSoldQuery = (sold: Sold) => {
    return (
        `mutation {
            updateSold (soldInput: {
                _id_project: "${sold._id_project}",
                type: "${sold.type}",
                initial_month: "${sold.initial_month}",
                final_month: "${sold.final_month}",
                total_valued: ${sold.total_valued},
                total_commercial: ${sold.total_commercial},
                planning: [
                    ${sold.planning.map(p =>
                        `{ 
                            month: "${p.month}",
                            year: "${p.year}",
                            valued: ${p.valued},
                            commercial: ${p.commercial}
                        }`
                    ).join(",")}
                ]
            }) {
                _id,
                project {_id, name, jira},
                initial_month, 
                final_month, 
                type, 
                total_valued, 
                total_commercial, 
                planning {month, year, commercial, valued}
            }
        }`
    )
}

const getSoldsQuery = () => {
    return (
        `{
            getAllSolds {
                _id, 
                _id_project, 
                initial_month, 
                final_month, 
                type, 
                planning {month, year, valued, commercial},
                total_valued, 
                total_commercial
            }
        }`
    )
}

const getSoldsByMonthQuery = (month: String) => {
    return (
        `{
            getSoldsByMonth(month: "${month}") {
                project{_id, name, jira},
                type,
                total_valued,
                total_commercial
            }
        }`
    )
}

const getUsersQuery = () => {
    return (
        `{
            getAllUsers {
                _id,
                name,
                role
            }
        }`
    )
}

const getUserByIdQuery = (id: String) => {
    return (
        `{
            getUserById(id: "${id}") {
                _id,
                name,
                role
            }
        }`
    )
}

const getMonthAssignmentsQuery = (month: String) => {
    return (
        `{
            getMonthAssignments(month: "${month}") {
                _id_user, 
                assigned
            }
        }`
    )
}

const updateAssignmentsQuery = (id_project: String, month: String, assignments: any[]) => {
    return (
        `mutation {
            updateAssignments(_id_project: "${id_project}", month: "${month}", assignments: 
                [
                    ${assignments.map(assignment => 
                        `{
                            user: {
                                _id: "${assignment.user.id}",
                                name: "${assignment.user.name}",
                                photo: "${assignment.user.photo}"
                            },
                            assigned: ${assignment.assigned}
                        }` 
                    ).join(',')}
                ]
            ) {
                _id,
                name,
                jira,
                sold {month, assignments{_id_user, assigned}}
            }
        }`
    )
}

export { 
    getAllProjectsQuery, 
    updateProjectQuery,
    addProjectQuery, 
    getProjectByIdQuery, 
    getSoldsByIdProjectQuery, 
    getMonthAssignmentsQuery, 
    addSoldQuery, 
    updateAssignmentsQuery, 
    getSoldsQuery, 
    getSoldsByMonthQuery, 
    updateSoldQuery, 
    getUsersQuery, 
    getUserByIdQuery 
}