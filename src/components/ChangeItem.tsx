import { Avatar, Group, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { ArrowRight, ArrowsRightLeft, Plus, Refresh } from "tabler-icons-react";
import { Game } from "../Classes";
import AntiCheatBadge from "./AntiCheatBadge";
import SupportBadge from "./SupportBadge";

interface ChangeItemProps {
    changes: Game | Game[];
}

export default function ChangeItem({ changes: change }: ChangeItemProps) {
    if (Array.isArray(change)) {
        const [old_game, new_game] = change;

        return <Group>
            <Group noWrap>
                <ThemeIcon color="violet" radius="xl"><Refresh /></ThemeIcon>
                <Avatar radius="xl" src={old_game.logo} />
                <Text>{old_game.name}</Text>
            </Group>
            <ArrowsRightLeft />
            <Group noWrap>
                <SupportBadge status={old_game.status} />
                {old_game.anticheats.map(anticheat => {
                    return <Tooltip withArrow label={anticheat} key={anticheat}>
                        <AntiCheatBadge key={anticheat} anticheat={anticheat} />
                    </Tooltip>;
                })}
            </Group>
            <ArrowRight />
            <Group noWrap>
                <SupportBadge status={new_game.status} />
                {new_game.anticheats.map(anticheat => {
                    return <Tooltip withArrow label={anticheat} key={anticheat}>
                        <AntiCheatBadge key={anticheat} anticheat={anticheat} />
                    </Tooltip>;
                })}
            </Group>
        </Group>
    }
    else {
        return <Group noWrap>
            <ThemeIcon color="green" radius="xl"><Plus /></ThemeIcon>
            <Avatar radius="xl" src={change.logo} />
            <Text>{change.name}</Text>
            <SupportBadge status={change.status} />
            {change.anticheats.map(anticheat => {
                return <AntiCheatBadge key={anticheat} anticheat={anticheat} />
            })}
        </Group>
    }
}