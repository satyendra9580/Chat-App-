import Message from "../models/MessageModels.js";
import { upload } from "../config/cloudinary.js"; // Cloudinary middleware

export const getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).json({ message: "Both user IDs are required." });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    return res.status(200).json({ fileUrl: req.file.path }); // Return Cloudinary URL
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "File upload failed" });
  }
};
