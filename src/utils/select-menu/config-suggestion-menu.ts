import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} from "discord.js";

const suggestionMenu = new StringSelectMenuBuilder()
  .setCustomId("suggestion-menu")
  .setPlaceholder("Make a selection")
  .addOptions(
    new StringSelectMenuOptionBuilder()
      .setLabel("Suggestion Channel")
      .setDescription("Enable or disable the suggestion channel")
      .setValue("suggestion-channel"),
    new StringSelectMenuOptionBuilder()
      .setLabel("Suggestion Role")
      .setDescription("Add Or Remove The Suggestion Role")
      .setValue("suggestion-role")
  );

const suggestionRow =
  new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(suggestionMenu);
export { suggestionRow };
