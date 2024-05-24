import type { SlashCommandProps, CommandData } from "commandkit";
import suggestionConfig from "../../models/misc/suggestionConfig";
import { ComponentType, EmbedBuilder } from "discord.js";
import { emojiId } from "../../../config.json";
import { suggestionRow } from "../../utils/select-menu/config-suggestion-menu";
export const data: CommandData = {
  name: "config-suggestion",
  description: "Manage the suggestion module",
  dm_permission: false,
};

export async function run({ interaction }: SlashCommandProps) {
  if (!interaction.inCachedGuild()) return;
  if (!interaction.inGuild()) return;

  await interaction.deferReply();

  const isModuleEnabled = await suggestionConfig.findOne({
    guildId: interaction.guildId,
  });

  const configEmbed = new EmbedBuilder()
    .setAuthor({
      name: `Suggestion Module`,
      iconURL: interaction.guild?.iconURL() || undefined,
    })
    .addFields(
      {
        name: "Enabled",
        value: isModuleEnabled ? emojiId[0].id : emojiId[1].id,
      },
      {
        name: "Channel",
        value: isModuleEnabled
          ? `<#${isModuleEnabled.channelId}>`
          : emojiId[1].id,
      },
      {
        name: "Manage Role",
        value: isModuleEnabled
          ? `<@&${isModuleEnabled.roleId}>`
          : emojiId[1].id,
      }
    )
    .setColor(interaction.member.displayHexColor || "White")
    .setThumbnail(interaction.guild.iconURL() || null);

  const response = await interaction.editReply({
    embeds: [configEmbed],
    components: [suggestionRow],
  });

  const collector = response.createMessageComponentCollector({
    time: 240_000,
    componentType: ComponentType.StringSelect,
    filter: (i) => i.user.id == interaction.user.id,
  });

  const messageFilter = (message: import("discord.js").Message) =>
    message.author.id == interaction.user.id;

  collector.on("collect", async (i) => {
    switch (i.values[0]) {
      case "suggestion-channel":
        await i.deferReply({ ephemeral: true });
        if (!isModuleEnabled) {
          if (!interaction.channel)
            return await interaction.editReply(
              "You can configure it only in a guild channel"
            );
          await i.editReply("Enter the channelId in chat under next 1 minute");
          const messageCollector = interaction.channel?.createMessageCollector({
            time: 60_000,
            filter: messageFilter,
          });

          messageCollector.on("collect", async (message) => {
            const channelId = message.content;
            const channel = interaction.guild.channels.cache.get(channelId);
            if (!channel) {
              await i.followUp({
                content: "Please Enter A Valid Channel",
                ephemeral: true,
              });
              return;
            }
            suggestionConfig
              .create({ guildId: interaction.guildId, channelId: channel.id })
              .then(() => {
                i.followUp({
                  embeds: [
                    {
                      description: `${emojiId[0].name} ${channel} Has Been Configured for suggestions`,
                      color: 0x00ff00,
                    },
                  ],
                  ephemeral: true,
                });
              })
              .catch((err) => {
                console.error(`DB Error :  ${err}`);
                i.followUp({
                  content: "DB Error, Try Again Later",
                  ephemeral: true,
                });
                return;
              });
          });
        } else {
          suggestionConfig
            .deleteMany({ guildId: interaction.guildId })
            .then(() => {
              i.editReply("Disabled The Suggestion Module");
            })
            .catch((err) => {
              console.error(`DB Error :  ${err}`);
              i.editReply("DB Error, Try Again Later");
              return;
            });
        }
        break;
    }
  });
}
