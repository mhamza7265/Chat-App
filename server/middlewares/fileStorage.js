const multer = require("multer");

const storageEngine = multer.diskStorage({
  destination: "./files/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({ storage: storageEngine });

module.exports = upload;
