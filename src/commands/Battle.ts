import { Command } from "@jiman24/commandment";
import { bold, random } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { Monster } from "../structure/Monster";
import { Player } from "../structure/Player";
import { Duel } from "../structure/Battle";

export default class extends Command {
  name = "battle";
  description = "battle monsters";

  async exec(msg: Message) {

    const monster = Monster.random();
    const player = Player.fromUser(msg.author);

    msg.channel.send(`${bold(player.name)} vs ${bold(monster.name)}`);

    const battle = new Duel(msg, player, monster);

    await battle.run();

    const isWin = random.bool();

    if (isWin) {
      msg.channel.send(`${bold(player.name)} has won the battle`);
    } else {
      msg.channel.send(`${bold(player.name)} has been defeated`);
    }

  }
}
