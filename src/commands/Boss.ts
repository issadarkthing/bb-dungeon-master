import { Command } from "@jiman24/commandment";
import { ButtonHandler } from "@jiman24/discordjs-button";
import { random } from "@jiman24/discordjs-utils";
import { Message } from "discord.js";
import { Monster } from "../structure/Monster";
import { Player } from "../structure/Player";
import { Battle } from "../structure/Battle";

export default class extends Command {
  name = "boss";
  description = "fight boss with your members";
  minPlayers = 2;
  maxPlayers = 10;

  async exec(msg: Message) {

    const monster = Monster.random();
    const monsterInfo = monster.show();

    monsterInfo.setDescription(`Waiting for ${this.minPlayers}-${this.maxPlayers} players to join`);

    const menu = new ButtonHandler(msg, monsterInfo)
      .setMultiUser(this.maxPlayers);

    const players: Player[] = [];

    menu.addButton("join", user => {

      try { 
        const player = Player.fromUser(user); 
        players.push(player);
        msg.channel.send(`${player.name} has joined the battle`);

      } catch (err) {
        msg.channel.send((err as Error).message);
      }

    });

    await menu.run();
   
    const battle = new Battle(msg, players, [monster]);

    await battle.run();

    const isWin = random.bool();

    if (isWin) {
      const kingSlayer = random.pick(players);

      msg.channel.send(`${kingSlayer.name} killed the boss!`);
      msg.channel.send(`${monster.name} has been defeated`);

    } else {
      msg.channel.send(`Everyone has been slayed by ${monster.name}`);
      msg.channel.send(`${monster.name} won the battle`);
    }

  }
}
