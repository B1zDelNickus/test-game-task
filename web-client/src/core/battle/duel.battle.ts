import {IBattle} from "./i.battle";
import {Character} from "../player/character";

export class DuelBattle implements IBattle {

    enemy: Character = null;
    player: Character = null;

}