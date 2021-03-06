import { Breakdown, Game, GameStats, Status } from './Classes';
import Overrides from './overrides.json';

function remapStatus(status: string) {
  if (status.includes('unconfirmed')) {
    return Status.broken;
  } else if (status.includes('confirmed')) {
    return Status.planned;
  } else if (status.includes('denied')) {
    return Status.denied;
  } else if (status.includes('supported')) {
    return Status.supported;
  } else {
    return 1337;
  }
}

function stripUnicode(anticheat: string) {
  return anticheat.replace(/[^\x00-\x7F]/g, '');
}

export async function fetchNewData(previousData: Game[]) {
  const areweanticheatyet_data = await fetch(
    'https://raw.githubusercontent.com/Starz0r/AreWeAntiCheatYet/master/src/static/games.json'
  );
  const json = await areweanticheatyet_data.json();
  const results: Game[] = [];

  json.forEach((item: any) => {
    const game: Game = {
      name: item.game as string,
      anticheats: (item.acList as string[]).map(item => stripUnicode(item).trim()),
      status: remapStatus((item.acStatus as string).toLocaleLowerCase()),
      reference: item.acStatusUrl as string,
      logo: '',
      native: false,
    };
    results.push(game);
  });

  outerLoop: for (const _override of Overrides) {
    const override = _override as any;
    for (const game of results) {
      if (game.name == override.name) {
        for (const [key, value] of Object.entries(override)) {
          if (key == 'rename') {
            game.name = value as string;
          } else {
            (game as any)[key] = value;
          }
        }
        if (override.addition) {
          continue outerLoop;
        }
      }
    }

    if (override.addition) {
      results.push(override as unknown as Game);
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
    return fetch(
      `https://api.allorigins.win/get?url=https://www.igdb.com/search_autocomplete_all?q=${game.name}`
    );
  });

  const resolved = await Promise.all(promises);
  for (const [index, data] of resolved.entries()) {
    if (data.ok) {
      const json = await data.json();
      const game_results = JSON.parse(json.contents);
      games[
        filtered[index].idx
      ].logo = `https://images.igdb.com/igdb/image/upload/t_cover_big/${game_results.game_suggest[0].cloudinary}.png`;
    }
  }

  return [...games]; //? Required to trigger re-render
}

export function fetchChanges(previous: Game[], current: Game[]) {
  const changes: Array<Game | Game[]> = [];
  if (previous.length > 0) {
    outerLoop: for (const currentGame of current) {
      for (const oldGame of previous) {
        if (currentGame.name == oldGame.name) {
          if (
            JSON.stringify(currentGame.anticheats) != JSON.stringify(oldGame.anticheats) ||
            currentGame.status != oldGame.status ||
            currentGame.reference != oldGame.reference ||
            (currentGame.native && !oldGame.native) ||
            (typeof oldGame.native === 'boolean' && currentGame.native != oldGame.native)
          ) {
            changes.push([oldGame, currentGame]);
          }
          continue outerLoop;
        }
      }
      changes.push(currentGame);
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
      case Status.planned:
        stats.planned++;
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
        case Status.planned:
          breakdown.get(anticheat)!.planned++;
          break;
        case Status.supported:
          breakdown.get(anticheat)!.supported++;
          break;
      }
    });
  }

  return Array.from(breakdown.values());
}
