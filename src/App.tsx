import {
  ColorScheme,
  ColorSchemeProvider,
  Footer,
  Group,
  LoadingOverlay,
  MantineProvider,
  Text,
} from '@mantine/core';
import React, { Suspense, useState } from 'react';
import { Heart } from 'tabler-icons-react';
import { HeaderMenu } from './components/Header';

export function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const Body = React.lazy(() => import('./Body'));

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider withNormalizeCSS withGlobalStyles theme={{ colorScheme }}>
        <HeaderMenu />
        <Suspense fallback={<LoadingOverlay visible />}>
          <Body />
        </Suspense>
        <Footer height={50} sx={{ marginTop: 25 }}>
          <Group position="center" sx={{ height: '100%' }}>
            <Text> Made with </Text>
            <Heart color="red" />
            <Text> by Starz0r & Curve </Text>
          </Group>
        </Footer>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
