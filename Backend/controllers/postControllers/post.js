import User from "../../models/User.js";
import Post from "../../models/Post.js";
import upload from "../../utils/cloudinary.js";
import sharp from "sharp";

async function createPost(req, res) {
  try {
    const username = req.username;
    const { caption } = req.body;
    const image = req.file;

    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (!image) {
      return res.status(400).send("Image is required");
    }

    const optimizedImage = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat({ format: "jpeg", quality: 80 })
      .toBuffer();

    const compressedUri = `data:image/jpeg;base64,${optimizedImage.toString("base64")}`;

    const cloudResponse = await upload(compressedUri);
    if (!cloudResponse) {
      return res.status(500).send("Error uploading image");
    }

    const post = new Post({
      caption: caption,
      image: cloudResponse.secure_url,
      author: user._id
    })

    user.posts.push(post._id);
    await user.save();

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).send({
      message: "Post created successfully",
      post
    }
    )
  } catch {
    return res.status(500).send("Internal server error");
  }
}

export default createPost;