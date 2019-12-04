import "phaser";

import GameConfig = Phaser.Types.Core.GameConfig;
import Game = Phaser.Game;

import {BootView} from "./views/boot.view";
import { Plugin as NineSlicePlugin } from "phaser3-nineslice"
import {PreloadView} from "./views/preload.view";
import {MainView} from "./views/main.view";
import {BattleView} from "./views/battle.view";

const config : GameConfig = {
    title: "Test RPG Game",
    version: "1.0",
    width: 480,
    height: 775,
    zoom: 1.0,
    parent: "game",
    scene: [BootView,PreloadView,MainView,BattleView],
    type: Phaser.AUTO,
    plugins: {
        global: [ NineSlicePlugin.DefaultCfg ],
    },
    dom: {
        createContainer: true
    },
    backgroundColor: "#000000"
}

export class App extends Game {

    private constructor() {
        super(config);
    }

    private static instance: App = null;

    static getInstance() : App {
        if (null == this.instance) {
            this.instance = new App();
        }
        return this.instance;
    }

    preload() {
        this.boot();
    }

}



window.onload = () => { const app = App.getInstance(); };