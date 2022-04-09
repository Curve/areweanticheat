import { ActionIcon, Avatar, Group, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { ArrowRight, ArrowsRightLeft, ExternalLink, Plus, Refresh } from "tabler-icons-react";
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
                {old_game.reference ?
                    <ActionIcon component="a" target="_blank" href={old_game.reference}>
                        <ExternalLink />
                    </ActionIcon>
                    : undefined}
                {old_game.anticheats.map(anticheat => {
                    return <Tooltip withArrow label={anticheat} key={anticheat}>
                        <AntiCheatBadge key={anticheat} anticheat={anticheat} />
                    </Tooltip>;
                })}
            </Group>
            <ArrowRight />
            <Group noWrap>
                <SupportBadge status={new_game.status} />
                {new_game.reference ?
                    <ActionIcon component="a" target="_blank" href={new_game.reference}>
                        <ExternalLink />
                    </ActionIcon>
                    : undefined}
                {new_game.anticheats.map(anticheat => {
                    return <Tooltip withArrow label={anticheat} key={anticheat}>
                        <AntiCheatBadge key={anticheat} anticheat={anticheat} />
                    </Tooltip>;
                })}
            </Group>
        </Group>
    }
    else {
        return <Group>
            <Group noWrap>
                <ThemeIcon color="green" radius="xl"><Plus /></ThemeIcon>
                <Avatar radius="xl" src={change.logo} />
                <Text>{change.name}</Text>
            </Group>
            <Group noWrap>
                <SupportBadge status={change.status} />
                {change.reference ?
                    <ActionIcon component="a" target="_blank" href={change.reference}>
                        <ExternalLink />
                    </ActionIcon>
                    : undefined}
                {change.anticheats.map(anticheat => {
                    return <Tooltip withArrow label={anticheat} key={anticheat}>
                        <AntiCheatBadge key={anticheat} anticheat={anticheat} />
                    </Tooltip>;
                })}
            </Group>
        </Group>
    }
}