module.exports = {
  config: {
    name: "video3",
    version: "2.0",
    author: "Md Rana | ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Catbox video by category",
    longDescription: "৮টি ক্যাটাগরি থেকে Catbox ভিডিও লিংক পাঠাবে",
    category: "media",
    guide: {
      en: "Use: video <category>\nExample: video funny"
    }
  },

  onStart: async function ({ api, event, args }) {

    const videoData = {
      Love: [
        "https://files.catbox.moe/v1fv8b.mp4",
        "https://files.catbox.moe/islamic2.mp4"
      ],
      funny: [
        "https://files.catbox.moe/funny1.mp4",
        "https://files.catbox.moe/funny2.mp4"
      ],
      sad: [
        "https://files.catbox.moe/sad1.mp4"
      ],
      love: [
        "https://files.catbox.moe/love1.mp4"
      ],
      status: [
        "https://files.catbox.moe/status1.mp4"
      ],
      anime: [
        "https://files.catbox.moe/anime1.mp4"
      ],
      bangla: [
        "https://files.catbox.moe/bangla1.mp4"
      ],
      english: [
        "https://files.catbox.moe/english1.mp4"
      ]
    };

    if (!args[0]) {
      return api.sendMessage(
        "❌ Category দিন\n\n📂 Available Categories:\n" +
        Object.keys(videoData).map(c => `• ${c}`).join("\n") +
        "\n\nExample: video islamic",
        event.threadID,
        event.messageID
      );
    }

    const category = args[0].toLowerCase();

    if (!videoData[category]) {
      return api.sendMessage(
        "❌ ভুল ক্যাটাগরি!\n\n📂 Available:\n" +
        Object.keys(videoData).join(", "),
        event.threadID,
        event.messageID
      );
    }

    const randomVideo =
      videoData[category][
        Math.floor(Math.random() * videoData[category].length)
      ];

    return api.sendMessage(
      `🎬 Category: ${category}\n🔗 Catbox Video:\n${randomVideo}`,
      event.threadID,
      event.messageID
    );
  }
};
