import { Command } from "@jiman24/commandment";
import { Message } from "discord.js";
import { Prompt } from "@jiman24/discordjs-prompt";
import { Player } from "../structure/Player";
import { bold } from "@jiman24/discordjs-utils";


export default class extends Command {
  name = "create";
  description = "creates your character";

  async exec(msg: Message) {

    const prompt = new Prompt(msg);
    const collected = await prompt.collect("Please upload your NFT profile picture");
    const imageUrl = collected.attachments.first()?.url;

    if (!imageUrl) {
      throw new Error("no image provided");
    }

    const player = new Player(msg.author.id, msg.author.username, imageUrl);
    player.save();

    msg.channel.send(`Successfully created ${bold(player.name)}!`);
    msg.channel.send(`Use command \`!profile\` to check your profile`);

  }
}
