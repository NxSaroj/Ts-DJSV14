import type { CommandData, SlashCommandProps } from "commandkit";
import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import suggestionConfig from "../../models/misc/suggestionConfig";
export const data: CommandData = {
  name: "suggest",
  description: "Make a suggestion for the guild",
  dm_permission: false,
};

export async function run({ interaction }: SlashCommandProps) {
  const isModuleEnabled = await suggestionConfig.findOne({
    guildId: interaction.guildId,
  });
  if (!isModuleEnabled)
    return await interaction.reply(
      "Suggestion Module Is Disabled In This Server."
    );
  const suggestionModal = new ModalBuilder().setCustomId("suggestion-modal").setTitle("Suggestion Modal");

  const suggestionInput = new TextInputBuilder()
    .setCustomId("suggestion-input")
    .setLabel("Enter your suggestion here")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const inputRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    suggestionInput
  );
  suggestionModal.addComponents(inputRow);

  await interaction.showModal(suggestionModal).catch((err) => {
    console.error(`DJS Modal Error : ${err}`);
    interaction.reply("Error while opening modal. Try again later");
    return;
  });
}
