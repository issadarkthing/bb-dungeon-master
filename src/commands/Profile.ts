import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "profile";
  aliases: string[] = ["p"];
  description?: string | undefined = "show profile"; 

  async exec(msg: Message) {
    const player = Player.fromUser(msg.author);
    msg.channel.send({ embeds: [player.show()] });
  }
}
