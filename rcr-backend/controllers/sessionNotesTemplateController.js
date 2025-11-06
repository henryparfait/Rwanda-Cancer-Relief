import SessionNotesTemplate from '../models/SessionNotesTemplate.js';
import User from '../models/User.js';

/**
 * Get all session notes templates
 */
export const getTemplates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, isPublic } = req.query;

    const query = {
      $or: [
        { createdBy: userId },
        { isPublic: true }
      ]
    };

    if (category) {
      query.category = category;
    }

    if (isPublic !== undefined) {
      query.isPublic = isPublic === 'true';
    }

    const templates = await SessionNotesTemplate.find(query)
      .populate({
        path: 'createdBy',
        select: '-password',
        populate: {
          path: 'profile',
          select: 'firstName lastName'
        }
      })
      .sort({ isDefault: -1, createdAt: -1 });

    res.json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching templates',
      error: error.message
    });
  }
};

/**
 * Get single template by ID
 */
export const getTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const userId = req.user.id;

    const template = await SessionNotesTemplate.findOne({
      _id: templateId,
      $or: [
        { createdBy: userId },
        { isPublic: true }
      ]
    })
      .populate({
        path: 'createdBy',
        select: '-password',
        populate: {
          path: 'profile',
          select: 'firstName lastName'
        }
      });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching template',
      error: error.message
    });
  }
};

/**
 * Create new template
 */
export const createTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      template,
      fields,
      isDefault,
      isPublic,
      category
    } = req.body;

    if (!name || !template) {
      return res.status(400).json({
        success: false,
        message: 'Name and template are required'
      });
    }

    if (isDefault) {
      await SessionNotesTemplate.updateMany(
        { createdBy: userId, isDefault: true },
        { isDefault: false }
      );
    }

    const newTemplate = await SessionNotesTemplate.create({
      name,
      description: description || '',
      template,
      fields: fields || [],
      createdBy: userId,
      isDefault: isDefault || false,
      isPublic: isPublic || false,
      category: category || 'general'
    });

    const populatedTemplate = await SessionNotesTemplate.findById(newTemplate._id)
      .populate({
        path: 'createdBy',
        select: '-password',
        populate: {
          path: 'profile',
          select: 'firstName lastName'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: populatedTemplate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating template',
      error: error.message
    });
  }
};

/**
 * Update template
 */
export const updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const userId = req.user.id;
    const {
      name,
      description,
      template,
      fields,
      isDefault,
      isPublic,
      category
    } = req.body;

    const existingTemplate = await SessionNotesTemplate.findById(templateId);
    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    if (existingTemplate.createdBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this template'
      });
    }

    if (isDefault && !existingTemplate.isDefault) {
      await SessionNotesTemplate.updateMany(
        { createdBy: userId, isDefault: true },
        { isDefault: false }
      );
    }

    if (name) existingTemplate.name = name;
    if (description !== undefined) existingTemplate.description = description;
    if (template) existingTemplate.template = template;
    if (fields) existingTemplate.fields = fields;
    if (isDefault !== undefined) existingTemplate.isDefault = isDefault;
    if (isPublic !== undefined) existingTemplate.isPublic = isPublic;
    if (category) existingTemplate.category = category;

    await existingTemplate.save();

    const updatedTemplate = await SessionNotesTemplate.findById(templateId)
      .populate({
        path: 'createdBy',
        select: '-password',
        populate: {
          path: 'profile',
          select: 'firstName lastName'
        }
      });

    res.json({
      success: true,
      message: 'Template updated successfully',
      data: updatedTemplate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating template',
      error: error.message
    });
  }
};

/**
 * Delete template
 */
export const deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const userId = req.user.id;

    const template = await SessionNotesTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    if (template.createdBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this template'
      });
    }

    await SessionNotesTemplate.findByIdAndDelete(templateId);

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting template',
      error: error.message
    });
  }
};

