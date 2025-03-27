import {
  Paper,
  Divider,
  Pagination,
  Box,
  Select,
  Grid,
  Button,
  Stack,
  TextInput,
  useMatches,
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconPlus, IconAlertCircle, IconUser, IconNumber123 } from '@tabler/icons-react';
import React, { useState } from 'react';
import { Link } from 'react-router';

import { useListOrders, useListOrdersCount } from './hooks';
import { OrderStatus } from './types';
import { OrdersTable } from './components';

export default function ListServiceOrdersPage() {
  const [licensePlate, setLicensePlate] = useState('');
  const [clientName, setClientName] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState(50);
  const [pageNumber, setPageNumber] = useState(1);

  const statusSearch = status
    ? status === OrderStatus.closed
      ? OrderStatus.closed
      : OrderStatus.open
    : undefined;

  const { orders, isLoading, error, isValidating } = useListOrders({
    pageNumber,
    pageSize,
    clientName,
    licensePlate,
    status: statusSearch,
  });

  const compactPagination = useMatches({
    base: true,
    xs: false,
  });

  const { count } = useListOrdersCount({
    clientName,
    licensePlate,
    status: statusSearch,
  });

  const numberOfPages = Math.ceil((count ?? Infinity) / pageSize);

  const onLicensePlateChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLicensePlate(e.target.value);
    setPageNumber(1);
  }, 200);

  const onClientNameChange = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
    setPageNumber(1);
  }, 200);

  function onStatusChange(value: string | null) {
    setStatus(value);
    setPageNumber(1);
  }

  return (
    <Stack style={{ height: '100%', width: '100%' }} px={15} py={10}>
      <Grid>
        <Grid.Col span={{ base: 3.5, sm: 2.5 }}>
          <TextInput
            defaultValue={clientName}
            onChange={onClientNameChange}
            placeholder="Cliente"
            leftSection={<IconUser size={16} stroke={1.5} />}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 2.5, sm: 1.5 }}>
          <TextInput
            onChange={onLicensePlateChange}
            placeholder="Placa"
            leftSection={<IconNumber123 size={16} stroke={1.5} />}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 3, sm: 1.5 }}>
          <Select
            value={status}
            onChange={onStatusChange}
            placeholder="Status"
            leftSection={<IconAlertCircle size={16} stroke={1.5} />}
            clearable
            data={[OrderStatus.open, OrderStatus.closed]}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 3, sm: 1.5 }} offset={{ base: 0, sm: 5 }}>
          <Button
            renderRoot={(props) => <Link {...props} to="/orders/create" />}
            leftSection={<IconPlus size={16} />}
            fullWidth
          >
            Criar ordem
          </Button>
        </Grid.Col>
      </Grid>

      <Paper
        withBorder
        radius="md"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'scroll' }}
      >
        <OrdersTable orders={orders} isLoading={isLoading || isValidating} error={error} />
        <Divider />

        <Grid p={15}>
          <Grid.Col span={{ base: 4, xs: 2, md: 1 }}>
            <Select
              value={String(pageSize)}
              onChange={(value) => {
                setPageNumber(1);
                setPageSize(Number(value));
              }}
              data={['25', '50', '100', '200']}
              allowDeselect={false}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 8, xs: 10, md: 11 }}>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'center',
              }}
            >
              <Pagination
                siblings={compactPagination ? 0 : 1}
                boundaries={compactPagination ? 0 : 1}
                value={pageNumber}
                onChange={setPageNumber}
                total={numberOfPages}
              />
            </Box>
          </Grid.Col>
        </Grid>
      </Paper>
    </Stack>
  );
}
