import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

const Assignment = new GraphQLObjectType({
    name: 'Assignment',
    fields: {
        _id_user: {type: GraphQLID},
        assigned: {type: GraphQLInt}
    }
})

const Assignments = new GraphQLObjectType({
    name: 'Assignments',
    fields: {
        month: {type: GraphQLString},
        assignments: {type: new GraphQLList(Assignment)}
    }
})

const Project = new GraphQLObjectType({
    name: 'Project',
    fields: {
        _id: {type: GraphQLID},
        name: {type: GraphQLString},
        jira: {type: GraphQLString},
        sold: {type: new GraphQLList(Assignments)}
    }
})

const User = new GraphQLObjectType({
    name: 'User',
    fields: {
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
        role: {type: GraphQLString},
    }
})

const AssignmentWithUser = new GraphQLObjectType({
    name: 'AssignmentWithUser',
    fields: {
        _id_user: {type: GraphQLString},
        assigned: {type: GraphQLInt}
    }
})

const AssignmentsWithUsers = new GraphQLObjectType({
    name: 'AssignmentsWithUsers',
    fields: {
        month: {type: GraphQLString},
        assignments: {type: new GraphQLList(AssignmentWithUser)}
    }
})

const ProjectWithUsers = new GraphQLObjectType({
    name: 'ProjectWithUsers',
    fields: {
        _id: {type: GraphQLID},
        name: {type: GraphQLString},
        jira: {type: GraphQLString},
        sold: {type: new GraphQLList(AssignmentsWithUsers)}
    }
})

const Planning = new GraphQLObjectType({
    name: 'Planning',
    fields: {
        month: {type: GraphQLString},
        year: {type: GraphQLString},
        valued: {type: GraphQLInt},
        commercial: {type: GraphQLInt}
    }
})

const Sold = new GraphQLObjectType({
    name: 'Sold',
    fields: {
        _id: {type: GraphQLID},
        _id_project: {type: GraphQLString},
        initial_month: {type: GraphQLString},
        final_month: {type: GraphQLString},
        type: {type: GraphQLString},
        planning: {type: new GraphQLList(Planning)},
        total_valued: {type: GraphQLInt},
        total_commercial: {type: GraphQLInt}
    }
})

const ProjectInformation = new GraphQLObjectType({
    name: 'ProjectInformation',
    fields: {
        _id: {type: GraphQLString},
        name: {type: GraphQLString},
        jira: {type: GraphQLString}
    }
})

const SoldTable = new GraphQLObjectType({
    name: 'SoldTable',
    fields: {
        project: {type: ProjectInformation},
        type: {type: GraphQLString},
        total_valued: {type: GraphQLInt},
        total_commercial: {type: GraphQLInt}
    }
})

export { 
    Project, 
    ProjectWithUsers, 
    SoldTable,
    Sold,  
    User, 
    Assignment 
} 