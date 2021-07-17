import { Animals } from "./animals";
import { BodyParts } from "./bodyparts";
import { dForList } from "./dice";
import { LargeEnemies, MediumEnemies, SmallEnemies } from "./enemies";
import { Races } from "./races";
import { Townsfolk } from "./townsfolk";

export type Quest = {
  _type: "indeednd_quest";
  template: string;
}

const buildQuest = (q: Omit<Quest, "_type">): Quest => ({ ...q, _type: "indeednd_quest" });

const quests: Quest[] = [
  buildQuest({
    template: `The ${Townsfolk.pattern} wants the mine cleared of ${SmallEnemies.pattern}.`
  })
  , buildQuest({
    template: `The ${Townsfolk.pattern} needs a package delivered to the hermit on the outskirts of town.`
  })
  , buildQuest({
    template: `A group of ${MediumEnemies.pattern} has been raiding the town. The captain of the guard wants you to clear out their camp.`
  })
  , buildQuest({
    template: `The town has been overrun by cats. The ${Townsfolk.pattern} wants you to wrangle them.`
  })
  , buildQuest({
    template: `A nearby ${Animals.pattern} of unsual size has been scaring travelers. The ${Townsfolk.pattern} wants you to slay it.`
  })
  , buildQuest({
    template: `A ${LargeEnemies.pattern} has made its home in the cavern below the town. The mayor is offering a reward for its ${BodyParts.pattern}.`
  })
];

export const getQuest = (): string => {
  const quest = dForList(quests);
  let text = quest.template;

  let before = text;
  let after = "";
  while (text.match(/\{\w+\}/) && before !== after) {
    before = text;
    for (const {pattern, options} of [
      Townsfolk
      , Races
      , SmallEnemies
      , MediumEnemies
      , LargeEnemies
      , Animals
      , BodyParts
    ]) {
      text = text.replace(pattern, dForList(options));
      // text = text.replace(pattern, `<em>${dForList(options)}</em>`);
    }
    after = text;
  }

  return text;
}
