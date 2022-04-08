import { Breakdown, Game, GameStats, Status } from "./Classes";
import Overrides from './overrides.json';

export function remapStatus(status: string) {
    if (status.includes("unconfirmed")) {
        return Status.broken;
    } else if (status.includes("confirmed")) {
        return Status.confirmed;
    } else if (status.includes("denied")) {
        return Status.denied;
    } else if (status.includes("supported")) {
        return Status.supported;
    } else {
        return 1337;
    }
};

export function stripUnicode(anticheat: string) {
    return anticheat.replace(/[^\x00-\x7F]/g, "");
}

export async function fetchNewData(previousData: Game[]) {
    const areweanticheatyet_data = await fetch("https://raw.githubusercontent.com/Starz0r/AreWeAntiCheatYet/master/src/static/games.json");
    const json = await areweanticheatyet_data.json();
    const results: Game[] = [];

    json.forEach((item: any) => {
        const game: Game = { name: item.game as string, anticheats: (item.acList as string[]).map(item => stripUnicode(item)), status: remapStatus((item.acStatus as string).toLocaleLowerCase()), reference: item.acStatusUrl as string, logo: "" };
        results.push(game);
    });

    for (const _override of Overrides) {
        const override = _override as any;
        if (override.addition) {
            results.push(override as unknown as Game);
        }
        else {
            for (const game of results) {
                if (game.name == override.name) {
                    for (const [key, value] of Object.entries(override)) {
                        (game as any)[key] = value;
                    }
                }
            }
        }
    }

    for (const oldGame of previousData) {
        for (const newGame of results) {
            if (oldGame.name == newGame.name) {
                newGame.logo = oldGame.logo;
            }
        }
    }

    return results;
}

export async function fetchIcons(games: Game[]) {
    const filtered = games.map((item, index) => ({ ...item, idx: index })).filter(({ logo }) => !logo);

    const promises = filtered.map(game => {
        return fetch(`https://api.allorigins.win/get?url=https://www.igdb.com/search_autocomplete_all?q=${game.name}`);
    });

    const resolved = await Promise.all(promises);
    resolved.forEach(async (data, index) => {
        if (data.ok) {
            const json = await data.json();
            const game_results = JSON.parse(json.contents);
            games[filtered[index].idx].logo = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game_results.game_suggest[0].cloudinary}.png`;
        }
    });

    return games;
}

export function fetchChanges(previous: Game[], current: Game[]) {
    const changes: Array<Array<Game>> = [];
    if (previous.length > 0) {
        outerLoop:
        for (const currentGame of current) {
            for (const oldGame of previous) {
                if (currentGame.name == oldGame.name) {
                    if (JSON.stringify(currentGame) != JSON.stringify(oldGame)) {
                        changes.push([oldGame, currentGame]);
                    }
                    continue outerLoop;
                }
            }
            changes.push([currentGame]);
        }
    }

    return changes;
}

export function getGameStats(games: Game[]) {
    const stats = new GameStats();

    for (const game of games) {
        stats.total++;

        switch (game.status) {
            case Status.denied:
                stats.denied++;
                break;
            case Status.broken:
                stats.broken++;
                break;
            case Status.running:
                stats.running++;
                break;
            case Status.confirmed:
                stats.confirmed++;
                break;
            case Status.supported:
                stats.supported++;
                break;
        }
    }

    return stats;
}

export function getBreakdown(games: Game[]) {
    const breakdown = new Map<string, Breakdown>();

    for (const game of games) {
        game.anticheats.forEach(anticheat => {
            if (!breakdown.has(anticheat)) {
                breakdown.set(anticheat, new Breakdown(anticheat));
            }

            const item = breakdown.get(anticheat)!;
            item.total++;

            switch (game.status) {
                case Status.denied:
                    breakdown.get(anticheat)!.denied++;
                    break;
                case Status.broken:
                    breakdown.get(anticheat)!.broken++;
                    break;
                case Status.running:
                    breakdown.get(anticheat)!.running++;
                    break;
                case Status.confirmed:
                    breakdown.get(anticheat)!.confirmed++;
                    break;
                case Status.supported:
                    breakdown.get(anticheat)!.supported++;
                    break;
            }
        });
    }

    return Array.from(breakdown.values());
}