import suggestionConfig from "../../models/misc/suggestionConfig";

export default async function (message: import("discord.js").Message) {
  const isModuleEnabled = await suggestionConfig.findOne({
    guildId: message.guildId,
  });
  if (!isModuleEnabled) return;
  if (message.channelId !== isModuleEnabled.channelId) return;
  if (message.member?.permissions.has("Administrator")) return;
  setTimeout(async () => {
    await message.delete().catch(() => {
      return;
    });
  }, 1_000);
}
