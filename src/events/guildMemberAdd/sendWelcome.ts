import welcomeConfig from "../../models/misc/welcomeConfig";
import { Interpreter, StrictVarsParser } from "tagscript";
import { GuildTransformer, MemberTransformer } from "@tagscript/plugin-discord";

export default async function (guildMember: import("discord.js").GuildMember) {
  const isModuleEnabled = await welcomeConfig.findOne({
    guildId: guildMember.guild.id,
  });

  if (!isModuleEnabled) return;
  const cachedChannel = guildMember.guild.channels.cache.get(
    isModuleEnabled.channelId
  );
  if (!cachedChannel) {
    return welcomeConfig
      .deleteMany({ guildId: guildMember.guild.id })
      .catch((err) => {
        return console.error(`DB Error : ${err}`);
      });
  }
  if (!cachedChannel.isTextBased()) return;
  const ts = new Interpreter(new StrictVarsParser());
  const welcomeMessage = await ts.run(isModuleEnabled.welcomeMessage, {
    guild: new GuildTransformer(guildMember.guild),
    user: new MemberTransformer(guildMember),
  });
  if (!welcomeMessage.body) return;
  cachedChannel.send(welcomeMessage?.body).catch(() => {
    return;
  });
}
