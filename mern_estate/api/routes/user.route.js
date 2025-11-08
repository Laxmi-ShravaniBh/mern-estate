import express from "express";
import { test, updateUser, getUser, deleteUser, getUserListings } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUtils.js";

const router = express.Router();

router.get('/test', test);
router.get('/me', verifyToken, getUser);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);

export default router;