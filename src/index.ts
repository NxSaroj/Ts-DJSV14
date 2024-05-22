import { CommandKit } from "commandkit";
import { Client } from "discord.js";
import { connect } from "mongoose";

import path from "path";
import * as dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    "Guilds",
    "GuildMembers",
    "MessageContent",
    "GuildPresences",
    "GuildVoiceStates",
    "DirectMessages",
  ],
});

new CommandKit({
  client,
  commandsPath: path.join(__dirname, "commands"),
  eventsPath: path.join(__dirname, 'events'),
  bulkRegister: true,
});



/**MongoDB and Client Connection */
connect(process.env.DB_URI)
  .then(() => {
    client.login(process.env.TOKEN);
  })
  .catch((err) => {
    console.error(
      `MongoDB Connection Error: Filename \n ${__filename} \n Error \n ${err}`
    );
    return;
  });
