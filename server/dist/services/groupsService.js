"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Chat_1 = require("../models/Chat");
var mysqlDB_1 = require("../lib/mysqlDB");
var uniqid = require("uniqid");
var Group_1 = require("../models/Group");
var User_1 = require("../models/User");
// import * as uniqid from 'uniqid';
var myDb = mysqlDB_1.db();
// import {Group} from '../models/Group'
// const chat = new Chat()
// import {nAryTree} from '../models/nAryTree';
// const groups = new nAryTree();
var GroupsService = /** @class */ (function () {
    function GroupsService() {
        var _this = this;
        this.getGroups = function () { return __awaiter(_this, void 0, void 0, function () {
            var groups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, myDb.queryAsync('SELECT * FROM chat.group')];
                    case 1:
                        groups = _a.sent();
                        return [2 /*return*/, groups];
                }
            });
        }); };
        this.addGroup = function (groupId, body) { return __awaiter(_this, void 0, void 0, function () {
            var newGroup, query, myConnectors, newGroupOthers, query_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newGroup = { type: "group", name: body.name, id: uniqid() };
                        query = "INSERT INTO chat.group VALUES('" + newGroup.id + "','group','" + newGroup.name + "')";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        _a.sent();
                        if (!(groupId === "-1")) return [3 /*break*/, 3];
                        query = "INSERT INTO chat.connector VALUES('group','','" + newGroup.id + "')";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, newGroup];
                    case 3: return [4 /*yield*/, this.getConnectors(groupId)];
                    case 4:
                        myConnectors = _a.sent();
                        query = "INSERT INTO chat.connector VALUES('group','" + groupId + "','" + newGroup.id + "')";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 5:
                        _a.sent();
                        if (!(!!myConnectors && myConnectors.length > 0 && myConnectors[0].type === "user")) return [3 /*break*/, 10];
                        newGroupOthers = { type: "group", name: "others", id: uniqid() };
                        query_1 = "INSERT INTO chat.group VALUES('" + newGroupOthers.id + "','group','" + newGroupOthers.name + "')";
                        return [4 /*yield*/, myDb.queryAsync(query_1)];
                    case 6:
                        _a.sent();
                        query_1 = "INSERT INTO chat.connector VALUES('group','" + groupId + "','" + newGroupOthers.id + "')";
                        return [4 /*yield*/, myDb.queryAsync(query_1)];
                    case 7:
                        _a.sent();
                        //=== update the new parent of the users:  ===
                        query_1 = "UPDATE chat.connector SET parentId = '" + newGroupOthers.id + "' WHERE parentId = '" + groupId + "' AND type = 'user'";
                        return [4 /*yield*/, myDb.queryAsync(query_1)];
                    case 8:
                        _a.sent();
                        query_1 = "UPDATE chat.message SET toId = '" + newGroupOthers.id + "' WHERE toId = '" + groupId + "' AND type = 'group'";
                        return [4 /*yield*/, myDb.queryAsync(query_1)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/, newGroup];
                }
            });
        }); };
        this.editGroup = function (groupId, updates) { return __awaiter(_this, void 0, void 0, function () {
            var updateSQL, _i, updates_1, update, updateStr, query, group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateSQL = "";
                        for (_i = 0, updates_1 = updates; _i < updates_1.length; _i++) {
                            update = updates_1[_i];
                            updateStr = typeof (update["value"]) === "string" ? "'" + update["value"] + "'" : update["value"];
                            if (updateSQL === "") {
                                updateSQL += update["field"] + " = " + updateStr;
                            }
                            else {
                                updateSQL += "," + update["field"] + " = " + updateStr;
                            }
                        }
                        query = "UPDATE chat.group SET " + updateSQL + " WHERE id = '" + groupId + "'";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        group = _a.sent();
                        return [2 /*return*/, group];
                }
            });
        }); };
        this.deleteGroup = function (groupId) { return __awaiter(_this, void 0, void 0, function () {
            var query, group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "DELETE FROM chat.group WHERE id = '" + groupId + "'";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        group = _a.sent();
                        query = "DELETE FROM chat.connector WHERE childId = '" + groupId + "'";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.deleteAllConnectors(groupId)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, group];
                }
            });
        }); };
        this.getConnectors = function (groupId) { return __awaiter(_this, void 0, void 0, function () {
            var connectors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, myDb.queryAsync("SELECT * FROM chat.connector WHERE parentId = '" + groupId + "'")];
                    case 1:
                        connectors = _a.sent();
                        return [2 /*return*/, connectors];
                }
            });
        }); };
        this.deleteConnector = function (groupId, childId, type) { return __awaiter(_this, void 0, void 0, function () {
            var query, connector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "DELETE FROM chat.connector WHERE parentId = '" + groupId + "' AND childId = '" + childId + "' AND type = '" + type + "'";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        connector = _a.sent();
                        if (!(type === 'group')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.deleteGroup(childId)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, connector];
                }
            });
        }); };
        this.addConnector = function (groupId, connectorId, type) { return __awaiter(_this, void 0, void 0, function () {
            var connectors, newGroupId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnectors(groupId)];
                    case 1:
                        connectors = _a.sent();
                        if (!(type === "user")) return [3 /*break*/, 8];
                        if (!(!!connectors && connectors.length > 0 && connectors[0].type === "group")) return [3 /*break*/, 5];
                        newGroupId = uniqid();
                        return [4 /*yield*/, myDb.queryAsync("INSERT INTO chat.group VALUES('" + newGroupId + "','group','others')")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, myDb.queryAsync("INSERT INTO chat.connector VALUES('group','" + groupId + "','" + newGroupId + "')")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, myDb.queryAsync("INSERT INTO chat.connector VALUES('user','" + newGroupId + "','" + connectorId + "')")];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [4 /*yield*/, myDb.queryAsync("INSERT INTO chat.connector VALUES('user','" + groupId + "','" + connectorId + "')")];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, { message: "not supported yet" }];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        this.getTree = function () { return __awaiter(_this, void 0, void 0, function () {
            var groups, myTree;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGroups()];
                    case 1:
                        groups = _a.sent();
                        if (!(!!groups && groups.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._getTree()];
                    case 2:
                        myTree = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        myTree = [];
                        _a.label = 4;
                    case 4: return [2 /*return*/, myTree];
                }
            });
        }); };
        this.getMessages = function (groupId) { return __awaiter(_this, void 0, void 0, function () {
            var query, messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "SELECT * FROM chat.message WHERE type = 'group' AND toID = '" + groupId + "'";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        messages = _a.sent();
                        return [2 /*return*/, messages];
                }
            });
        }); };
        this.addMessage = function (groupId, content, fromUser, date) { return __awaiter(_this, void 0, void 0, function () {
            var query, writerId, newMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "SELECT id FROM chat.user WHERE name = '" + fromUser + "'";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        writerId = (_a.sent())[0].id;
                        query = "INSERT INTO chat.message VALUES('" + fromUser + "','" + writerId + "','group','" + groupId + "','" + content + "',current_date())";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 2:
                        _a.sent();
                        newMessage = { userName: fromUser, writerId: writerId, type: "group", content: content, date: date, to: groupId };
                        return [2 /*return*/, newMessage];
                }
            });
        }); };
        this.chat = [];
        this.chat.push(new Chat_1.Chat());
    }
    GroupsService.prototype.deleteAllConnectors = function (groupId) {
        return __awaiter(this, void 0, void 0, function () {
            var connectors, _i, connectors_1, connector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConnectors(groupId)];
                    case 1:
                        connectors = _a.sent();
                        if (!!!connectors) return [3 /*break*/, 7];
                        _i = 0, connectors_1 = connectors;
                        _a.label = 2;
                    case 2:
                        if (!(_i < connectors_1.length)) return [3 /*break*/, 7];
                        connector = connectors_1[_i];
                        if (!(connector.type === 'group')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.deleteGroup(connector.childId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.deleteConnector(connector.parentId, connector.childId, connector.type)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    GroupsService.prototype._getTree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var myRoot, myTree, query, connectorsWithNames, _i, connectorsWithNames_1, connector;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        myTree = {};
                        query = "select con.*,\n                            (case when con.type = 'user' then\n                                   (select name from chat.user\n                                    where id = childId)\n                            else\n                                   (select name from chat.group\n                                    where id = childId) end) as name\n                     from chat.connector con";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        connectorsWithNames = _a.sent();
                        for (_i = 0, connectorsWithNames_1 = connectorsWithNames; _i < connectorsWithNames_1.length; _i++) {
                            connector = connectorsWithNames_1[_i];
                            if (connector.parentId === "") {
                                myRoot = new Group_1.Group(connector.childId, connector.name, [], null);
                            }
                            else if (!myTree[connector.parentId]) {
                                if (connector.type == "user") {
                                    // myTree[connector.parentId] = [new Group(connector.childId,"bbb",[],connector.parentId)]
                                    myTree[connector.parentId] = [new User_1.User(connector.childId, connector.name, connector.age, "")];
                                }
                                else {
                                    myTree[connector.parentId] = [new Group_1.Group(connector.childId, connector.name, [], connector.parentId)];
                                }
                            }
                            else {
                                if (connector.type == "user") {
                                    myTree[connector.parentId].push(new User_1.User(connector.childId, connector.name, connector.age, ""));
                                    //fixme
                                }
                                else {
                                    myTree[connector.parentId].push(new Group_1.Group(connector.childId, connector.name, [], connector.parentId));
                                }
                            }
                        }
                        this.generateTree(myRoot, myTree);
                        return [2 /*return*/, myRoot];
                }
            });
        });
    };
    GroupsService.prototype.generateTree = function (group, tmpTree) {
        var currentGroup = group;
        var children = tmpTree[currentGroup.getId()];
        if (!!children) {
            currentGroup.setChildren(children);
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var child = children_1[_i];
                if (child.type === "user") {
                    return;
                }
                this.generateTree(child, tmpTree);
            }
        }
    };
    return GroupsService;
}());
exports.default = GroupsService;
//# sourceMappingURL=groupsService.js.map