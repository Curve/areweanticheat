import { ActionIcon, Avatar, Group, Header, Title } from '@mantine/core';
import { BrandGithub } from 'tabler-icons-react';
import ThemeToggle from './ThemeToggle';

export function HeaderMenu() {
    return (
        <Header height='' sx={{ marginBottom: 30 }}>
            <Group position='apart' sx={{ marginLeft: 15, marginRight: 15 }} noWrap>
                <Group>
                    <Avatar src="logo.png" size="lg" />
                    <Title order={4}>Are We Anti-Cheat?</Title>
                </Group>
                <Group>
                    <ActionIcon variant="light" color="violet" radius="xl" component="a" target="_blank" href="https://github.com/Curve/areweanticheat">
                        <BrandGithub size={18} />
                    </ActionIcon>
                    <ThemeToggle />
                </Group>
            </Group>
        </Header >
    );
}