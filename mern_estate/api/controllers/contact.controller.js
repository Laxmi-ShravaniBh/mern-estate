import nodemailer from 'nodemailer';
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';

export const contactListing = async (req, res, next) => {
    const { firstName, lastName, email, phone, message, listingId } = req.body;

    try {
        // Fetch the listing to get the userRef
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        // Fetch the user (landlord)
        const user = await User.findById(listing.userRef);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Landlord not found' });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // App password for Gmail
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: `New Inquiry for Your Listing: ${listing.name}`,
            text: `
                You have received a new inquiry for your listing.

                Listing: ${listing.name}
                Address: ${listing.address}

                Inquirer Details:
                Name: ${firstName} ${lastName}
                Email: ${email}
                Phone: ${phone}
                Message: ${message}
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Inquiry sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send inquiry' });
    }
};
