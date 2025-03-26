import { DatabaseFetchInput } from '@/database';
import {
  Paper,
  Table,
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
import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import sql from 'sqlite-bricks';

import useSWR from 'swr';

export default function ListServiceOrdersPage() {
  const navigate = useNavigate();

  const [licensePlate, setLicensePlate] = useState('');
  const [clientName, setClientName] = useState('');
  const [status, setStatus] = useState<null | string>(null);

  const [pageSize, setPageSize] = useState(50);
  const [pageNumber, setPageNumber] = useState(1);

  const listQuery = useMemo(() => {
    let builder = sql
      .select(
        'service_orders.id',
        'service_orders.created_at',
        'service_orders.is_closed',
        'clients.name AS client_name',
        'cars.make AS car_make',
        'cars.model AS car_model',
        'cars.year AS car_year',
        'cars.license_plate AS car_license_plate',
      )
      .from('service_orders')
      .join('cars')
      .on('service_orders.car_id', 'cars.id')
      .join('clients')
      .on('service_orders.client_id', 'clients.id')
      .where(sql.like('cars.license_plate', `%${licensePlate}%`))
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .orderBy('service_orders.is_closed', 'service_orders.created_at DESC');

    if (licensePlate !== '')
      builder = builder.where(sql.like('cars.license_plate', `%${licensePlate}%`));
    if (clientName !== '') builder = builder.where(sql.like('clients.name', `%${clientName}%`));
    if (status) {
      builder = builder.where('service_orders.is_closed', Number(status === 'Encerrado'));
    }

    return builder;
  }, [licensePlate, pageSize, pageNumber, clientName, status]);

  const { data, isLoading, error } = useSWR({
    query: listQuery.toParams().text,
    bindValues: listQuery.toParams().values,
  } as DatabaseFetchInput);

  const compactPagination = useMatches({
    base: true,
    xs: false,
  });

  const countQuery = useMemo(() => {
    let builder = sql
      .select('COUNT(service_orders.id) AS count')
      .from('service_orders')
      .join('cars')
      .on('service_orders.car_id', 'cars.id')
      .join('clients')
      .on('service_orders.client_id', 'clients.id');

    if (licensePlate !== '') {
      builder = builder.where(sql.like('cars.license_plate', `%${licensePlate}%`));
    }
    if (clientName !== '') builder = builder.where(sql.like('clients.name', `%${clientName}%`));
    if (status) {
      builder = builder.where('service_orders.is_closed', Number(status === 'Encerrado'));
    }

    return builder;
  }, [licensePlate, clientName, status]);

  const { data: countData, isLoading: isCountLoading } = useSWR({
    query: countQuery.toParams().text,
    bindValues: countQuery.toParams().values,
  });

  const numberOfPages = Math.ceil((isCountLoading ? Infinity : countData[0].count) / pageSize);

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
            data={['Aberto', 'Encerrado']}
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
        <Box style={{ flex: 1, overflow: 'auto' }}>
          {isLoading ? (
            'loading...'
          ) : error ? (
            error
          ) : (
            <Table highlightOnHover withColumnBorders stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>No.</Table.Th>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Marca</Table.Th>
                  <Table.Th>Modelo</Table.Th>
                  <Table.Th>Ano</Table.Th>
                  <Table.Th>Placa</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Data</Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {data.map((row: any) => (
                  <Table.Tr
                    key={row.id}
                    onClick={() => navigate(`/orders/${row.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Table.Td>{row.id}</Table.Td>
                    <Table.Td>{row.client_name}</Table.Td>
                    <Table.Td>{row.car_make}</Table.Td>
                    <Table.Td>{row.car_model}</Table.Td>
                    <Table.Td>{row.car_year}</Table.Td>
                    <Table.Td>{row.car_license_plate}</Table.Td>
                    <Table.Td className="text-center">
                      {row.is_closed === 1 ? 'Fechado' : 'Aberto'}
                    </Table.Td>
                    <Table.Td>
                      {new Date(row.created_at).toLocaleDateString('pt-BR')}{' '}
                      {new Date(row.created_at).toLocaleTimeString('pt-BR')}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Box>

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
