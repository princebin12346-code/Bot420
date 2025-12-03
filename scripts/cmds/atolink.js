module.exports = {
  config: {
    name: "autolinkbtn",
    author: "SaGor",
    role: 0,
    shortDescription: "Auto reply with buttons",
    longDescription: "Specific messages trigger button replies.",
    category: "BOT",
    guide: "{pn}"
  },

  onChat: async function ({ api, event, message }) {

    const text = event.body?.toLowerCase();
    if (!text) return;

    // ট্রিগার + রিপ্লাই + বাটন
    const triggers = {
      "group": {
        body: "🔗 আমাদের অফিসিয়াল ফেসবুক গ্রুপ:",
        buttons: [
          {
            type: "web_url",
            url: "https://facebook.com/groups/islamik.life1/",
            title: "➡ গ্রুপে যান"
          }
        ]
      },

      "page": {
        body: "📢 আমাদের অফিসিয়াল ফেসবুক পেজ:",
        buttons: [
          {
            type: "web_url",
            url: "https://www.facebook.com/Islamic.Fundation",
            title: "➡ পেজ দেখুন"
          }
        ]
      },

      "textgroup": {
        body: "💬 টেক্সট / চ্যাট গ্রুপ লিংক:",
        buttons: [
          {
            type: "web_url",
            url: "https://m.me/j/Abawo-69GGiHYihE/",
            title: "➡ টেক্সট গ্রুপ"
          }
        ]
      }
    };

    // ট্রিগার চেক
    for (const key in triggers) {
      if (text.includes(key)) {
        const content = triggers[key];
        return api.sendMessage(
          {
            body: content.body,
            attachment: null,
            buttons: content.buttons
          },
          event.threadID,
          event.messageID
        );
      }
    }
  },

  onStart: async function () {}
};
