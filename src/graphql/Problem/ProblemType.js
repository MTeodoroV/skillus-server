import { gql } from "apollo-server";

export const problemType = gql`
    type Problem {
        id: ID
        name: String
        description: String
        date_creation: String
        date_close: String
        status: String
        creator: User
        helper: User
        color: String
        icon: String
        rating: Rating
        skill: [Skill]
        multi_response: Boolean
    }
`;
