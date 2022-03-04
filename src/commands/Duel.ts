import { Command } from "@jiman24/commandment";
import { random } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { Player } from "../structure/Player";


export default class extends Command {
  name = "duel";
  description = "duel with another person";

  async exec(msg: Message) {

    const mentionedMember = msg.mentions.members?.first();

    if (!mentionedMember) {
      throw new Error("you need to mention member you want to duel with");
    }
   
    const player = Player.fromUser(msg.author);
    const opponent = Player.fromUser(mentionedMember.user);

    const [winner, loser] = random.shuffle([player, opponent]);

    msg.channel.send(`${winner.name} has won the battle against ${loser.name}!`);

  }
}
