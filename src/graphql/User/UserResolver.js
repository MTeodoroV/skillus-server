import { userModel } from "../../models/UserModel";
import { ratingModel } from "../../models/ratingModel";
import { AuthModel } from "../../models/AuthModel";

export const userResolver = {
    Query: {
        async eu(_, __, context) {
            const result = await AuthModel.getMyUser(context);

            if (!result) {
                return new Error("Usuario nao encontrado");
            }
            return result;
        },
        users() {
            return userModel.all();
        },
        async user(_, args) {
            const result = await userModel.get(args.id);

            if (!result) {
                return new Error("Usuario nao encontrado");
            }
            return result;
        },
    },

    Mutation: {
        async register(_, args) {
            try {
                const photo = await userModel.selectRandomPhoto();
                const response = await userModel.register(
                    args.name,
                    args.email,
                    args.password,
                    args.telephone,
                    args.description,
                    photo.url
                );
                await userModel.newUserContact(response.insertId, args.contact);
                await userModel.newUserSkill(response.insertId, args.skill);
            } catch (error) {
                console.log(error);
                return false;
            }

            return true;
        },

        //async newUpdateSkillEnding(_, args){
          //  try{
            /*    const endPoint = await userModel.insertUserSkillEndingPoint(
                    args.user_id,
                    args.skill_id,
                    args.note
                )
                const collect = await ratingModel.new(
                    args.problemId,
                    args.note,
                    args.comment
                )
                console.log(collect)
                const response = await userModel.updateUserSkillRating(
                    args.user_Id,
                    args.skill_Id,
                    collect.note
                );
                console.log(response)
            } catch (error) {
                console.log(error);
                return false;
            }

            return true;
        },*/

        async updateUserSkillRating(_, args){
            try{
                const response = await userModel.updateUserSkillRating(
                    args.user_Id,
                    args.skill_Id,
                )

                //const endPoint = await userModel.insertUserSkillEndingPoint(
                  //  response.user_id,
                   // response.skill_id,
                    //args.note
                //)
                console.log(response)
                //console.log(endPoint)
            } catch (error) {
                console.log(error);
                return false;
            }

            return true;
        },
    },

    User: {
        skill(parent) {
            return userModel.getUserSkills(parent.id);
        },

        soma(parent) {
            return userModel.getUserRating(parent.id);
        },

        contact(parent) {
            return userModel.getUserContacts(parent.id);
        },
    },
};
