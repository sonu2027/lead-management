import { Lead } from "../models/leads.model.js"
import { validationResult } from "express-validator"

export const getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';

    // Building search query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculating pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalLeads = await Lead.countDocuments(query);
    const totalPages = Math.ceil(totalLeads / limit);

    // Get leads with pagination
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        currentPage: page,
        totalPages,
        totalLeads,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leads',
      error: error.message
    });
  }
};

export const createLead = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { name, email, phone } = req.body;

    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'Lead with this email already exists'
      });
    }

    const lead = new Lead({
      name,
      email,
      phone,
    });

    const savedLead = await lead.save();

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: savedLead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating lead',
      error: error.message
    });
  }
};

export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lead',
      error: error.message
    });
  }
};

// Update lead
export const updateLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lead',
      error: error.message
    });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lead',
      error: error.message
    });
  }
};