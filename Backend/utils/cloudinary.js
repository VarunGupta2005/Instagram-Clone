import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: "dqwkgfejb",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function upload(link) {
  cloudinary.uploader
    .upload(link)
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

export default upload;
