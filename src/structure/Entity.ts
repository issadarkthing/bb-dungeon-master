import { MessageEmbed } from "discord.js";


export abstract class Entity {
  constructor(
    public id: string,
    public name: string,
    public imageUrl: string,
  ) {}

  show() {
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(this.name)
      .setImage(this.imageUrl);

    return embed;
  }
}
