import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router';
import Navbar from '@/components/Navbar';
import classes from './BaseLayout.module.css';

export default function BaseLayout() {
  return (
    <AppShell navbar={{ width: 90, breakpoint: 90, collapsed: { mobile: false } }} padding="xs">
      <AppShell.Navbar p="xs" className={classes.navbar}>
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
