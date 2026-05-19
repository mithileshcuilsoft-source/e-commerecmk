const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const client = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const upload = multer({
  storage: multerS3({
    s3: client,
    bucket: process.env.AWS_BUCKET_NAME,

    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req, file, cb) => {
      const sanitizedName = file.originalname
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9.-]/g, "");

      const fileName = `${Date.now()}-${sanitizedName}`;

      cb(null, `products/${fileName}`);
    },
  }),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

module.exports = upload;