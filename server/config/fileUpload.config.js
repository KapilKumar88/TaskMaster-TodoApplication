module.exports = Object.freeze({
  UPLOAD_FILE_MAX_SIZE: process.env.UPLOAD_FILE_MAX_SIZE || (10 * 1024 * 1024),
  TEMP_FILE_UPLOAD_DIRECTORY: process.env.TEMP_FILE_UPLOAD_DIRECTORY || "./temp/",
});
