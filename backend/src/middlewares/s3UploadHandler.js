const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const client = new S3Client({
  region: process.env.AWS_REGION,

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const s3Bucket = process.env.AWS_BUCKET_NAME;

let storage;
if (s3Bucket) {
  storage = multerS3({
    s3: client,
    bucket: s3Bucket,
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
  });
} else {
  console.error("CRITICAL WARNING: AWS_BUCKET_NAME is not defined. Image uploads will fail, but server is staying online.");
  storage = multer.memoryStorage(); // Fallback to memory so it doesn't crash on boot
}

exports.upload = multer({
  storage,

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

exports.deleteUploadImages3 = async (imageUrl) => {
  try {
    const url = new URL(imageUrl);

    const fileKey = decodeURIComponent(url.pathname.substring(1));
    // example: products/123-image.jpg

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });

    await client.send(command);
  } catch (error) {
    console.error("S3 Delete Error:", error);
    throw error;
  }
}