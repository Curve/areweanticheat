import { Avatar, ThemeIcon } from "@mantine/core";
import { QuestionMark } from "tabler-icons-react";

interface AntiCheatBadgeProps {
    anticheat: string;
}

const logo_map = new Map<string, string>([
    ["easy anti-cheat", "eac.png"],
    ["battleye", "battleye.png"],
    ["equ8", "equ8.png"],
    ["vanguard", "vanguard.png"],
    ["fairfight", "fairfight.png"],
    ["punkbuster", "punkbuster.png"],
    ["vac", "vac.png"],
    ["xign", "xigncode3.png"],
    ["treyarch", "treyarch.png"],
]);

export default function AntiCheatBadge({ anticheat }: AntiCheatBadgeProps) {
    const getLogo = () => {
        const lower = anticheat.toLocaleLowerCase();
        for (const [name, icon] of logo_map) {
            if (lower.includes(name)) {
                return icon;
            }
        }
        return undefined;
    };

    const logo = getLogo();

    if (logo) {
        return <Avatar radius="xs" size="sm" src={logo} />
    }
    else {
        return <ThemeIcon radius="xs"><QuestionMark size={18} /></ThemeIcon>
    }
}