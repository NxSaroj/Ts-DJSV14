import welcomeConfig from "../../models/misc/welcomeConfig";

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
  cachedChannel.send(isModuleEnabled.welcomeMessage).catch((err) => {
    return;
  });
}
