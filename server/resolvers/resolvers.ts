import { ProjectSchema } from '../schemas/project'
import { SoldSchema } from '../schemas/sold'
import { UserSchema } from '../schemas/user'
import { AddProjectProps, AddSoldProps, MonthProps, IdProjectProps, UpdateProjectProps, UpdateAssignmentsProps, IdUserProps, ProjectInformation } from './interfaces';

// MUTATION
// // PROJECT
const addProject = async function ({name, jira}: AddProjectProps) {
    const project = new ProjectSchema({
        name: name,
        jira: jira,
        sold: []
    });
    return await project.save();
}

const updateProject = async function ({id_project, name, jira}: UpdateProjectProps) {
    const project = await ProjectSchema.findById(id_project);
    if (!project)
        throw new Error('Project not found ...');
    project.name = name;
    project.jira = jira;
    return await project.save();
}

// // SOLD
const addSold = async function ({soldInput}: AddSoldProps) {
    const project = await ProjectSchema.findById(soldInput._id_project);
    if (!project) 
        throw new Error('Project not found ...');
    const sold = new SoldSchema({
        _id_project: soldInput._id_project,
        initial_month: soldInput.initial_month,
        final_month: soldInput.final_month,
        type: soldInput.type,
        planning: soldInput.planning,
        total_valued: soldInput.total_valued,
        total_commercial: soldInput.total_commercial
    })
    return await sold.save();
}

//QUERIES
// // PROJECT
const getAllProjects = async function () {
    return await ProjectSchema.find()
}

const getProjectById = async function ({id_project}: IdProjectProps) {
    const project = await ProjectSchema.findById(id_project);
    if (!project)
        throw new Error('Project not found ...');
    return {
        _id: project._id,
        name: project.name,
        jira: project.jira,
        sold: project.sold.map(sold => {
            return {
                month: sold.month,
                assignments: sold.assignments.map(assignment => {
                    return {
                        _id_user: assignment._id_user,
                        assigned: assignment.assigned
                    }
                })
            }
        })
    }
}

const updateAssignments = async function ({_id_project, month, assignments}: UpdateAssignmentsProps) {
    let project = await ProjectSchema.findById(_id_project)
    if (!project)
        throw new Error('Project not found')
    if (project.sold.find(sold => sold.month === month))
        project.sold.map(sold => {
            if (sold.month === month)
                sold.assignments = assignments.map(assignment => {
                    return {
                        _id_user: assignment.user._id,
                        assigned: assignment.assigned
                    }
                })
        })
    else {
        project.sold.push({
            month: month,
            assignments: assignments.map(assignment => {
                return {
                    _id_user: assignment.user._id,
                    assigned: assignment.assigned
                }
            })
        })
    }
    return await project.save()
}

const getMonthAssignments = async function({month}: MonthProps) {
    const projects = await ProjectSchema.find()
    let assignments: { _id_user: String; assigned: number; }[] = []
    projects.forEach(project => {
        project.sold.forEach(sold => {
            sold.assignments.forEach(assignment => {
                if (sold.month === month && !assignments.find(localass => localass._id_user === assignment._id_user))
                    assignments.push({
                        _id_user: assignment._id_user,
                        assigned: assignment.assigned
                    })
                else {
                    assignments.map(localassign => {
                        if (localassign._id_user === assignment._id_user)
                            localassign.assigned += assignment.assigned
                        return localassign
                    })
                }
            })
        })
    })
    return assignments
}

// // SOLD
const getAllSolds = async function () {
    return await SoldSchema.find()
}

const getSoldsByIdProject = async function ({id_project}: IdProjectProps) {
    const solds = await SoldSchema.find()
    return solds.filter(sold => sold._id_project === id_project)
}

const getSoldsByMonth = async function ({month}: MonthProps) {
    const solds = await SoldSchema.find()
    let soldsByMonth: { project: any, type: String; total_valued: number; total_commercial: number; }[] = []
    solds.forEach(sold => {
        sold.planning.forEach(plan => {
            if (plan.month === month.split("/")[0] && plan.year === month.split("/")[1])
                soldsByMonth.push(
                    {
                        project: getProjectInformationById({id: sold._id_project}),
                        type: sold.type,
                        total_valued: plan.valued,
                        total_commercial: plan.commercial
                    }
                )
        })
    })
    return soldsByMonth
}

interface Props {
    id: string
}

const getProjectInformationById = async function ({id}: Props) {
    const project = await ProjectSchema.findById(id);
    if (!project)
        throw new Error('Project not found ...');
    return {
        _id: project._id,
        name: project.name,
        jira: project.jira
    }
}

// USERS
const getAllUsers = async function () {
    return await UserSchema.find()
}

const getUserById = async function ({id_user}: IdUserProps) {
    return await UserSchema.findById(id_user)
}

export { 
    getAllProjects, 
    getProjectById, 
    getAllUsers, 
    getAllSolds, 
    getSoldsByIdProject, 
    getUserById, 
    getSoldsByMonth, 
    getMonthAssignments,
    addProject,
    updateProject,
    addSold,
    updateAssignments
}