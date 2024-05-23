import type { SlashCommandProps, CommandData } from 'commandkit'
import suggestionConfig from '../../models/misc/suggestionConfig'
import { EmbedBuilder } from 'discord.js'
import { emojiId } from '../../../config.json'
export const data:CommandData = {
    name: 'config-suggestion', 
    description: "Manage the suggestion module",
    dm_permission: false
}

export async function run ({ interaction }: SlashCommandProps) {
    if (!interaction.inCachedGuild()) return;

    await interaction.reply({
        content: "This command is under construction",
        ephemeral: true
    })

    const isModuleEnabled = await suggestionConfig.findOne({
        guildId: interaction.guildId
    })

    const configEmbed = new EmbedBuilder()
    .setAuthor(
        { name: `Suggestion Module`, iconURL: interaction.guild?.iconURL() || undefined }
    )
    .addFields(
        { name: 'Enabled', value: isModuleEnabled ? emojiId[0].id : emojiId[1].id }, 
        { name: 'Channel', value: isModuleEnabled ? `<#${isModuleEnabled.channelId}>` : emojiId[1].id },
        { name: 'Manage Role', value: isModuleEnabled ? `<@&${isModuleEnabled.roleId}>` : emojiId[1].id }
    )
    .setColor(interaction.member.displayHexColor || "White")
    
}