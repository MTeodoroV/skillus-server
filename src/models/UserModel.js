import db from "../config/connection";
import { hash } from "bcrypt";
import { skillModel } from "./SkillModel";

export const userModel = {
    findUserByParam(param, email) {
        const query = `select * from user where ${param} = "${email}"`;
        return new Promise((resolve, reject) => {
            db.query(query, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result[0]);
                }
            });
        });
    },

    getPhotos() {
        const query = `SELECT P.* FROM photo P`;
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

    all() {
        return new Promise((resolve, reject) => {
            const query = `SELECT U.*, US.name AS status
            FROM user U
            INNER JOIN user_status US ON US.id = U.user_status_id order by soma DESC;`;
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
            db.query(
                `SELECT U.*, US.name AS status
                FROM user U
                INNER JOIN user_status US ON US.id = U.user_status_id WHERE U.id = ${id}`,
                (error, result) => {
                    if (error) {
                        console.log(error);
                        reject(error);
                    } else {
                        resolve(result[0]);
                    }
                }
            );
        });
    },
    async register(name, email, password, telephone, description, photo) {
        const hashedPassword = await hash(password, 12);
        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO user(name,email,password,telephone,description,photo)VALUES("${name}","${email}","${hashedPassword}","${telephone}","${description}","${photo}")`,
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },

    async update(id, name, email, telephone, description, photo, usi) {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE user 
                 SET name="${name}", email="${email}", telephone="${telephone}", description="${description}", photo="${photo}", user_status_id=${usi}
                 WHERE id=${id}`,
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },

    getUserSkills(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT US.id, US.skill_id, S.name, US.rating FROM user_skill US
            INNER JOIN skill S on S.id = US.skill_id 
            WHERE US.user_id = ${userId} order by rating DESC`;
            db.query(query, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    },

    newUserContact(userId, value) {
        const contactId = [1, 2];
        const data = contactId.map((contact, index) => [userId, contact, value[index]]);
        return new Promise((resolve, reject) => {
            const query = `INSERT user_contact(user_id,contact_id,value)VALUES ?`;
            db.query(query, [data], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    },

    async editUserContact(userId, value) {
        const contactId = [1, 2];
        return await this.getUserContacts(userId).then((contacts) => {
            return contactId.map((contact, index) => { 
                if(value[index] == undefined || value[index] == ''){ value[index] = contacts[index].value }
                return new Promise((resolve, reject) => {
                    const query = `UPDATE user_contact SET value="${value[index]}" WHERE user_id="${userId}" AND contact_id=${contact}`;
                    db.query(query, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                })
            });
        })
    },

    newUserSkill(userId, skillId) {
        const data = skillId.map((skill) => [userId, skill]);
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO user_skill(user_id,skill_id)VALUES ?`;
            db.query(query, [data], (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    },

    getUserRating(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT SUM(rating) as soma FROM user_skill WHERE user_id = ${userId}`;

            db.query(query, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(result);
                    resolve(result[0].soma);
                }
            });
        });
    },

    getUserContacts(userId) {
        return new Promise((resolve, reject) => {
            const query = `SELECT UC.id, C.name, UC.value, C.icon, UC.user_id
            FROM user_contact UC
            INNER JOIN contact C ON C.id = UC.contact_id
            WHERE UC.user_id = ${userId}`;

            db.query(query, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    },

    updateUserSkillRatingteste(userId, skillId) {
        const verifica = `SELECT skill_id FROM user_skill WHERE user_id = ${userId} AND skill_id = ${skillId}`
        console.log(verifica)
        return new Promise((resolve, reject) => {
            db.query(verifica, (error, result) => {
                console.log(result)
                if (result.length == 0) {
                    const query = `INSERT INTO user_skill (user_id, skill_id, rating) VALUES (?, ?, 1)`;
                    console.log("else para o insert")
            
                        resolve( new Promise((resolve, reject) => {
                        db.query(query, [userId, skillId] ,(error, result) => {
                            if (error) {
                                reject(error);
                                    } else {
                                        resolve(result);
                                    }
                            })}))
                } else {
                    const query = `CALL SOMA(?,?)`;
                    console.log("try")
        
                    db.query(query, [userId, skillId], (error, result) => {
                    if (error) {
                        reject(error);
                        console.log("error do if")
                    } else {
                        resolve(result);
                        console.log(query)
                    }
                });       
            }
        })}) ;         
    },
    
    insertUserSkillEndingPoint(user_id, skill_id, rating){
            const query = `INSERT INTO user_skill (user_id, skill_id, rating) VALUES (?, ?, 1)`;
            return new Promise((resolve, reject) => {
                db.query(query, [user_id, skill_id, rating] ,(error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
}};