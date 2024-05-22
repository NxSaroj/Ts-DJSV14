import type { Client } from "discord.js";

export default function (c: Client, client: Client) {
    console.log(c.user?.username + "Is Ready");
    
}