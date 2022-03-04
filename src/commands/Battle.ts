import { Command } from "@jiman24/commandment";
import { bold, random, sleep } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { Monster } from "../structure/Monster";
import { Player } from "../structure/Player";

export default class extends Command {
  name = "battle";
  description = "battle monsters";

  async exec(msg: Message) {

    const monster = Monster.random();
    const player = Player.fromUser(msg.author);

    msg.channel.send(`${bold(player.name)} vs ${bold(monster.name)}`);

    await sleep(2000);

    const isWin = random.bool();

    if (isWin) {
      msg.channel.send(`${bold(player.name)} has won the battle`);
    } else {
      msg.channel.send(`${bold(player.name)} has been defeated`);
    }

  }
}
