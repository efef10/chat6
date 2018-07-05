import {db} from '../lib/mysqlDB';
import * as uniqid from 'uniqid';
const myDb = db();

class UsersService{
    constructor(){

    }

    getUsers = async ()=>{
        let users = await myDb.queryAsync('SELECT * FROM chat.user');
        return users;
    }

    addUser = async(body:any)=>{
        let query = `INSERT INTO chat.user VALUES('${uniqid()}','${body.password}',${body.age},'${body.name}','user','${body.imageUrl}')`;
        let user = await myDb.queryAsync(query);
        return user;
    }

    editUser = async(userId:string,updates:{field:string,value:any}[])=>{
        let updateSQL="";
        for (let update of updates){
            let updateStr = typeof(update["value"])==="string"?"'"+update["value"]+"'":update["value"];
            if(updateSQL===""){
                updateSQL += `${update["field"]} = ${updateStr}`
            }
            else{
                updateSQL += `,${update["field"]} = ${updateStr}`
            }
        }

        let query = `UPDATE chat.user SET ${updateSQL} WHERE id = '${userId}'`;
        let user = await myDb.queryAsync(query);
        return user;
    }

    deleteUser = async(userId:string)=>{
        let query = `DELETE FROM chat.user WHERE id = '${userId}'`;
        let user = await myDb.queryAsync(query);
        return user;
    }

    addMessageToUser = async(userName:string,content:string,toUser:string)=>{
        let queryFindId = 'SELECT id FROM chat.user WHERE name = '+"'"+userName+"'";
        let myUserId = await myDb.queryAsync(queryFindId);
        myUserId = myUserId[0].id;
        queryFindId = 'SELECT id FROM chat.user WHERE name = '+"'"+toUser+"'";
        let toUserId = await myDb.queryAsync(queryFindId);
        toUserId = toUserId[0].id;
        let query = `INSERT INTO chat.message VALUES('${userName}','${myUserId}','user','${toUserId}','${content}',current_date())`
        let message = await myDb.queryAsync(query);
        return message;
    }

    getUserMessages = async(userName:string,chattingWith:string)=>{
        const users = await this.getUsers();
        let writerId;
        let toId;
        for(let user of users){
            if(user.name === userName){
                writerId=user.id;
            }
            if(user.name === chattingWith){
                toId = user.id;
            }
        }

        if(writerId && toId){
            let query = `SELECT * FROM chat.message WHERE (writerId = '${writerId}' AND toId = '${toId}') OR (writerId = '${toId}' AND toId = '${writerId}')`;
            const messages = await myDb.queryAsync(query);
            return messages;
        }
        return [];
    }

    authUser = async(userName:string,password:string)=>{
        let query = `SELECT password FROM chat.user WHERE name = '${userName}'`;
        let passwordFromDB = await myDb.queryAsync(query);
        return password === passwordFromDB[0].password;
    }

}

export default UsersService;