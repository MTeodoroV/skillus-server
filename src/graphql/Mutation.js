import { gql } from "apollo-server";

export const mutationType = gql`
    type Mutation {
        register(
            name: String!
            email: String!
            password: String!
            telephone: String
            soma: Float
            description: String
            skill: [Int]
            contact: [String]
            photo: String
            ): Boolean
        updateProfile(
            id: ID!
            name: String
            email: String
            telephone: String
            description: String
            skill: [Int]
            contact: [String]
            photo: String
            user_status_id: Int
        ): Boolean
        lockProfile(id: ID!): Boolean
        login(email: String!, password: String!): LoginResponse
        createSkill(name: String, category_id: Int): Skill
        logout: Boolean
        createProblem(name: String, description: String, createdBy: Int, skill: [Int]): Problem
        addProblemHelper(problem_id: ID!, user_id: ID!): Problem
        removeProblemHelper(problem_id: ID!): Problem
        closeProblem(problem_id: ID, comment: String!, note: Float!): Problem
        addProblemComment(text: String, problem_id: ID, user_id_sender: ID): Comment
    }
`;
