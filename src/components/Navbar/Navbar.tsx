import { useMemo, useState } from 'react';
import {
  Stack,
  FloatingIndicator,
  UnstyledButton,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { IconBox, IconTool, IconReceipt, IconMoon, IconSun } from '@tabler/icons-react';
import { Link, useLocation } from 'react-router';
import classes from './Navbar.module.css';

const itemsData = [
  { Icon: IconTool, label: 'Ordems', href: '/orders' },
  { Icon: IconBox, label: 'Inventário', href: '/products' },
  { Icon: IconReceipt, label: 'Despesas', href: '/expenses' },
];

export default function Navbar() {
  const location = useLocation();
  const active = useMemo(
    () => itemsData.findIndex((link) => location.pathname.startsWith(link.href)),
    [location],
  );
  const { toggleColorScheme } = useMantineColorScheme();

  /* refs required for the FloatingIndicator */
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLAnchorElement | null>>({});
  const setControlRef = (index: number) => (node: HTMLAnchorElement) => {
    controlsRefs[index] = node;
    setControlsRefs(controlsRefs);
  };

  const links = itemsData.map((link, index) => (
    <Tooltip label={link.label} key={link.href} position="right">
      <UnstyledButton
        className={classes.item}
        component="a"
        renderRoot={(props) => <Link {...props} to={link.href} />}
        data-active={active === index}
        ref={setControlRef(index)}
      >
        <link.Icon className={classes.label} size={25} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  return (
    <>
      <Stack
        style={{ flex: 1 }}
        pos="relative"
        align="center"
        justify="center"
        gap={5}
        ref={setRootRef}
      >
        {links}

        <FloatingIndicator
          target={controlsRefs[active]}
          parent={rootRef}
          className={classes.indicator}
        />
      </Stack>

      <UnstyledButton darkHidden className={classes.item} onClick={toggleColorScheme}>
        <IconMoon className={classes.label} size={25} stroke={1.5} />
      </UnstyledButton>

      <UnstyledButton lightHidden className={classes.item} onClick={toggleColorScheme}>
        <IconSun className={classes.label} size={25} stroke={1.5} />
      </UnstyledButton>
    </>
  );
}
