import * as express from 'express';
import * as controllers from '../controllers'

const usersRouter = express.Router();

usersRouter.get ('/',controllers.getUsers);
usersRouter.get ('/:userName/messages/:chattingWith',controllers.getUserMessages);

usersRouter.post('/',controllers.addUser);
usersRouter.post('/:userName/messages',controllers.addMessageToUser);
usersRouter.post('/:userName/login',controllers.authUser);

usersRouter.put('/:userId',controllers.editUser);

usersRouter.delete('/:userId',controllers.deleteUser)

// usersRouter.post('/',async (req,res)=>{
//     let user = await usersDB.addUser(req.body);
//     res.json(user);
//     // res.set('location', 'https://localhost:4000/users');
//     // res.status(301).send()
//     // res.redirect("users"); + req.path
// });


export default usersRouter;
