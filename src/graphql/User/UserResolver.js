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
        photos() {
            return userModel.getPhotos();
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
                const response = await userModel.register(
                    args.name,
                    args.email,
                    args.password,
                    args.telephone,
                    args.description,
                    args.photo
                );
                await userModel.newUserContact(response.insertId, args.contact);
                await userModel.newUserSkill(response.insertId, args.skill);
            } catch (error) {
                console.log(error);
                return false;
            }

            return true;
        },


        async updateUserSkillRating(_, args){
            try{
                const response = await userModel.updateUserSkillRating(
                    args.user_Id,
                    args.skill_Id,
                )
                console.log(response)

            } catch (error) {
                console.log(error);
                return false;
            }

            return true;
        },
        async updateProfile(_, args) {
            return await userModel.get(args.id).then(async (user) => {
                try {
                    const response = await userModel.update(
                        args.id,
                        args.name ? args.name : user.name,
                        args.email ? args.email : user.email,
                        args.telephone ? args.telephone : user.telephone,
                        args.description ? args.description : user.description,
                        args.photo ? args.photo : user.photo,
                        args.user_status_id ? args.user_status_id : user.user_status_id
                    );
                    args.contact ? await userModel.editUserContact(args.id, args.contact) : null
                    args.skill ? await userModel.newUserSkill(args.id, args.skill): null
                } catch (error) {
                    console.log(error);
                    return false;
                }
    
                return true;    
            })
        },

        async lockProfile(_, args) {
            return await userModel.get(args.id).then(async (user) => {

                try {
                    const response = await userModel.update(
                        args.id,
                        "[Conta Deletada]",
                        user.email,
                        user.telephone,
                        user.description,
                        user.photo,
                        3
                    );
                
                } catch (error) {
                    console.log(error);
                    return false;
                }
                
                return true;    
            });
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
