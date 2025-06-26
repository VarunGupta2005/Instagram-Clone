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
      return res.status(404).json({ message: "User not found", success: false });
    }
    if (!image) {
      return res.status(400).json({ message: "Image is required", success: false });
    }

    const optimizedImage = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const compressedUri = `data:image/jpeg;base64,${optimizedImage.toString("base64")}`;

    const cloudResponse = await upload(compressedUri);
    if (!cloudResponse) {
      return res.status(500).json({ message: "Failed to upload image", success: false });
    }

    const post = new Post({
      caption: caption,
      image: cloudResponse.secure_url,
      author: user._id
    })

    user.posts.push(post._id);
    await user.save();

    await post.populate({ path: "author", select: "-password" });
    await post.save();
    return res.status(201).send({
      message: "Post created successfully",
      post,
      success: true,
    }
    )
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while creating the post",
      success: false
    });
  }
}

export default createPost;