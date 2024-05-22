import type { SlashCommandProps, CommandData } from "commandkit";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";

/**Importing Schema */
import welcomeConfig from "../../models/misc/welcomeConfig";

export const data: CommandData = {
  name: "welcome-setup",
  description: "Enable or disable the welcome module",
  options: [
    {
      name: "channel",
      description: "The channel to send welcome messages",
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildAnnouncement, ChannelType.GuildText],
      required: true,
    },
    {
      name: "message",
      description: "Welcome Message | TagScript Variables",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  dm_permission: false,
};

export async function run({ interaction }: SlashCommandProps) {
  if (!interaction.inCachedGuild()) return;
  const moduleEnabled = await welcomeConfig.findOne({
    guildId: interaction.guildId,
  });
  if (moduleEnabled) {
    welcomeConfig
      .deleteMany({ guildId: interaction.guildId })
      .then(() => {
        interaction.reply({
          content: "The welcome module has been disabled",
          ephemeral: true,
        });
      })
      .catch((err) => {
        console.error(`DB Error: \n ${err}`);
        interaction.reply({
          content: "DB Error, Try Again Later",
          ephemeral: true,
        });
        return;
      });
  }
  const channel = interaction.options.getChannel("channel");
  const welcomeMessage =
    interaction.options.getString("message") ||
    "Hey {user.username} Welcome to {guild.name}";
  welcomeConfig
    .create({
      guildId: interaction.guildId,
      channelId: channel?.id,
      welcomeMessage: welcomeMessage,
    })
    .then(() => {
      interaction.reply({
        content: `${channel} Has Been Configured For Welcome Messages`,
      });
    })
    .catch((err) => {
      console.error(`DB Error: \n ${err}`);
      interaction.reply({
        content: `DB Error, Try again later`,
        ephemeral: true,
      });
    });
  return;
}
