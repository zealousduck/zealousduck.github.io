import { Races } from "./races"

export const SmallEnemies = {
  _type: "{small_enemy}"
  , options: [
    "kobolds"
    , "wolves"
    , "goblins"
    , "boars"
    , "spiders"
  ]
}

export const MediumEnemies = {
  _type: "{indeednd_medium_enemy}"
  , options: [
    "bandits"
    , `${Races._type} bandits`
    , `dryads`
  ]
}

export const LargeEnemies = {
  _type: "{indeednd_large_enemy}"
  , options: [
    "ogre"
    , "hill giant"
  ]
}

export const SupernaturalEnemies = {
  _type: "{indeednd_spooky_enemy}"
  , options: [
    "ghost"
    , "ghoul"
    , "wraith"
    , "banshee"
  ]
}