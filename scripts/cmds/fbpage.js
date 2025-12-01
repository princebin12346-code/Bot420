// filename: fbpage.js
const fs = require("fs");
const path = __dirname + "/fbpage_settings.json";

module.exports.config = {
  name: "fbpage",
  version: "1.0",
  author: "Mohammad Akash | ChatGPT Edition",
  role: 0,
  description: "যখন কেউ ফেসবুক পেজ চাইবে, পেজ লিংক এবং প্রোফাইল পাঠাবে",
  category: "Utility"
};

// ডিফল্ট সেটিংস (প্রয়োজনে per-thread enable/disable সিস্টেম যোগ করা যাবে)
if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({
    enabledThreads: [] // খালি থাকলে সব গ্রুপে কাজ করবে; নির্দিষ্ট থ্রেডে চালু করতে threadID যোগ করুন
  }, null, 2));
}

module.exports.handleEvent = async function ({ api, event, args, Users, Threads }) {
  try {
    // মেসেজ টেক্সট থাকবে event.body তে
    if (!event.body) return;

    const text = event.body.toLowerCase();

    // কীওয়ার্ড লিস্ট — 用户 এর লেখা যদি এর মধ্যে আছে তাহলে রেসপন্ড করবে
    const triggers = [
      "ফেসবুক পেজ", "facebook page", "fb page",
      "পেজ লিংক", "ফেসবুক লিংক", "fb লিংক",
      "পেজটা দাও", "facebook link", "fb link", "ফেসবুক পেজটা"
    ];

    const matched = triggers.some(k => text.includes(k));
    if (!matched) return;

    // থ্রেড এনাবল/ডিসেবল চেক (যদি সেট করা থাকে)
    const settings = JSON.parse(fs.readFileSync(path));
    if (Array.isArray(settings.enabledThreads) && settings.enabledThreads.length > 0) {
      // যদি enabledThreads এ নেই তাহলে রিটার্ন করবে
      if (!settings.enabledThreads.includes(String(event.threadID))) return;
    }

    // ====== এখানে আপনার পেজের তথ্য দিন ======
    const FACEBOOK_PAGE_URL = "https://www.facebook.com/Islamic.Fundation"; // <-- আপনার পেজ লিংক
    const FACEBOOK_PAGE_NAME = "আত-তাক্বওয়া ফাউন্ডেশন"; // <-- পেজের নাম
    const FACEBOOK_PAGE_DESCRIPTION = "আত-তাক্বওয়া — ধর্মীয় জ্ঞান, হাদিস ও ইসলামিক আপডেট কিছু জানতে। আমাদের পেজে যোগ দিন।"; // <-- সংক্ষিপ্ত বর্ণনা
    const FACEBOOK_PAGE_IMAGE = "https://i.imgur.com/gqKqQbR.jpeg"; // <-- পেজ/প্রোফাইল ইমেজ URL (hosted publicly)
    // ==========================================

    // সুন্দর করে বানানো বার্তা
    const messageBody =
`📘 ${FACEBOOK_PAGE_NAME}
${FACEBOOK_PAGE_DESCRIPTION}

🔗 পেজ লিংক: ${FACEBOOK_PAGE_URL}

আপনি চাইলে নিচের লিংকে ক্লিক করে পেজটি ভিজিট করতে পারেন।`;

    // attachments: যদি ইমেজ URL থাকে তবে সেটি অ্যাটাচ করে পাঠানো হবে
    const attachments = FACEBOOK_PAGE_IMAGE && FACEBOOK_PAGE_IMAGE.startsWith("http")
      ? [{ type: "image", url: FACEBOOK_PAGE_IMAGE }]
      : null;

    // send message with/without attachment
    if (attachments) {
      await api.sendMessage({ body: messageBody, attachment: attachments }, event.threadID);
    } else {
      await api.sendMessage(messageBody, event.threadID);
    }

  } catch (err) {
    console.error("FBPAGE MODULE ERROR:", err);
  }
};

module.exports.run = async function ({ api, event, args }) {
  // অপশনাল: ম্যানুয়ালি কমান্ড দিয়ে পেজ শো করানো যাবে — ইউজ করতে: "fbpage" বা "fbpage help"
  try {
    const sub = (args && args[0]) ? args[0].toLowerCase() : "";
    if (sub === "help") {
      return api.sendMessage("ব্যবহার: লিখুন 'ফেসবুক পেজ' বা 'fb page' - রোবট পেজ লিংক দিবে।", event.threadID);
    }

    // একই তথ্য run থেকে পাঠানো
    const FACEBOOK_PAGE_URL = "https://www.facebook.com/YourPageName";
    const FACEBOOK_PAGE_NAME = "আত-তাক্বওয়া ফাউন্ডেশন";
    const FACEBOOK_PAGE_DESCRIPTION = "আত-তাক্বওয়া — ধর্মীয় জ্ঞান, হাদিস ও ইসলামিক আপডেট।";
    const FACEBOOK_PAGE_IMAGE = "https://i.imgur.com/yourProfileImage.jpg";

    const messageBody =
`📘 ${FACEBOOK_PAGE_NAME}
${FACEBOOK_PAGE_DESCRIPTION}

🔗 পেজ লিংক: ${FACEBOOK_PAGE_URL}`;

    if (FACEBOOK_PAGE_IMAGE && FACEBOOK_PAGE_IMAGE.startsWith("http")) {
      await api.sendMessage({ body: messageBody, attachment: [{ type: "image", url: FACEBOOK_PAGE_IMAGE }] }, event.threadID);
    } else {
      await api.sendMessage(messageBody, event.threadID);
    }

  } catch (err) {
    console.error(err);
  }
};
