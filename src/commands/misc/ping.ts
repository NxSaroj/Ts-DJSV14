import type { CommandData, SlashCommandProps } from "commandkit";

export const data:CommandData = {
    name: 'ping', 
    description: "Fetch bot latency", 
    dm_permission: false
}

export  function run ({ interaction, client }: SlashCommandProps) {
    interaction.reply(`👋 ${client.ws.ping}ms`)
}