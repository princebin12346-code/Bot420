const fs = require("fs");
const path = __dirname + "/autokicklink_groups.json";

// যদি ফাইল না থাকে → তৈরি করে
if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify([]));
}

module.exports = {
    config: {
        name: "auto kik",
        version: "3.0",
        author: "SaGor",
        role: 1,
        description: "এডমিন চালু করলে শুধু সেই গ্রুপে লিংক দিলে কিক করবে",
        category: "group protect",
        guide: {
            bn: `
{pn} on   → এই গ্রুপে লিংক কিক সিস্টেম চালু হবে
{pn} off  → এই গ্রুপে সিস্টেম বন্ধ হবে
`
        }
    },

    // --- COMMAND: ON / OFF ---
    onStart: async function ({ api, event, args, message }) {
        const groupList = JSON.parse(fs.readFileSync(path));
        const threadID = event.threadID;

        if (!args[0])
            return message.reply("❌ ব্যবহার: on / off");

        // চালু করা
        if (args[0] === "on") {
            if (groupList.includes(threadID))
                return message.reply("⚠️ এই গ্রুপে আগেই ফিচার চালু আছে।");

            groupList.push(threadID);
            fs.writeFileSync(path, JSON.stringify(groupList));
            return message.reply("✅ এখন থেকে এই গ্রুপে লিংক দিলে বট রিমুভ করবে।");
        }

        // বন্ধ করা
        if (args[0] === "off") {
            const index = groupList.indexOf(threadID);
            if (index === -1)
                return message.reply("⚠️ এই গ্রুপে ফিচার চালু ছিল না।");

            groupList.splice(index, 1);
            fs.writeFileSync(path, JSON.stringify(groupList));
            return message.reply("❌ এই গ্রুপে লিংক কিক সিস্টেম বন্ধ করা হলো।");
        }
    },

    // --- AUTO CHAT CHECK ---
    onChat: async function ({ api, event, message }) {
        const groupList = JSON.parse(fs.readFileSync(path));
        const threadID = event.threadID;

        // যদি এডমিন এই গ্রুপে "on" না করে → কিছুই করবে না
        if (!groupList.includes(threadID)) return;

        const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|facebook\.com|fb\.com|t\.me|youtube\.com|youtu\.be|wa\.me)/i;

        const msg = event.body ? event.body.toLowerCase() : "";
        if (!linkRegex.test(msg)) return;

        const botID = api.getCurrentUserID();
        if (event.senderID === botID) return;

        const warn = 
`🚫 𝗟𝗜𝗡𝗞 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗!
———————————————
লিংক দেওয়া এই গ্রুপে সম্পূর্ণ নিষিদ্ধ!

❌ আপনাকে রিমুভ করা হচ্ছে।
`;

        await message.reply(warn);

        try {
            await api.removeUserFromGroup(event.senderID, threadID);
        } catch (e) {
            message.reply("⚠️ রিমুভ করা গেল না! বট অ্যাডমিন কিনা চেক করুন।");
        }
    }
};
