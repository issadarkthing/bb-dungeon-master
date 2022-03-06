import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { ButtonHandler } from "@jiman24/discordjs-button"; 
import { random, time } from "@jiman24/discordjs-utils";
import { Player } from "../structure/Player";
import { Monster } from "../structure/Monster";
import { Battle } from "../structure/Battle";
import { client } from "..";

export default class extends Command {
  name = "dungeon";
  waitTime = time.MINUTE * 2;
  maxPlayers = 10;
  minPlayers = 2;
  maxMonsters = 5;
  description = "fight in the dungeon";

  async exec(msg: Message) {

    const member = msg.member!;
    const validRoles = client.settings.ensure("role-events", []) as string[];

    // if player does not have any of these roles
    if (!member.roles.cache.some(x => validRoles.includes(x.id))) {
      throw new Error("missing role to initiate event");
    }

    const menu = new ButtonHandler(
      msg, 
      `Waiting for ${this.minPlayers}-${this.maxPlayers} players to join the event`
    );

    menu.setMultiUser(this.maxPlayers);

    const players: Player[] = [];

    menu.addButton("join", user => {

      try {
        const player = Player.fromUser(user);
        players.push(player);
        msg.channel.send(`${player.name} joined the battle`);

      } catch (err) {
        msg.channel.send((err as Error).message);
      }

    });

    await menu.run();

    if (players.length < this.minPlayers)
      throw new Error(`this event requires min ${this.minPlayers} players`);

    const monsters = Array(this.maxMonsters).fill(0).map(() => Monster.random());

    while (monsters.length > 0 && players.length > 0) {

      const monster = monsters[0];
      const player = random.pick(players);
      const isWin = random.bool();

      const battle = new Battle(msg, players, [monster]);

      await battle.run();

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
