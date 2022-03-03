import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { ButtonHandler } from "@jiman24/discordjs-button"; 
import { random, time } from "@jiman24/discordjs-utils";
import { Player } from "../structure/Player";
import { Monster } from "../structure/Monster";
import { stripIndents } from "common-tags";

export default class extends Command {
  name = "event";
  waitTime = time.MINUTE * 2;
  maxPlayers = 10;
  minPlayers = 2;
  maxMonsters = 5;
  description?: string | undefined = "start an event";

  async exec(msg: Message) {

    const menu = new ButtonHandler(
      msg, 
      `Waiting for players to join the event`
    );

    const players: Player[] = [];

    menu.addButton("join", user => {
      const player = Player.fromUser(user);
      players.push(player);
    });

    await menu.run();

    if (players.length < this.minPlayers)
      throw new Error(`this event requires min ${this.minPlayers} players`);

    const monsters = Array(this.maxMonsters).fill(0).map(() => Monster.random());

    while (monsters.length > 0 && players.length > 0) {

      const monster = monsters[0];
      const player = random.pick(players);
      const isWin = random.bool();

      if (isWin) {

        msg.channel.send(`${player.name} killed ${monster.name}!`);
        monsters.shift();

      } else {

        msg.channel.send(`${player.name} was killed by ${monster.name}!`);
        const playerIndex = players.findIndex(x => x.id === player.id);
        players.splice(playerIndex, 1);

      }

    }

    if (players.length > 0) {
      
      msg.channel.send(`Winners\n${players.map(x => x.name).join("\n")}`);

    } else {
      msg.channel.send("no one survived this event");
    }

  }
}
