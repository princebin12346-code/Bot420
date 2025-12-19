const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "catvideo",
    version: "1.0",
    author: "SaGor | ChatGPT",
    role: 0,
    shortDescription: "Upload video to catbox",
    longDescription: "Reply to a video and get catbox link",
    category: "video",
    guide: {
      en: "{pn} (reply to a video)"
    }
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;

    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return api.sendMessage(
        "❌ একটি ভিডিওতে reply দিন",
        threadID,
        messageID
      );
    }

    const attachment = messageReply.attachments[0];
    if (attachment.type !== "video") {
      return api.sendMessage(
        "https://files.catbox.moe/v1fv8b.mp4",
        threadID,
        messageID
      );
    }

    const videoPath = path.join(__dirname, "cache", `${Date.now()}.mp4`);

    try {
      // download video
      const resVideo = await axios.get(attachment.url, {
        responseType: "arraybuffer"
      });
      fs.writeFileSync(videoPath, resVideo.data);

      // upload to catbox
      const form = new FormData();
      form.append("reqtype", "fileupload");
      form.append("fileToUpload", fs.createReadStream(videoPath));

      const res = await axios.post(
        "https://catbox.moe/user/api.php",
        form,
        { headers: form.getHeaders() }
      );

      fs.unlinkSync(videoPath);

      return api.sendMessage(
        `✅ Video Uploaded Successfully\n\n🔗 Catbox Link:\n${res.data}`,
        threadID,
        messageID
      );

    } catch (e) {
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      return api.sendMessage(
        "❌ ভিডিও আপলোড করতে সমস্যা হয়েছে",
        threadID,
        messageID
      );
    }
  }
};
