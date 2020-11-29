import db from '../config/connection';

export const commentModel = {
	list(problemId) {
		const query = `SELECT * FROM problem_comment WHERE problem_id = ${problemId}`;
		return new Promise((resolve, reject) => {
			db.query(query, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	},

	new(text, problemId, senderId) {
		const query = `INSERT INTO problem_comment (text, date_creation, problem_id, user_id_sender) VALUES ('${text}', now(), ${problemId}, ${senderId})`;
		return new Promise((resolve, reject) => {
			db.query(query, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	},

	get(id) {
		return new Promise((resolve, reject) => {
			db.query(`SELECT * FROM problem_comment WHERE id = ${id}`, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result[0]);
				}
			});
		});
	},

	updateAsBestComment(id, isBest) {
		const query = `UPDATE problem_comment SET is_best_comment = ${isBest} WHERE id = ${id}`;

		return new Promise((resolve, reject) => {
			db.query(query, (error, result) => {
				if (error) {
                    console.log(error);
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	},

	newLike(comment_id, user_id) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO comment_upvotes(problem_comment_id, user_id)VALUES(${comment_id}, ${user_id})`;
            db.query(query, (error, result) => {
                if (error) {
					console.log(error);
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
	},

	getCommentLikes(comment_id) {
		return new Promise((resolve, reject) => {
			const query = `SELECT u.* FROM user u INNER JOIN comment_upvotes c ON c.user_id = u.id WHERE problem_comment_id = ${comment_id}`;
            db.query(query, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
	},

	deleteLike(comment_id, user_id) {
		const query = `DELETE FROM comment_upvotes WHERE problem_comment_id = ${comment_id} AND user_id = ${user_id};`;

        return new Promise((resolve, reject) => {
            db.query(query, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve (result);
                }
            });
        });
	}
};
