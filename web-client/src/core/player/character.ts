export class Character {

    public currentHp: number = 0;

    constructor(
        public name: string = "",
        public maxHp: number = 30,
        public minPower: number = 7,
        public maxPower: number = 7,
        public magic: number = 3,
        public ava: string = "",
        public critChance: number = 10
    ) {
        this.currentHp = this.maxHp;
    }

    idDead = () => this.currentHp <= 0;

}