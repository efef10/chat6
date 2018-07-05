import {Chat} from '../models/Chat'
import {db} from '../lib/mysqlDB';
import * as uniqid from "uniqid";
import {Group} from "../models/Group";
import {User} from "../models/User";
// import * as uniqid from 'uniqid';
const myDb = db();
// import {Group} from '../models/Group'

// const chat = new Chat()
// import {nAryTree} from '../models/nAryTree';
// const groups = new nAryTree();

class GroupsService{
    private chat:Chat[]
    constructor(){
        this.chat=[];
        this.chat.push(new Chat())
    }

    getGroups= async ()=>{
        let groups = await myDb.queryAsync('SELECT * FROM chat.group');
        return groups
    }

    addGroup=async (groupId:string,body:any)=>{
        let newGroup = {type:"group",name:body.name,id:uniqid()}
        let query = `INSERT INTO chat.group VALUES('${newGroup.id}','group','${newGroup.name}')`;
        await myDb.queryAsync(query);
        if(groupId === "-1"){
            query = `INSERT INTO chat.connector VALUES('group','','${newGroup.id}')`;
            await myDb.queryAsync(query);
            return newGroup;
        }

        let myConnectors = await this.getConnectors(groupId);
        query = `INSERT INTO chat.connector VALUES('group','${groupId}','${newGroup.id}')`;
        await myDb.queryAsync(query);

        if(!!myConnectors && myConnectors.length>0 && myConnectors[0].type ==="user"){
            let newGroupOthers = {type:"group",name:"others",id:uniqid()}
            let query = `INSERT INTO chat.group VALUES('${newGroupOthers.id}','group','${newGroupOthers.name}')`;
            await myDb.queryAsync(query);

            query = `INSERT INTO chat.connector VALUES('group','${groupId}','${newGroupOthers.id}')`;
            await myDb.queryAsync(query);

            //=== update the new parent of the users:  ===
            query = `UPDATE chat.connector SET parentId = '${newGroupOthers.id}' WHERE parentId = '${groupId}' AND type = 'user'`;
            await myDb.queryAsync(query);
            query = `UPDATE chat.message SET toId = '${newGroupOthers.id}' WHERE toId = '${groupId}' AND type = 'group'`;
            await myDb.queryAsync(query);
            // await connectorsDB.editData([{"field":"parentId","value":toGroupID},{"field":"type","value":"user"}],[{"field":"parentId","value":newGroupOthers.id}])
            // await messagesDB.editData([{field:"to",value:toGroupID},{field:"type",value:"group"}],[{field:"to",value:newGroupOthers.id}])
            //============================================
        }
        return newGroup;
    }

    editGroup=async(groupId:string,updates:{field:string,value:any}[])=>{
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

        let query = `UPDATE chat.group SET ${updateSQL} WHERE id = '${groupId}'`;
        let group = await myDb.queryAsync(query);
        return group;
    }

    deleteGroup=async (groupId:string)=>{
        let query = `DELETE FROM chat.group WHERE id = '${groupId}'`;
        let group = await myDb.queryAsync(query);
        query = `DELETE FROM chat.connector WHERE childId = '${groupId}'`;
        await myDb.queryAsync(query);
        await this.deleteAllConnectors(groupId);
        return group;
    }

    getConnectors=async (groupId:string)=>{
        let connectors = await myDb.queryAsync(`SELECT * FROM chat.connector WHERE parentId = '${groupId}'`);
        return connectors
    }

    deleteConnector = async(groupId:string,childId:string,type:string)=>{
        let query = `DELETE FROM chat.connector WHERE parentId = '${groupId}' AND childId = '${childId}' AND type = '${type}'`;
        let connector = await myDb.queryAsync(query);
        if(type === 'group'){
            await this.deleteGroup(childId)
        }
        return connector;
    }

    async deleteAllConnectors(groupId:string){
        let connectors = await this.getConnectors(groupId)
        if(!!connectors){
            for(let connector of connectors){
                if(connector.type==='group'){
                    await this.deleteGroup(connector.childId)
                }
                await this.deleteConnector(connector.parentId, connector.childId, connector.type);
            }
        }
    }

    addConnector=async(groupId:string,connectorId:string,type:string)=>{
        let connectors = await this.getConnectors(groupId);

        if(type === "user"){
            if(!!connectors && connectors.length>0 && connectors[0].type ==="group") {
                let newGroupId = uniqid();
                await myDb.queryAsync(`INSERT INTO chat.group VALUES('${newGroupId}','group','others')`);
                await myDb.queryAsync(`INSERT INTO chat.connector VALUES('group','${groupId}','${newGroupId}')`);
                return await myDb.queryAsync(`INSERT INTO chat.connector VALUES('user','${newGroupId}','${connectorId}')`);
            }
            else{
                return await myDb.queryAsync(`INSERT INTO chat.connector VALUES('user','${groupId}','${connectorId}')`);
            }
        }
        else{
            return {message:"not supported yet"};
        }
    }

    getTree=async()=>{
        let groups = await this.getGroups();
        let myTree;
        if(!!groups && groups.length > 0){
            myTree = await this._getTree()
        }
        else{
            myTree = [];
        }
        return myTree;
    }

    public async _getTree(){
        let myRoot,myTree;
        myTree = {};
        let query = `select con.*,
                            (case when con.type = 'user' then
                                   (select name from chat.user
                                    where id = childId)
                            else
                                   (select name from chat.group
                                    where id = childId) end) as name
                     from chat.connector con`

        let connectorsWithNames = await myDb.queryAsync(query);
        for(let connector of connectorsWithNames){
            if(connector.parentId===""){
                myRoot = new Group(connector.childId,connector.name,[],null);
            }
            else if(!myTree[connector.parentId]){
                if(connector.type == "user"){
                    // myTree[connector.parentId] = [new Group(connector.childId,"bbb",[],connector.parentId)]

                    myTree[connector.parentId] = [new User(connector.childId,connector.name,connector.age,"")]
                }
                else{
                    myTree[connector.parentId] = [new Group(connector.childId,connector.name,[],connector.parentId)]
                }
            }
            else{
                if(connector.type == "user"){
                    myTree[connector.parentId].push(new User(connector.childId,connector.name,connector.age,""));
                    //fixme
                }
                else {
                    myTree[connector.parentId].push(new Group(connector.childId, connector.name, [], connector.parentId))
                }
            }
        }
        this.generateTree(myRoot,myTree);
        return myRoot;
    }

    public generateTree(group:Group,tmpTree:any){
        let currentGroup = group;
        let children = tmpTree[currentGroup.getId()];
        if(!!children){
            currentGroup.setChildren(children)
            for(let child of children){
                if(child.type === "user"){
                    return
                }
                this.generateTree(child,tmpTree)
            }
        }
    }

    getMessages=async(groupId:string)=>{
        let query = `SELECT * FROM chat.message WHERE type = 'group' AND toID = '${groupId}'`
        const messages = await myDb.queryAsync(query);
        return messages;
    }

    addMessage=async(groupId:string,content:string,fromUser:string,date:Date)=>{
        let query = `SELECT id FROM chat.user WHERE name = '${fromUser}'`;
        let writerId = (await myDb.queryAsync(query))[0].id;
        query = `INSERT INTO chat.message VALUES('${fromUser}','${writerId}','group','${groupId}','${content}',current_date())`;
        await myDb.queryAsync(query);
        const newMessage = {userName:fromUser,writerId,type:"group",content,date,to:groupId};
        return newMessage;
    }
}

export default GroupsService;