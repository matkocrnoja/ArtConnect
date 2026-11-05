import { useState } from 'react';
import { IconLogout, IconSettings, IconChevronDown } from '@tabler/icons-react';
import cx from 'clsx';
import { Avatar, Badge, Burger, Container, Divider, Drawer, Group, Menu, ScrollArea, Tabs, Text, UnstyledButton, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './HeaderTabs.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

const korisnik = {
  ime: 'Hrvoje Horvat',
  email: '',
  slika: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
};

const tabovi = [
  { label: 'Moj portfolio', path: '/moj-portfolio', value: '/moj-portfolio' },
  { label: 'Moje prijave', path: '/moje-prijave', value: '/moje-prijave' },
  { label: 'Inbox', value: 'inbox'}
];

const brojNeprocitanih = 9;

function HeaderTabs() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const navigate = useNavigate();

  const { pathname } = useLocation();
  //const aktivniTab = tabovi.find((tab) => pathname.startsWith(tab.path))?.path ?? null;
  const aktivniTab = tabovi.find((tab) => tab.path && pathname.startsWith(tab.path))?.value ?? null;

  const items = tabovi.map((tab) => (
    <Tabs.Tab value={tab.value} key={tab.value}>
      <span className={classes.tabLabel}>
        {tab.label}
        {tab.label === 'Inbox' && brojNeprocitanih > 0 && (
          <Badge size="xs" color="red" className={classes.badge}>
            {brojNeprocitanih > 99 ? '99+' : brojNeprocitanih}
          </Badge>
        )}
      </span>
    </Tabs.Tab>
  ));

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <Group justify="space-between">
          logo

          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            aria-label="Toggle navigation"
          />

          <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton
                className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
              >
                <Group gap={7}>
                  <Avatar src={korisnik.slika} alt="" radius="xl" size={20} />
                  <Text fw={500} size="sm" lh={1} mr={3}>
                    {korisnik.ime}
                  </Text>
                  <IconChevronDown size={12} stroke={1.5} />
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />} onClick={() => navigate('/postavke')}>
                Postavke
              </Menu.Item>
              <Menu.Item leftSection={<IconLogout size={16} stroke={1.5} />}>Odjavi se</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>
      <Container size="md">
        <Tabs
          value={aktivniTab}
          onChange={(value) => {
              // Pronađi tab koji je kliknut
              const odabraniTab = tabovi.find((t) => t.value === value);
              
              // Navigiraj SAMO ako tab ima definiran path, inače izvrši logiku za Inbox
              if (odabraniTab?.path) {
                navigate(odabraniTab.path);
              } else {
                console.log('Kliknut Inbox - otvara se drawer/modal, nema redirekcije');
              }
          }}
          variant="outline"
          visibleFrom="sm"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
          {items.map((item) => (
            <Tabs.Panel value={item.key!} key={item.key}>
              {' '}
            </Tabs.Panel>
          ))}
        </Tabs>
      </Container>

      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Divider my="sm" />
          {tabovi.map((tab) => (
            <a
              href="#"
              key={tab.value}
              className={classes.drawerLink}
              onClick={(event) => {
                event.preventDefault();
                if (tab.path) {
                  navigate(tab.path);
                  close();
                } else {
                  console.log('Kliknut Inbox u mobilnom izborniku');
                  close();
                }
              }}
            >
            <span className={classes.tabLabel}>
              {tab.label}
              {tab.label === 'Inbox' && brojNeprocitanih > 0 && (
                <Badge size="xs" color="red" className={classes.badge}>
                  {brojNeprocitanih > 99 ? '99+' : brojNeprocitanih}
                </Badge>
              )}
            </span>
            </a>
          ))}

          <Divider my="sm" />
          <a 
            href="/postavke" 
            className={classes.drawerLink} 
            onClick={(event) => {
              event.preventDefault();
              navigate('/postavke');
              close();
            }}>
            Postavke
          </a>
          <a href="#" className={classes.drawerLink} onClick={(event) => event.preventDefault()}>
            Odjavi se
          </a>
        </ScrollArea>
      </Drawer>
    </div>
  );
}

export default HeaderTabs;  