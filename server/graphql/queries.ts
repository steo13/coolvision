import { Assignment, Project, ProjectWithUsers, Sold, SoldTable, User } from './types'
import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { getAllProjects, getAllSolds, getAllUsers, getMonthAssignments, getProjectById, getSoldsByIdProject, getSoldsByMonth, getUserById } from '../resolvers/resolvers';
import { IdProjectProps, IdUserProps, MonthProps } from '../resolvers/interfaces';

const queries = new GraphQLObjectType({
    name: 'queries',
    fields: {
        getAllProjects: {
            type: new GraphQLList(Project),
            resolve: async () => {
                return getAllProjects()
            }
        },
        getProjectById: {
            type: ProjectWithUsers,
            args: {
                id_project: {type: GraphQLID}
            },
            resolve: async (_, args) => {
                return getProjectById(args as IdProjectProps)
            },
        },
        getAllSolds: {
            type: new GraphQLList(Sold),
            resolve: async () => {
                return getAllSolds()
            }
        },
        getSoldsByIdProject: {
            type: new GraphQLList(Sold),
            args: {
                id_project: {type: GraphQLID}
            },
            resolve: async (_, args) => {
                return getSoldsByIdProject(args as IdProjectProps)
            }
        },
        getSoldsByMonth: {
            type: new GraphQLList(SoldTable),
            args: {
                month: {type: GraphQLString}
            },
            resolve: async (_, args) => {
                return getSoldsByMonth(args as MonthProps)
            }
        },
        getAllUsers: {
            type: new GraphQLList(User),
            resolve: async () => {
                return getAllUsers()
            }
        },
        getUserById: {
            type: User,
            args: {
                id_user: {type: GraphQLID}
            },
            resolve: async (_, args) => {
                return getUserById(args as IdUserProps)
            }
        },
        getMonthAssignments: {
            type: new GraphQLList(Assignment),
            args: {
                month: {type: GraphQLString}
            },
            resolve: async (_, args) => {
                return getMonthAssignments(args as MonthProps)
            }
        }
    }
})

export { queries }