export class GameStats {
    total = 0;
    broken = 0;
    denied = 0;
    running = 0;
    planned = 0;
    supported = 0;
};

export enum Status {
    broken,
    denied,
    running,
    supported,
    planned,
}

export class Breakdown extends GameStats {
    anticheat: string

    constructor(ac: string) {
        super();
        this.anticheat = ac;
    }
}

export interface Game {
    name: string;
    logo: string;
    status: Status;
    native: boolean;
    reference: string;
    anticheats: string[];
}
