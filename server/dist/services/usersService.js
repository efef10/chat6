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
var mysqlDB_1 = require("../lib/mysqlDB");
var uniqid = require("uniqid");
var myDb = mysqlDB_1.db();
var UsersService = /** @class */ (function () {
    function UsersService() {
        var _this = this;
        this.getUsers = function () { return __awaiter(_this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, myDb.queryAsync('SELECT * FROM chat.user')];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, users];
                }
            });
        }); };
        this.addUser = function (body) { return __awaiter(_this, void 0, void 0, function () {
            var query, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "INSERT INTO chat.user VALUES('" + uniqid() + "','" + body.password + "'," + body.age + ",'" + body.name + "','user','" + body.imageUrl + "')";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        }); };
        this.editUser = function (userId, updates) { return __awaiter(_this, void 0, void 0, function () {
            var updateSQL, _i, updates_1, update, updateStr, query, user;
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
                        query = "UPDATE chat.user SET " + updateSQL + " WHERE id = '" + userId + "'";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        }); };
        this.deleteUser = function (userId) { return __awaiter(_this, void 0, void 0, function () {
            var query, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "DELETE FROM chat.user WHERE id = '" + userId + "'";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        }); };
        this.addMessageToUser = function (userName, content, toUser) { return __awaiter(_this, void 0, void 0, function () {
            var queryFindId, myUserId, toUserId, query, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryFindId = 'SELECT id FROM chat.user WHERE name = ' + "'" + userName + "'";
                        return [4 /*yield*/, myDb.queryAsync(queryFindId)];
                    case 1:
                        myUserId = _a.sent();
                        myUserId = myUserId[0].id;
                        queryFindId = 'SELECT id FROM chat.user WHERE name = ' + "'" + toUser + "'";
                        return [4 /*yield*/, myDb.queryAsync(queryFindId)];
                    case 2:
                        toUserId = _a.sent();
                        toUserId = toUserId[0].id;
                        query = "INSERT INTO chat.message VALUES('" + userName + "','" + myUserId + "','user','" + toUserId + "','" + content + "',current_date())";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 3:
                        message = _a.sent();
                        return [2 /*return*/, message];
                }
            });
        }); };
        this.getUserMessages = function (userName, chattingWith) { return __awaiter(_this, void 0, void 0, function () {
            var users, writerId, toId, _i, users_1, user, query, messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUsers()];
                    case 1:
                        users = _a.sent();
                        for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                            user = users_1[_i];
                            if (user.name === userName) {
                                writerId = user.id;
                            }
                            if (user.name === chattingWith) {
                                toId = user.id;
                            }
                        }
                        if (!(writerId && toId)) return [3 /*break*/, 3];
                        query = "SELECT * FROM chat.message WHERE (writerId = '" + writerId + "' AND toId = '" + toId + "') OR (writerId = '" + toId + "' AND toId = '" + writerId + "')";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 2:
                        messages = _a.sent();
                        return [2 /*return*/, messages];
                    case 3: return [2 /*return*/, []];
                }
            });
        }); };
        this.authUser = function (userName, password) { return __awaiter(_this, void 0, void 0, function () {
            var query, passwordFromDB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "SELECT password FROM chat.user WHERE name = '" + userName + "'";
                        return [4 /*yield*/, myDb.queryAsync(query)];
                    case 1:
                        passwordFromDB = _a.sent();
                        return [2 /*return*/, password === passwordFromDB[0].password];
                }
            });
        }); };
    }
    return UsersService;
}());
exports.default = UsersService;
//# sourceMappingURL=usersService.js.map