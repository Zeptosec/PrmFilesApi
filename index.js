require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const fileUpload = require("express-fileupload");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");
const fileNameLimiter = require("./middleware/fileNameLimiter");

//const { AddFileToDB } = require('./database');
const { Client, GatewayIntentBits } = require("discord.js");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
  // client.channels.cache.get(process.env.CHANNEL_ID).send({
  //     files: ['package.json']
  // })
  //     .catch(console.error);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply("Server info.");
  } else if (commandName === "user") {
    await interaction.reply("User info.");
  }
});

/**
 *
 * @param {File} file the file to save
 * @returns link to saved file
 */
async function saveFile(file) {
  if (client.isReady) {
    //console.log(file.name);
    //const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    //console.log(channel);
    let msg = await client.channels.cache
      .get(process.env.CHANNEL_ID)
      .send({
        files: [
          {
            attachment: file.data,
            name: file.name,
          },
        ],
      })
      .catch(console.error);
    let uploaded = await msg.attachments.map((a) => a.url);
    return uploaded[0];
  } else {
    console.log("not ready");
  }
}

// Login to Discord with your client's token
client.login(process.env.TOKEN);

//const userRoutes = require('./routes/user');

var cors = require("cors");
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

//app.use('/api/user', userRoutes);

app.get("/", function (req, res) {
  res.status(200).json({ msg: "Return to https://permafilestore.netlify.app" });
});

app.post(
  "/api/upload",
  fileUpload({ createParentPath: true }),
  fileSizeLimiter,
  fileNameLimiter,
  async (req, res) => {
    const files = req.files;
    //console.log("file: " + files.file)
    const location = await saveFile(files.file);
    //const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    //await AddFileToDB(location, files.file.name, ip, null);
    res.status(200).json({ msg: "File saved!", location });
  }
);

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://tqvqsgobggitvvwffmdo.supabase.co",
  process.env.SERVICE_KEY
);

app.get("/api/file", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "No id was specified" });
  if (id.length != 36)
    return res.status(400).json({ error: "Id must be 36 chars long" });
  const { error, data, count } = await supabase
    .from("Files")
    .select("fileid, name, size, chunks, previous, next")
    .eq("fileid", id);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  if (data.length == 0) {
    return res.status(200).json({ msg: "file was not found" });
  } else {
    return res.status(200).json({ msg: "File found", data });
  }
});

let port = process.env.PORT || 3001;
app.listen(port, () => console.log("running on port: " + port));
