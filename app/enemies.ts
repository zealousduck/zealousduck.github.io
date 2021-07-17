import { Races } from "./races"

export const SmallEnemies = {
  _type: "indeednd_small_enemies"
  , pattern: "{small_enemy}"
  , options: [
    "kobolds"
    , "pack of wolves"
    , "goblins"
    , "boars"
    , "spiders"
  ]
}

export const MediumEnemies = {
  _type: "indeednd_medium_enemies"
  , pattern: "{medium_enemy}"
  , options: [
    "bandits"
    , `${Races.pattern} bandits`
  ]
}

export const LargeEnemies = {
  _type: "indeednd_large_enemy"
  , pattern: "{large_enemy}"
  , options: [
    "ogre"
    , "hill giant"
  ]
}