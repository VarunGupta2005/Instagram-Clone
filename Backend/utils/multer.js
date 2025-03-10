import multer from 'multer';

// store in disc
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../uploads"); // Files will be stored in the 'uploads' folder
//   },
//   filename: function (req, file, cb) {
//     cb(null,  Date.now() + file.originalname);
//   },
// });

//store in ram
const storage = multer.memoryStorage();

// Initialize Multer
const upload = multer({
  storage: storage,
  // limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  // fileFilter: function (req, file, cb) {
  //   // Only allow specific file types (example: images)
  //   const fileTypes = /jpeg|jpg|png|gif/;
  //   const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  //   const mimeType = fileTypes.test(file.mimetype);

  //   if (mimeType && extName) {
  //     return cb(null, true);
  //   } else {
  //     return cb(new Error("Only images are allowed!"));
  //   }
  // },
});

export default upload;