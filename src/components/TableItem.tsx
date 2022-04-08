import { ActionIcon, Avatar, createStyles, Group, Stack, Text, Tooltip } from "@mantine/core";
import { ExternalLink } from "tabler-icons-react";
import { Game, Status } from "../Classes";
import AntiCheatBadge from "./AntiCheatBadge";
import SupportBadge from "./SupportBadge";

const useStyle = createStyles((theme) => ({
    mobileHide: {
        [theme.fn.smallerThan('sm')]: { display: 'none' },
    },
    mobileShow: {
        [theme.fn.largerThan('sm')]: { display: 'none' },
    }
}));


export default function TableItem({ name, logo, status, reference, anticheats }: Game) {
    const { classes } = useStyle();

    const getText = (text: string) => {
        if (reference) {
            return <Text className={classes.mobileHide} variant="link" target="_blank" component="a" href={reference}>{text}</Text>
        }
        else {
            return <Text className={classes.mobileHide}>{text}</Text>
        }
    };

    const getInfoText = () => {
        switch (status) {
            case Status.broken:
                return getText("Broken");
            case Status.supported:
                return getText("Supported");
            case Status.running:
                return getText("Running");
            case Status.denied:
                return getText("Denied");
            case Status.confirmed:
                return getText("Confirmed");
            default:
                return getText("Unknown");
        }
    };

    return <tr key={name}>
        <td>
            <Group noWrap>
                <Avatar radius="xl" src={logo} />
                <Text>{name}</Text>
            </Group>
        </td>
        <td>
            <Group noWrap>
                <SupportBadge status={status} />
                {reference ?
                    <ActionIcon component="a" target="_blank" href={reference} className={classes.mobileShow}>
                        <ExternalLink />
                    </ActionIcon>
                    :
                    undefined}
                {getInfoText()}
            </Group>
        </td>
        <td>
            <Stack>
                {anticheats.map(element => {
                    return <Group key={element}>
                        <Tooltip withArrow label={element} className={classes.mobileShow}>
                            <AntiCheatBadge anticheat={element} />
                        </Tooltip>
                        <div className={classes.mobileHide}>
                            <AntiCheatBadge anticheat={element} />
                        </div>
                        <Text className={classes.mobileHide}>{element}</Text>
                    </Group>
                })}
            </Stack>
        </td>
    </tr>
}