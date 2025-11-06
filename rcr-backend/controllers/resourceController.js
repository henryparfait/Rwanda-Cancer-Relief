import Resource from '../models/Resource.js';
import User from '../models/User.js';
import { uploadToCloudinary, uploadImage, uploadDocument, uploadVideo, extractPublicId, deleteFromCloudinary } from '../utils/cloudinary.js';

/**
 * Get all resources
 */
export const getResources = async (req, res) => {
  try {
    const { type, category, search, sortBy = 'newest', page = 1, limit = 20 } = req.query;

    const query = { isPublic: true };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      alphabetical: { title: 1 }
    };

    const sort = sortOptions[sortBy] || sortOptions.newest;
    const skip = (page - 1) * limit;

    const [resources, total] = await Promise.all([
      Resource.find(query)
        .populate({
          path: 'uploadedBy',
          select: '-password',
          populate: {
            path: 'profile',
            select: 'firstName lastName'
          }
        })
        .sort(sort)
        .limit(parseInt(limit))
        .skip(skip),
      Resource.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: resources.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resources',
      error: error.message
    });
  }
};

/**
 * Get single resource by ID
 */
export const getResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId)
      .populate({
        path: 'uploadedBy',
        select: '-password',
        populate: {
          path: 'profile',
          select: 'firstName lastName'
        }
      });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    resource.viewCount += 1;
    await resource.save();

    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resource',
      error: error.message
    });
  }
};

/**
 * Create new resource
 */
export const createResource = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      type,
      url,
      thumbnail,
      category,
      tags,
      isPublic
    } = req.body;

    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and type are required'
      });
    }

    let resourceUrl = url;
    let resourceThumbnail = thumbnail || '';
    let fileSize = 0;
    let mimeType = '';

    if (req.file) {
      try {
        const folder = `rcr/resources/${type}`;
        let uploadResult;

        if (type === 'image') {
          uploadResult = await uploadImage(req.file.buffer, folder, {
            width: 1200,
            height: 1200,
            crop: 'limit'
          });
          resourceThumbnail = uploadResult.secure_url;
        } else if (type === 'video') {
          uploadResult = await uploadVideo(req.file.buffer, folder);
          resourceThumbnail = uploadResult.eager?.[0]?.secure_url || uploadResult.secure_url;
        } else if (type === 'pdf' || type === 'guide') {
          uploadResult = await uploadDocument(req.file.buffer, folder);
        } else {
          uploadResult = await uploadToCloudinary(req.file.buffer, folder);
        }

        resourceUrl = uploadResult.secure_url;
        fileSize = req.file.size;
        mimeType = req.file.mimetype;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: 'Error uploading resource file',
          error: uploadError.message
        });
      }
    } else if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Either file upload or URL is required'
      });
    }

    const resource = await Resource.create({
      title,
      description,
      type,
      url: resourceUrl,
      thumbnail: resourceThumbnail,
      uploadedBy: userId,
      category: category || 'other',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      isPublic: isPublic !== undefined ? isPublic : true,
      fileSize,
      mimeType
    });

    const populatedResource = await Resource.findById(resource._id)
      .populate({
        path: 'uploadedBy',
        select: '-password',
        populate: {
          path: 'profile',
          select: 'firstName lastName'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: populatedResource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating resource',
      error: error.message
    });
  }
};

/**
 * Update resource
 */
export const updateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user.id;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (resource.uploadedBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this resource'
      });
    }

    const {
      title,
      description,
      type,
      url,
      thumbnail,
      category,
      tags,
      isPublic
    } = req.body;

    if (title) resource.title = title;
    if (description) resource.description = description;
    if (type) resource.type = type;
    if (url) resource.url = url;
    if (thumbnail !== undefined) resource.thumbnail = thumbnail;
    if (category) resource.category = category;
    if (tags) resource.tags = tags;
    if (isPublic !== undefined) resource.isPublic = isPublic;

    await resource.save();

    const updatedResource = await Resource.findById(resource._id)
      .populate({
        path: 'uploadedBy',
        select: '-password',
        populate: {
          path: 'profile',
          select: 'firstName lastName'
        }
      });

    res.json({
      success: true,
      message: 'Resource updated successfully',
      data: updatedResource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating resource',
      error: error.message
    });
  }
};

/**
 * Delete resource
 */
export const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user.id;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    if (resource.uploadedBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this resource'
      });
    }

    const publicId = extractPublicId(resource.url);
    if (publicId) {
      await deleteFromCloudinary(publicId).catch(() => {});
    }

    if (resource.thumbnail) {
      const thumbnailPublicId = extractPublicId(resource.thumbnail);
      if (thumbnailPublicId && thumbnailPublicId !== publicId) {
        await deleteFromCloudinary(thumbnailPublicId).catch(() => {});
      }
    }

    await Resource.findByIdAndDelete(resourceId);

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting resource',
      error: error.message
    });
  }
};

/**
 * Increment download count
 */
export const downloadResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    resource.downloadCount += 1;
    await resource.save();

    res.json({
      success: true,
      data: {
        url: resource.url,
        downloadCount: resource.downloadCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading resource',
      error: error.message
    });
  }
};

