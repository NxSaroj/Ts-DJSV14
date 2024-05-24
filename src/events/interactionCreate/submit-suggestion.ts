import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import suggestionConfig from "../../models/misc/suggestionConfig";

export default async function (
  interaction: import("discord.js").ModalSubmitInteraction
) {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId == "suggestion-modal") {
    await interaction.reply("[+] Your suggestion has been recorded");
    const suggestion = interaction.fields.getTextInputValue("suggestion-input");
    const isModuleEnabled = await suggestionConfig.findOne({
      guildId: interaction.guildId,
    });
    if (!isModuleEnabled) return;
    const cachedChannel = interaction.guild?.channels.cache.get(
      isModuleEnabled.channelId
    );
    if (!cachedChannel) {
      suggestionConfig
        .deleteMany({ guildId: interaction.guildId })
        .catch((err) => {
          console.error(`DB Error : ${err}`);
          return;
        });
      return;
    }
    const suggestion_document = new suggestionConfig({
      guildId: interaction.guildId,
      messageId: "",
      authorId: interaction.user.id,
      messageContent: suggestion,
    });
    await suggestion_document.save();
    if (!cachedChannel.isTextBased()) return;

    const approveButton = new ButtonBuilder()
      .setCustomId(`suggestion.${suggestion_document.suggestionId}.approve`)
      .setEmoji("1209742516832706642")
      .setLabel("Approve")
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId(`suggestion.${suggestion_document.suggestionId}.reject`)
      .setEmoji("1211166597297733713")
      .setLabel("Reject")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      approveButton,
      rejectButton
    );

    try {
        const response = await cachedChannel.send({
            embeds: [
              {
                author: {
                  name: interaction.user.username,
                  icon_url: interaction.user.displayAvatarURL(),
                },
                fields: [
                  { name: "Suggestion", value: suggestion },
                  { name: "Status", value: "Pending" },
                ],
      
                color: 0xffffff,
              },
            ],
            components: [row],
          })
          suggestion_document.messageId = response.id;
          await suggestion_document.save();
    } catch (error) {
        console.error(`Error : ${error}`)
        return;
    }
  }
}
