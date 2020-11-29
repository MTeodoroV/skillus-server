import { commentModel } from '../../models/CommentModel';
import { userModel } from '../../models/UserModel';
import { problemModel } from '../../models/ProblemModel';

export const commentResolver = {
	Query: {
		comments(_, args, context) {
			return commentModel.list(args.problem_id);
		},

		comment(_, args, context) {
			return commentModel.get(args.id);
		}
	},

	Mutation: {
		async addProblemComment(_, args, context) {
			if(!await problemModel.verify(args.problem_id, args.user_id_sender)){
				return new Error('Erro ao tentar adicionar comentário!')
			}
			const response = await commentModel.new(args.text, args.problem_id, args.user_id_sender);
			
			if (response.affectedRows > 0) {
				return args;
			}
			return new Error('Erro ao tentar adicionar comentário!')
		},

		async isBestComment(_, args, context) {
			const response = await commentModel.updateAsBestComment(args.id, args.value);
			
			if (response.affectedRows > 0) {
				return args;
			}
			return new Error('Erro ao tentar alterar status do comentário!')
		},

		async likeComment(_, args) {
			const response = await commentModel.newLike(args.comment_id, args.user_id);
			if (response.affectedRows > 0) {
				return args;
			}
			return new Error('Erro ao tentar alterar status do comentário!')
		},

		async unlike(_, args) {
			const response = await commentModel.deleteLike(args.comment_id, args.user_id);
			if (response.affectedRows > 0) {
				return args;
			}
			return new Error('Erro ao tentar alterar status do comentário!')
		}
	},

	Comment: {

		likes(parent) {
			return commentModel.getCommentLikes(parent.id)
		},

		sender(parent, context, args) {
			return userModel.get(parent.user_id_sender);
		}
	},
};
