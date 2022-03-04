import { User } from "discord.js";
import { client } from "..";
import { Entity } from "./Entity";


export class Player extends Entity {

  static fromUser(user: User) {
    const data = client.players.get(user.id);
    const player = new Player(user.id, user.username, user.displayAvatarURL());

    if (!data) {
      throw new Error("Character has not been created. Please run `!create`");
    }

    Object.assign(player, data);

    player.name = user.username;
    
    return player;
  }

  save() {
    client.players.set(this.id, { ...this });
  }
}
