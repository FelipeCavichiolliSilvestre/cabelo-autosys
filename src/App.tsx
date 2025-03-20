import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { BrowserRouter } from 'react-router';
import AppRoutes from './AppRoutes';

export default function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <Notifications limit={3} />
      <ModalsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ModalsProvider>
    </MantineProvider>
  );
}
