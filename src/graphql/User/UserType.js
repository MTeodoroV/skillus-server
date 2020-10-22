import { gql } from "apollo-server";

export const userType = gql`
    type User {
        id: ID
        name: String
        email: String
        telephone: String
        date_creation: String
        status: String
        soma: Float
        description: String
        photo: String
        skill: [Skill]
        contact: [Contact]
        type: String
    }
`;

export const photoType = gql`
    type Photo {
        id: ID
        url: String
    }
`;