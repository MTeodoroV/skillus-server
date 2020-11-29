import { gql } from "apollo-server";

export const commentType = gql`
    type Comment {
        id: ID
        text: String
        date_creation: String
        problem_id: ID
        sender: User
        likes: [User]
        is_best_comment: Boolean
    }

    type comment_upvote {
        comment_id: ID
        user_id: ID
    }
`;
