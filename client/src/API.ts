import { Dayjs } from 'dayjs';
import { Sold, Project, Worklog, ProjectWithSold, DaylyWorklog } from './components/List/ProjectList.types';
import { IntranetUser, MonthAssignment, SoldWithProject, User } from './components/Plan/Plan.types';
import { 
    getAllProjectsQuery, 
    getProjectByIdQuery, 
    addProjectQuery, 
    addSoldQuery, 
    getSoldsQuery,
    getSoldsByMonthQuery, 
    updateAssignmentsQuery, 
    getSoldsByIdProjectQuery, 
    getUsersQuery, 
    getUserByIdQuery, 
    getMonthAssignmentsQuery, 
    updateProjectQuery 
} from './Queries';

import env from './environment';

const serverEndpoint = `${env.server.scheme}://${env.server.host}:${env.server.port}`;

async function getJiraWorklogs(start: String, end: String, jira: String = "", type: String = ""): Promise<Worklog[] | DaylyWorklog[] | number>{
    return new Promise((res, rej) => {
        if (jira) {
            if (type)
                fetch(`${serverEndpoint}/worklogs?jira=${jira}&type=${type}&start=${start}&end=${end}`)
                    .then(resp => resp.json())
                    .then(issues => res(issues))
                    .catch(err => rej(err))
            else
                fetch(`${serverEndpoint}/worklogs?jira=${jira}&start=${start}&end=${end}`)
                .then(resp => resp.json())
                .then(issues => res(issues))
                .catch(err => rej(err))
        } else {
            if (type) {
                fetch(`${serverEndpoint}/worklogs?type=${type}&start=${start}&end=${end}`)
                    .then(resp => resp.json())
                    .then(issues => res(issues))
                    .catch(err => rej(err))
            } else
                fetch(`${serverEndpoint}/worklogs?start=${start}&end=${end}`)
                    .then(resp => resp.json())
                    .then(issues => res(issues))
                    .catch(err => rej(err))
        }
    })
}

async function getUsersHolidays(month: Dayjs) : Promise<any[]> {
    return new Promise((res, rej) => {
        fetch(`${serverEndpoint}/usersHolidays/${month.format('YYYY-MM')}`)
            .then(resp => resp.json())
            .then(holidays => res(holidays))
            .catch(err => rej(err))
    })
}

async function getUserByIdInIntranet(ids: Number[]) : Promise<IntranetUser[]> {
    return new Promise((res, rej) => {
        fetch(`${serverEndpoint}/usersByIdIn`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ids: ids}),
        })
        .then(resp => resp.json())
        .then(user => res(user))
        .catch(err => rej(err))
    })
}

const graphQlEndpoint = `${env.server.scheme}://${env.server.host}:${env.server.port}/graphql`

async function graphQlQuery(query: string): Promise<any> {
    return new Promise((res, rej) => {
        fetch(graphQlEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({query: query})
        })
        .then(resp => res(resp.json()))
        .catch(err => rej(err))
    })
}

async function getAllProjects(): Promise<ProjectWithSold[]> {
    return new Promise((res, rej) => {
        graphQlQuery(getAllProjectsQuery)
            .then(projects => res(projects['data']['getAllProjects']))
            .catch(err => rej(err))
    })
};

async function addProject(project: Project) {
    return new Promise((res, rej) => {
        graphQlQuery(addProjectQuery(project.name, project.jira))
            .then(_ => res("Progetto inserito correttamente ..."))
            .catch(err => rej(err));
    });
}

async function getProjectById(id: String): Promise<ProjectWithSold> {
    return new Promise((res, rej) => {
        graphQlQuery(getProjectByIdQuery(id))
            .then(project => res(project['data']['getProjectById']))
            .catch(err => rej(err));
    });
}

async function addSold(sold: Sold): Promise<Sold> {
    return new Promise((res, rej) => {
        graphQlQuery(addSoldQuery(sold))
            .then(sold => res(sold['data']['addSold']))
            .catch(err => rej(err));
    });
}

async function getSolds(): Promise<Sold[]> {
    return new Promise((res, rej) => {
        graphQlQuery(getSoldsQuery())
            .then(solds => res(solds['data']['getAllSolds']))
            .catch(err => rej(err));
    })
}

async function getSoldsByMonth(month: Dayjs): Promise<SoldWithProject[]> {
    return new Promise((res, rej) => {
        graphQlQuery(getSoldsByMonthQuery(month.format('MM/YYYY')))
            .then(solds => res(solds['data']['getSoldsByMonth']))
            .catch(err => rej(err));
    })
}

async function getSoldsByIdProject(id: String): Promise<Sold[]> {
    return new Promise((res, rej) => {
        graphQlQuery(getSoldsByIdProjectQuery(id))
            .then(solds => res(solds['data']['getSoldsByIdProject']))
            .catch(err => rej(err));
    })
}

async function getUsers(): Promise<User[]> {
    return new Promise((res, rej) => {
        graphQlQuery(getUsersQuery())
            .then(solds => res(solds['data']['getAllUsers']))
            .catch(err => rej(err));
    })
}

async function getUserById(id: String): Promise<User> {
    return new Promise((res, rej) => {
        graphQlQuery(getUserByIdQuery(id))
            .then(solds => res(solds['data']['getUserById']))
            .catch(err => rej(err));
    })
}

async function getMonthAssignments(month: String): Promise<MonthAssignment[]> {
    return new Promise((res, rej) => {
        graphQlQuery(getMonthAssignmentsQuery(month))
            .then(solds => res(solds['data']['getMonthAssignments']))
            .catch(err => rej(err));
    })
}

async function updateAssignments(id_project: String, month: String, assignments: any[]) {
    return new Promise((res, rej) => {
        graphQlQuery(updateAssignmentsQuery(id_project, month, assignments))
            .then(solds => res(solds['data']['updateAssignments']))
            .catch(err => rej(err));
    })
}

async function updateProject(id_project: String, name: String, jira: String): Promise<ProjectWithSold> {
    return new Promise((res, rej) => {
        graphQlQuery(updateProjectQuery(id_project, name, jira))
            .then(project => res(project['data']['updateProject']))
            .catch(err => rej(err));
    })
}

export { 
    getJiraWorklogs,
    getUserByIdInIntranet,
    getUsersHolidays,
    getAllProjects, 
    updateProject, 
    addProject, 
    getProjectById, 
    addSold, 
    getSolds, 
    getSoldsByMonth, 
    getSoldsByIdProject, 
    getUsers, 
    getUserById, 
    getMonthAssignments, 
    updateAssignments 
}
