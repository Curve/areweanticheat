import {
  Accordion,
  Badge,
  Button,
  createStyles,
  Divider,
  Group,
  Input,
  LoadingOverlay,
  Progress,
  RingProgress,
  Stack,
  Table,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Check, ListDetails, RefreshAlert, Search } from 'tabler-icons-react';
import { Breakdown, Game, GameStats, Status } from './Classes';
import ChangeItem from './components/ChangeItem';
import Legend from './components/LegendInfo';
import StyledAccordion from './components/StyledAccordion';
import TableItem from './components/TableItem';
import { fetchChanges, fetchIcons, fetchNewData, getBreakdown, getGameStats } from './Functions';

const useStyle = createStyles(theme => ({
  reactiveWidth: {
    [theme.fn.smallerThan('sm')]: { width: '90%' },
    [theme.fn.largerThan('sm')]: { width: '60%' },
  },
}));

export default function Body() {
  const { classes } = useStyle();
  const theme = useMantineTheme();
  const [games, setGames] = useState<Game[]>([]);
  const [finished, setFinished] = useState(false);
  const [lastVisited, setLastVisited] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [breakdown, setBreakdown] = useState<Breakdown[]>([]);
  const [changes, setChanges] = useState<Array<Game | Game[]>>([]);
  const [gameStats, setGameStats] = useState<GameStats>(new GameStats());

  const searchChanged = (event: any) => {
    setSearchFilter(event.target.value);
  };

  useEffect(() => {
    //TODO: Do all the heavy work in a web worker.
    const oldData = JSON.parse(localStorage.getItem('previousData') || '[]');
    setLastVisited(localStorage.getItem('lastVisit') || '');

    fetchNewData(oldData)
      .then(newData => {
        setGames(newData);
        setGameStats(getGameStats(newData));
        setBreakdown(getBreakdown(newData));

        const changes = fetchChanges(oldData, newData);
        setChanges(changes);
        setFinished(true);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (finished) {
      localStorage.setItem('lastVisit', new Date().toLocaleDateString());

      fetchIcons(games)
        .then(withIcons => {
          setGames(withIcons);

          if (changes.length == 0) {
            localStorage.setItem('previousData', JSON.stringify(withIcons));
          }
        })
        .catch(console.error);
    }
  }, [finished]);

  const acknowledge = () => {
    setChanges([]);
    localStorage.setItem('previousData', JSON.stringify(games));
  };

  return (
    <>
      {' '}
      {finished ? (
        <>
          <Group position="center">
            <RingProgress
              size={120}
              thickness={12}
              label={<Text align="center">{gameStats.total}</Text>}
              sections={
                gameStats
                  ? [
                      { value: (gameStats.denied / gameStats.total) * 100, color: 'red' },
                      { value: (gameStats.broken / gameStats.total) * 100, color: 'orange' },
                      { value: (gameStats.running / gameStats.total) * 100, color: 'cyan' },
                      { value: (gameStats.supported / gameStats.total) * 100, color: 'green' },
                      { value: (gameStats.planned / gameStats.total) * 100, color: 'violet' },
                    ]
                  : []
              }
            />
            <Stack sx={{ marginLeft: 15 }}>
              <Tooltip withArrow label="Game is officially supported">
                <Legend color={theme.colors.green[6]} name={`Supported (${gameStats.supported})`} />
              </Tooltip>
              <Tooltip withArrow label="Game is planned to be supported">
                <Legend color={theme.colors.violet[6]} name={`Planned (${gameStats.planned})`} />
              </Tooltip>
              <Tooltip withArrow label="No official statement but runs fine (may require tinkering)">
                <Legend color={theme.colors.cyan[6]} name={`Running (${gameStats.running})`} />
              </Tooltip>
              <Tooltip withArrow label="Game does not work (online)">
                <Legend color={theme.colors.orange[6]} name={`Broken (${gameStats.broken})`} />
              </Tooltip>
              <Tooltip withArrow label="Linux support was explicitly denied">
                <Legend color={theme.colors.red[6]} name={`Denied (${gameStats.denied})`} />
              </Tooltip>
            </Stack>
          </Group>
          <Stack sx={{ marginTop: 20 }}>
            <Group position="center">
              {lastVisited && <Badge color="gray">Last visited {lastVisited}</Badge>}
            </Group>
            {changes.length > 0 && (
              <Group position="center">
                <StyledAccordion
                  initialItem={0}
                  className={classes.reactiveWidth}
                  icon={<RefreshAlert size={16} />}
                >
                  <Accordion.Item label="Changes since you've last checked">
                    <Stack>
                      <Group position="center">
                        <Stack spacing="lg">
                          {changes.map((change, index) => (
                            <ChangeItem key={index} changes={change} />
                          ))}
                        </Stack>
                      </Group>
                      <Button color="green" onClick={acknowledge} leftIcon={<Check size={16} />}>
                        Acknowledge
                      </Button>
                    </Stack>
                  </Accordion.Item>
                </StyledAccordion>
              </Group>
            )}
            <Group position="center">
              <StyledAccordion className={classes.reactiveWidth} icon={<ListDetails size={16} />}>
                <Accordion.Item label="Breakdown">
                  {breakdown.map(element => {
                    return (
                      <Stack key={element.anticheat}>
                        <Text>{element.anticheat}</Text>
                        <Progress
                          size="xl"
                          sections={[
                            {
                              value: (element.supported / element.total) * 100,
                              color: 'green',
                              label: `${element.supported}`,
                            },
                            {
                              value: (element.running / element.total) * 100,
                              color: 'cyan',
                              label: `${element.running}`,
                            },
                            {
                              value: (element.planned / element.total) * 100,
                              color: 'violet',
                              label: `${element.planned}`,
                            },
                            {
                              value: (element.broken / element.total) * 100,
                              color: 'orange',
                              label: `${element.broken}`,
                            },
                            {
                              value: (element.denied / element.total) * 100,
                              color: 'red',
                              label: `${element.denied}`,
                            },
                          ]}
                        />
                        <Divider />
                      </Stack>
                    );
                  })}
                </Accordion.Item>
              </StyledAccordion>
            </Group>
            <Group position="center" sx={{ marginTop: 15 }}>
              <Tooltip label="You can also search by Anti-Cheat or Supported-Status">
                <Input
                  icon={<Search />}
                  variant="unstyled"
                  placeholder="Search..."
                  onChange={searchChanged}
                />
              </Tooltip>
            </Group>
            <Group position="center">
              <Table sx={{ width: '80%' }} horizontalSpacing="xl" fontSize="md">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Anti-Cheat</th>
                  </tr>
                </thead>
                <tbody>
                  {games
                    .filter(
                      element =>
                        element.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        Status[element.status].includes(searchFilter.toLowerCase()) ||
                        element.anticheats.filter(anticheat =>
                          anticheat.toLowerCase().includes(searchFilter.toLowerCase())
                        ).length > 0
                    )
                    .map(element => (
                      <TableItem
                        key={element.name}
                        name={element.name}
                        logo={element.logo}
                        status={element.status}
                        reference={element.reference}
                        anticheats={element.anticheats}
                        native={element.native}
                      />
                    ))}
                </tbody>
              </Table>
            </Group>
          </Stack>
        </>
      ) : (
        <LoadingOverlay visible />
      )}{' '}
    </>
  );
}
