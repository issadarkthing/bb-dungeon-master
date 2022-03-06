import { Command } from "@jiman24/commandment";
import { Message, PermissionResolvable } from "discord.js";
import { client } from "..";

export default class extends Command {
  name = "event";
  description = "set roles that can initiate event or dungeon";
  permissions: PermissionResolvable[] = ["ADMINISTRATOR"];

  async exec(msg: Message) {

    const roles = [...msg.mentions.roles.values()];

    if (roles.length === 0) {
      throw new Error("you need to mention at least 1 role");
    }

    client.settings.set("role-events", roles.map(x => x.id));

    msg.channel.send(`Successfully set roles`);

  }
}
