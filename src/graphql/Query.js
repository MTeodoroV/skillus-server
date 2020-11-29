import { gql } from "apollo-server";

export const queryType = gql`
    type Query {
        user(id: ID!): User
        users: [User]
        skill(id: ID!): Skill
        skills: [Skill]
        eu: User
        photos: [Photo]
        authenticationError: String
        readError: String
        problem(id: ID!): Problem
        problems: [Problem]
        problemsByUser(user_id: ID!): [Problem]
        ratings(user_id: ID!): [Rating]
        comments(problem_id: ID!): [Comment]
        comment(id: ID!): Comment
    }
`;
