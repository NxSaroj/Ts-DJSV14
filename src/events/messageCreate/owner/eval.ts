import { utils, management, emojiId } from "../../../../config.json";
import prettyMilliseconds from "pretty-ms";
export default async function (message: import("discord.js").Message) {
  if (message.content.startsWith(`${utils[0].prefix}eval`)) {
    if (message.author.id !== management[0].id)
      return message.channel.send(
        `${emojiId[1].id} This command can only used by owners`
      );
    const response = await message.channel.send(`Evaluating the code...`);
    const code = message.content.slice(`${utils[0].prefix}eval`.length).trim();

    try {
      const startTime = new Date().getTime();
      const output = eval(code);
      const endTime = new Date().getTime();
      if (output instanceof Promise) await eval;
      if (typeof eval == "object") JSON.stringify(eval);
      await response.edit(
        `**__Evaled__**\n\`\`\`js\n${output}\n\`\`\`\n**__Time Taken__**\n${prettyMilliseconds(
          endTime - startTime
        )}\n\n__**Type**__\n${typeof output}`
      );
    } catch (err) {
      response.edit(`\`\`\`js\n${err}\n\`\`\``);
      return;
    }
  }
}
