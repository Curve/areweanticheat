import { ColorScheme, ColorSchemeProvider, LoadingOverlay, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import React, { Suspense, useState } from "react";
import { HeaderMenu } from "./components/Header";


export function App() {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
    const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    const Body = React.lazy(() => import("./Body"));

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider withNormalizeCSS withGlobalStyles theme={{ colorScheme }}>
                <NotificationsProvider>
                    <HeaderMenu />
                    <Suspense fallback={<LoadingOverlay visible />}>
                        <Body />
                    </Suspense>
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider >
    );
}