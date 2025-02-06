import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dqwkgfejb",
  api_key: "533651823866985",
  api_secret: "cQhIdk3NQwqvRgLPRXN98avZGE4",
});

async function upload(link) {
  cloudinary.uploader
    .upload(link)
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}

export default upload;
