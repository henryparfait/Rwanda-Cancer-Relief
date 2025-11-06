import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file buffer to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} folder - Cloudinary folder path
 * @param {Object} options - Additional Cloudinary options
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = (fileBuffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || 'rcr',
        resource_type: 'auto',
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Upload image with transformations
 * @param {Buffer} fileBuffer - Image buffer
 * @param {string} folder - Cloudinary folder path
 * @param {Object} transformations - Image transformations
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadImage = async (fileBuffer, folder, transformations = {}) => {
  const options = {
    transformation: [
      {
        width: transformations.width || 800,
        height: transformations.height || 800,
        crop: transformations.crop || 'limit',
        quality: transformations.quality || 'auto',
        format: transformations.format || 'auto'
      }
    ]
  };

  return uploadToCloudinary(fileBuffer, folder, options);
};

/**
 * Upload document (PDF, etc.)
 * @param {Buffer} fileBuffer - Document buffer
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadDocument = async (fileBuffer, folder) => {
  return uploadToCloudinary(fileBuffer, folder, {
    resource_type: 'raw'
  });
};

/**
 * Upload video
 * @param {Buffer} fileBuffer - Video buffer
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadVideo = async (fileBuffer, folder) => {
  return uploadToCloudinary(fileBuffer, folder, {
    resource_type: 'video',
    eager: [
      { width: 300, height: 300, crop: 'pad' }
    ]
  });
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string} Public ID
 */
export const extractPublicId = (url) => {
  if (!url) return null;
  const matches = url.match(/\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (matches && matches.length >= 4) {
    return `${matches[2]}/${matches[3].split('.')[0]}`;
  }
  return null;
};

export default cloudinary;

