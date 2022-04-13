import { ActionIcon, Avatar, Group, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { ArrowRight, ArrowsRightLeft, ExternalLink, Minus, Plus, Refresh } from "tabler-icons-react";
import { Game } from "../Classes";
import AntiCheatBadge from "./AntiCheatBadge";
import NativeBadge from "./NativeBadge";
import StatusBadge from "./StatusBadge";

interface ChangeItemProps {
    changes: Game | Game[];
}

export default function ChangeItem({ changes: change }: ChangeItemProps) {
    if (Array.isArray(change)) {
        const [old_game, new_game] = change;

        const did_status_change = old_game.status != new_game.status;
        const did_native_status_change = old_game.native != new_game.native;
        const did_reference_change = old_game.reference != new_game.reference;
        const did_anticheats_change = JSON.stringify(old_game.anticheats) != JSON.stringify(new_game.anticheats);

        return <Group position="center">
            <Stack>
                <Group noWrap>
                    <ThemeIcon color="violet" radius="xl"><Refresh /></ThemeIcon>
                    <Avatar radius="xl" src={old_game.logo} />
                    <Text>{old_game.name}</Text>
                </Group>
                <Group sx={{ marginLeft: 50 }}>
                    <Stack>

                        {did_status_change ?
                            <Group>
                                <ArrowRight />
                                <StatusBadge status={old_game.status} />
                                <ArrowsRightLeft />
                                <StatusBadge status={new_game.status} />
                            </Group>
                            :
                            undefined
                        }
                        {did_native_status_change ?
                            <Group>
                                {old_game.native ?
                                    <Minus />
                                    :
                                    <Plus />
                                }
                                <NativeBadge native={true} />
                            </Group>
                            :
                            undefined
                        }
                        {
                            did_reference_change ?
                                <Group>
                                    {!old_game.reference ?
                                        <Group>
                                            <Plus />
                                            <ActionIcon component="a" target="_blank" href={new_game.reference}>
                                                <ExternalLink />
                                            </ActionIcon>
                                        </Group>
                                        :
                                        new_game.reference ?
                                            <Group>
                                                <ArrowRight />
                                                <ActionIcon component="a" target="_blank" href={old_game.reference}>
                                                    <ExternalLink />
                                                </ActionIcon>
                                                <ArrowsRightLeft />
                                                <ActionIcon component="a" target="_blank" href={new_game.reference}>
                                                    <ExternalLink />
                                                </ActionIcon>
                                            </Group>
                                            :
                                            <Group>
                                                <Minus />
                                                <ActionIcon component="a" target="_blank" href={old_game.reference}>
                                                    <ExternalLink />
                                                </ActionIcon>
                                            </Group>
                                    }
                                </Group>
                                :
                                undefined
                        }
                        {
                            did_anticheats_change ?
                                <Group>
                                    <ArrowRight />
                                    {old_game.anticheats.map(anticheat => {
                                        return <Tooltip withArrow label={anticheat} key={anticheat}>
                                            <AntiCheatBadge key={anticheat} anticheat={anticheat} />
                                        </Tooltip>;
                                    })}
                                    <ArrowsRightLeft />
                                    {new_game.anticheats.map(anticheat => {
                                        return <Tooltip withArrow label={anticheat} key={anticheat}>
                                            <AntiCheatBadge key={anticheat} anticheat={anticheat} />
                                        </Tooltip>;
                                    })}
                                </Group>
                                :
                                undefined
                        }
                    </Stack>
                </Group>
            </Stack>
        </Group>
    }
    else {
        return <Group position="center">
            <Stack>
                <Group noWrap>
                    <ThemeIcon color="green" radius="xl"><Plus /></ThemeIcon>
                    <Avatar radius="xl" src={change.logo} />
                    <Text>{change.name}</Text>
                </Group>
                <Group sx={{ marginLeft: 50 }}>
                    <Stack>
                        <Group>
                            <ArrowRight />
                            <StatusBadge status={change.status} />
                            {change.native ?
                                <>
                                    ,
                                    <Plus />
                                    <NativeBadge native={true} />
                                </>
                                :
                                undefined
                            }
                            ,
                            <ActionIcon component="a" target="_blank" href={change.reference}>
                                <ExternalLink />
                            </ActionIcon>
                            ,
                            {change.anticheats.map(anticheat => {
                                return <Tooltip withArrow label={anticheat} key={anticheat}>
                                    <AntiCheatBadge key={anticheat} anticheat={anticheat} />
                                </Tooltip>;
                            })}
                        </Group>
                    </Stack>
                </Group>
            </Stack>
        </Group>
    }
}