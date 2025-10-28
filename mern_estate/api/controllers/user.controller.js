import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return next(errorHandler(404, 'User not found!'));
        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};

export const test = (req, res) => {
    res.json({
        message: 'API routing works!'
    });
};

export const updateUser = async (req, res, next) => {
    if (req.params.id !== req.user.id) 
        return next(errorHandler(403, "You can't update other users!"));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set:{
                    username: req.body.username,
                    email: req.body.email,
                    avatar: req.body.avatar,
                    password: req.body.password
                 } 
            }, 
            { new: true }
        )
        
        const {password, ...rest} = updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(errorHandler(500, 'Failed to update user!'));
    }
}