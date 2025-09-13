import express from "express"
import { body } from "express-validator"
import {
  getAllLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead
} from '../controllers/leads.controller.js';

const router = express.Router();

// Validation middleware
const leadValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long')
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('phone')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number')
    .notEmpty()
    .withMessage('Phone number is required'),
];

// Routes
router.get('/', getAllLeads);
router.get('/:id', getLeadById);
router.post('/', leadValidation, createLead);
router.put('/:id', leadValidation, updateLead);
router.delete('/:id', deleteLead);

export default router;
