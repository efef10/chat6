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
var db_1 = require("../lib/db");
var uniqid = require("uniqid");
var usersDB = new db_1.DB("users");
var messagesDB = new db_1.DB("messages");
var connectorsDB = new db_1.DB("connectors");
var Users = /** @class */ (function () {
    function Users(users) {
        this.users = users || [];
    }
    Users.prototype.addUser = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _i, data_1, user_1, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body.type = "user";
                        body.message = [];
                        return [4 /*yield*/, usersDB.getData()];
                    case 1:
                        data = _a.sent();
                        if (!!data) return [3 /*break*/, 3];
                        return [4 /*yield*/, usersDB.initiate()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                            user_1 = data_1[_i];
                            if (user_1.name === body.name) {
                                return [2 /*return*/, false];
                            }
                        }
                        body.id = uniqid();
                        return [4 /*yield*/, usersDB.addData(body)];
                    case 4:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    Users.prototype.deleteAllUsers = function () {
        usersDB.deleteFileContent();
        // return status;
    };
    Users.prototype.editUser = function (userId, updates) {
        return usersDB.editData([{ "field": "id", "value": userId }], updates);
    };
    Users.prototype.removeUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, connectorsDB.deleteData([{ field: "type", value: "user" }, { field: "childId", value: userId }])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, usersDB.deleteData([{ "field": "id", "value": userId }])];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //////////////////////////////////////////////////////////////////////
    Users.prototype.setUserAge = function (userName, newAge) {
        var user = this.returnUserByName(userName);
        if (!!user) {
            user.setAge(newAge);
            return true;
        }
        return false;
    };
    Users.prototype.setUserPassword = function (userName, newPassword) {
        var user = this.returnUserByName(userName);
        if (!!user) {
            user.setPassword(newPassword);
            return true;
        }
        return false;
    };
    Users.prototype.returnUserByName = function (userName) {
        if (!!userName) {
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].getUserName() === userName) {
                    return this.users[i];
                }
            }
            return null;
        }
        return null;
    };
    Users.prototype.allUsersNames = function () {
        return this.users.map(function (user) { return user.getUserName(); });
    };
    Users.prototype.allUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, usersDB.getData()];
                    case 1:
                        data = _a.sent();
                        if (!!data) {
                            // this.users = data;
                            return [2 /*return*/, data];
                        }
                        else {
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Users.prototype.addMessage = function (userName, message) {
        return __awaiter(this, void 0, void 0, function () {
            var users, writerId, toId, _i, users_1, user, newMessage, myMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, usersDB.getData()];
                    case 1:
                        users = _a.sent();
                        for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                            user = users_1[_i];
                            if (user.name === userName) {
                                writerId = user.id;
                            }
                            if (user.name === message.toUser) {
                                toId = user.id;
                            }
                        }
                        newMessage = { userName: userName, writerId: writerId, type: "user", to: toId, content: message.content, date: message.date };
                        return [4 /*yield*/, messagesDB.addData(newMessage)];
                    case 2:
                        myMessage = _a.sent();
                        return [2 /*return*/, myMessage];
                }
            });
        });
    };
    Users.prototype.authUser = function (userName, password) {
        return __awaiter(this, void 0, void 0, function () {
            var users, _i, users_2, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, usersDB.getData()];
                    case 1:
                        users = _a.sent();
                        for (_i = 0, users_2 = users; _i < users_2.length; _i++) {
                            user = users_2[_i];
                            if (user.password === password) {
                                return [2 /*return*/, true];
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    Users.prototype.getUserMessages = function (userName, chattingWith) {
        return __awaiter(this, void 0, void 0, function () {
            var users, writerId, toId, _i, users_3, user, messages, myMessages, _a, messages_1, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, usersDB.getData()];
                    case 1:
                        users = _b.sent();
                        for (_i = 0, users_3 = users; _i < users_3.length; _i++) {
                            user = users_3[_i];
                            if (user.name === userName) {
                                writerId = user.id;
                            }
                            if (user.name === chattingWith) {
                                toId = user.id;
                            }
                        }
                        if (!(writerId && toId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, messagesDB.getData()];
                    case 2:
                        messages = _b.sent();
                        myMessages = [];
                        for (_a = 0, messages_1 = messages; _a < messages_1.length; _a++) {
                            message = messages_1[_a];
                            if (message.type === "user") {
                                if ((message.writerId === writerId && message.to) === toId || (message.to === writerId && message.writerId)) {
                                    myMessages.push(message);
                                }
                            }
                        }
                        return [2 /*return*/, myMessages];
                    case 3: return [2 /*return*/, []];
                }
            });
        });
    };
    return Users;
}());
exports.Users = Users;
// module.exports.Users = Users;
//# sourceMappingURL=Users.js.map