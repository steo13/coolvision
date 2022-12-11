import { GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLString } from 'graphql';

const PlanningInputData = new GraphQLInputObjectType({
    name: 'PlanningInputData',
    fields: {
        month: {type: GraphQLString},
        year: {type: GraphQLString},
        valued: {type: GraphQLInt},
        commercial: {type: GraphQLInt}
    }
})

const SoldInputData = new GraphQLInputObjectType({
    name: 'SoldInputData',
    fields: {
        _id_project: {type: GraphQLID},
        initial_month: {type: GraphQLString},
        final_month: {type: GraphQLString},
        type: {type: GraphQLString},
        planning: {type: new GraphQLList(PlanningInputData)},
        total_valued: {type: GraphQLInt},
        total_commercial: {type: GraphQLInt}
    }
})

const UserInputData = new GraphQLInputObjectType({
    name: 'UserInputData',
    fields: {
        _id: {type: GraphQLID},
        name: {type: GraphQLString},
        photo: {type: GraphQLString}
    }
})

const AssignedInputData = new GraphQLInputObjectType({
    name: 'AssignedInputData',
    fields: {
        user: {type: UserInputData},
        assigned: {type: GraphQLInt}
    }
})

export { 
    SoldInputData, 
    AssignedInputData 
}