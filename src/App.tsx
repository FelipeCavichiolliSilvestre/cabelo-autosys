import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

export default function App() {
  return (
    <MantineProvider>
      <Notifications limit={3} />
      <ModalsProvider>
        <></>
      </ModalsProvider>
    </MantineProvider>
  );
}
