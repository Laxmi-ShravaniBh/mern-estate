import express from 'express';
import { contactListing } from '../controllers/contact.controller.js';

const router = express.Router();

router.post('/', contactListing);

export default router;
