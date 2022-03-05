import { random, sleep } from "@jiman24/discordjs-utils";
import { Message, MessageEmbed, MessageOptions, MessagePayload } from "discord.js";
import { Entity } from "./Entity";

const texts = [
  [
    `%opponent slams %player hardly 🔻`,
    `%player slashes %opponent with his magical weapon 🔺`,
    `%opponent using its powerful move to hit %player 🔻`,
    `%opponent is making another combo move to hit %player 🔻`,
    `%player managed to escape from the combo move by %opponent 🔺`
  ],
  [
    `%player is making the first move. 🔺`,
    `%opponent dodged the attack and makes a counter-attack 🔻`,
    `%player severely injured from the %opponent's counter-attack 🔻`,
    `%opponent is using it's powerful attack 🔻`,
    `%player managed to parry %opponent's powerful attack 🔺`
  ],
  [
    `%opponent charges to %player rapidly and causes great damage 🔻`,
    `%player is using a skill to attack %opponent 🔺`,
    `%opponent does not seem to take any major damage 🔻`,
    `%opponent is attacking %player ferociously 🔻`,
    `%player uses a magical weapon to hit %opponent 🔺`
  ]
];

function replaceText(text: string, playerName: string, opponentName: string) {
  return text
    .replace("%opponent", opponentName)
    .replace("%player", playerName);
}

export class Battle {
  textSet = random.pick(texts);
  interval = 2000;

  constructor(
    private msg: Message, 
    private entities1: Entity[], 
    private entities2: Entity[],
  ) {}

  private send(options: string | MessagePayload | MessageOptions) {
    return this.msg.channel.send(options);
  }


  async run() {

    this.send("Starting battle");

    for (const text of this.textSet) {

      const player = random.pick(this.entities1);
      const opponent = random.pick(this.entities2);

      const color = text.includes("🔺") ? "GREEN" : "RED";
      const battleText = replaceText(text, player.name, opponent.name);
      const image = text.includes("🔺") ? player.imageUrl : opponent.imageUrl;
      const embed = new MessageEmbed()
        .setThumbnail(image)
        .setColor(color)
        .setDescription(battleText);

      const battleMsg = await this.send({ embeds: [embed] });

      await sleep(this.interval);

      if (battleMsg.deletable) {
        await battleMsg.delete().catch(() => {});
      }
    }
  }
}

