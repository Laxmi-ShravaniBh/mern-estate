import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import Listing from "../models/listing.model.js";
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
};

export const deleteUser = async (req, res, next) => {
    if (req.params.id !== req.user.id) 
        return next(errorHandler(403, "You can't delete other users!"));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token").status(200).json("User deleted successfully!");
    } catch (error) {
        next(errorHandler(500, 'Failed to delete user!'));
    }
}

export const getUserListings = async (req, res, next) => {
    console.log('req.params.id:', req.params.id);
    console.log('req.user.id:', req.user.id);
    if (req.params.id === req.user.id) {
        try {
            const listings = await Listing.find({ userRef: req.params.id });
            console.log('Found listings:', listings.length);
            res.status(200).json(listings);
        } catch (error) {
            console.error('Error fetching listings:', error);
            next(error);
        }
    } else {
        next(errorHandler(401, "You can't get other users' listings!"));
    }
};
