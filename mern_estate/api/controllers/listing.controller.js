import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}; 
    
export const deleteListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (req.user.id !== listing.userRef) {
            return res.status(403).json({ message: "You are not authorized to delete this listing" });
        }

        await Listing.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Listing deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (req.user.id !== listing.userRef) {
            return res.status(401).json({ message: "You are not authorized to update this listing" });
        }

        try {
            const updatedListing = await Listing.findByIdAndUpdate(
                req.params.id, req.body, {new: true});
        return res.status(200).json(updatedListing);
        } catch (error) {
            next(error);
        }

    };

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        return res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = parseInt(req.query.startIndex) || 0;
        
        let offer = req.query.offer;
        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        } else if (offer === 'true') {
            offer = true;
        }

        let furnished = req.query.furnished;
        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        } else if (furnished === 'true') {
            furnished = true;
        }

        let parking = req.query.parking;
        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        } else if (parking === 'true') {
            parking = true;
        }

        let type = req.query.type;
        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        const listings = await Listing.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ],
            ...(type && { type }),
            ...(offer && { offer }),
            ...(furnished && { furnished }),
            ...(parking && { parking }),
        })
        .sort({ [sort]: order })
        .skip(startIndex)
        .limit(limit);

        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
};


