import express from 'express';
import { Register, bookmark, edit, follow, getMyProfile, getOtherUsers, logedinprofile, login, logout, unfollow } from '../Controllers/userController.js';
import isAuthenticated from '../Config/auth.js';

const router= express.Router();

router.route("/register").post(Register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route("/logedinprofile/:id").get(isAuthenticated, logedinprofile);
router.route("/bookmark/:id").put(isAuthenticated, bookmark);
router.route("/profile/:id").get(isAuthenticated, getMyProfile);
router.route("/otheruser/:id").get(isAuthenticated, getOtherUsers);
router.route("/follow/:id").post(isAuthenticated, follow);
router.route("/unfollow/:id").post(isAuthenticated, unfollow);
router.route("/edit").patch(isAuthenticated, edit);


export default router;