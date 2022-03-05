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

abstract class Battle {
  textSet = random.pick(texts);
  interval = 2000;

  constructor(protected msg: Message) {}

  protected send(options: string | MessagePayload | MessageOptions) {
    return this.msg.channel.send(options);
  }

  abstract run(): Promise<void>;
}

export class Duel extends Battle {
  constructor(msg: Message, public entity1: Entity, public entity2: Entity) {
    super(msg);
  }

  async run() {

    this.send("Starting battle");

    for (const text of this.textSet) {

      const attacker = text.includes("🔺") ? this.entity1 : this.entity2;
      const color = text.includes("🔺") ? "GREEN" : "RED";
      const battleText = replaceText(text, this.entity1.name, this.entity2.name);
      const embed = new MessageEmbed()
        .setThumbnail(attacker.imageUrl)
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

