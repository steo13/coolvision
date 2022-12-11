import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { AddProjectProps, AddSoldProps, UpdateAssignmentsProps, UpdateProjectProps } from "../resolvers/interfaces";
import { addProject, addSold, updateAssignments, updateProject } from "../resolvers/resolvers";
import { AssignedInputData, SoldInputData } from "./inputs";
import { Project, Sold } from "./types";

const mutations = new GraphQLObjectType({
    name: 'mutations',
    fields: {
        addProject: {
            type: Project,
            args: {
                name: {type: GraphQLString},
                jira: {type: GraphQLString}
            },
            resolve: async (_, args) => {
                return addProject(args as AddProjectProps)
            }
        },
        updateProject: {
            type: Project,
            args: {
                id_project: {type: GraphQLID},
                name: {type: GraphQLString},
                jira: {type: GraphQLString}
            },
            resolve: async (_, args) => {
                return updateProject(args as UpdateProjectProps)
            }
        },
        addSold: {
            type: Sold,
            args: {
                soldInput: {type: SoldInputData}
            },
            resolve: async (_, args) => {
                return addSold(args as AddSoldProps)
            }
        },
        updateAssignments: {
            type: Project,
            args: {
                _id_project: {type: GraphQLID},
                month: {type: GraphQLString},
                assignments: {type: new GraphQLList(AssignedInputData)}
            },
            resolve: async (_, args) => {
                return updateAssignments(args as UpdateAssignmentsProps)
            }
        },
    }
})

export { mutations }