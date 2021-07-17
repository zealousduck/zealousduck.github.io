import build from "next/dist/build";
import { Animals } from "./animals";
import { BodyParts } from "./bodyparts";
import { dForList } from "./dice";
import { LargeEnemies, MediumEnemies, SmallEnemies } from "./enemies";
import { Wildlocations } from "./locations";
import { Races } from "./races";
import { Townsfolk } from "./townsfolk";

export type Quest = {
  _type: "indeednd_quest";
  template: string;
}

const buildQuest = (q: Omit<Quest, "_type">): Quest => ({ ...q, _type: "indeednd_quest" });

const quests: Quest[] = [
  buildQuest({
    template: `The ${Townsfolk._type} wants the mine cleared of ${SmallEnemies._type}.`
  })
  , buildQuest({
    template: `The ${Townsfolk._type} needs a package delivered to the hermit on the outskirts of town.`
  })
  , buildQuest({
    template: `A group of ${MediumEnemies._type} has been raiding the town. The captain of the guard wants you to clear out their camp.`
  })
  , buildQuest({
    template: `The town has been overrun by cats. The ${Townsfolk._type} wants you to wrangle them.`
  })
  , buildQuest({
    template: `A nearby ${Animals._type} of unsual size has been scaring travelers. The ${Townsfolk._type} wants you to slay it.`
  })
  , buildQuest({
    template: `A ${LargeEnemies._type} has made its home in the cavern below the town. The mayor is offering a reward for its ${BodyParts._type}.`
  })
  , buildQuest({
    template: `Some ${MediumEnemies._type} are hiding in the nearby woods and attacking travelers.`
  })
  , buildQuest({
    template: `The ${Townsfolk._type}'s wife thinks her partner is cheating on her. She's offering a reward to confront them.`
  })
  , buildQuest({
    template: `The ${Townsfolk._type}'s pet ${Animals._type} is missing. It was last seen near the town well.`
  })
  , buildQuest({
    template: `The daughter of the ${Townsfolk._type} has gone missing. She was last seen with the ${Townsfolk._type}'s son.`
  })
  , buildQuest({
    template: `The ${Townsfolk._type} wants revenge on a nearby giant ${Animals._type} for eating their pet ${Animals._type}.`
  })
  , buildQuest({
    template: `The hermit outside of town needs the carcass of a ${Animals._type} - no questions asked.`
  })
  , buildQuest({
    template: `The ${Townsfolk._type} needs a letter discretely delivered to their lover, the ${Townsfolk._type}.`
  })
  , buildQuest({
    template: `The ${Townsfolk._type}'s mother-in-law was kidnapped by a ${LargeEnemies._type}. It is hiding in the nearby ${Wildlocations._type}.`
  })
  , buildQuest({
    template: `The farmer's fields are overrun by ${Animals._type}s. He's offering a reward to clear them out.`
  })
  , buildQuest({
    template: `The ${Townsfolk._type} needs a prescription picked up from the herbalist for their embarrassing "condition". (Discretion is appreciated.)`
  })
  , buildQuest({
    template: `A shady ${Races._type} dealer approaches you outside of town. They want the ${Townsfolk._type} to pay up.`
  })
];

export const getQuest = (): string => {
  const quest = dForList(quests);
  let text = quest.template;

  let before = text;
  let after = "";
  while (text.match(/\{\w+\}/) && before !== after) {
    before = text;
    for (const {_type, options} of [
      Townsfolk
      , Races
      , SmallEnemies
      , MediumEnemies
      , LargeEnemies
      , Animals
      , BodyParts
      , Wildlocations
    ]) {
      text = text.replace(_type, dForList(options));
      // text = text.replace(_type, `<em>${dForList(options)}</em>`);
    }
    after = text;
  }

  return text;
}
