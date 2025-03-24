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
import { IconPlus, IconAlertCircle, IconUser, IconNumber123 } from '@tabler/icons-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import useSWR from 'swr';

export default function ListServiceOrdersPage() {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(50);
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, error } = useSWR({
    query: `
      SELECT
        service_orders.id,
        service_orders.created_at,
        service_orders.is_closed,
        clients.name as client_name,
        cars.model as car_model,
        cars.make as car_make,
        cars.year as car_year,
        cars.license_plate as car_license_plate
      FROM service_orders
      JOIN cars ON service_orders.car_id = cars.id
      JOIN clients ON service_orders.client_id = clients.id
      ORDER BY service_orders.created_at DESC
      LIMIT $1
      OFFSET $2;
    `,
    bindValues: [pageSize, (pageNumber - 1) * pageSize],
  } as DatabaseFetchInput);

  const compactPagination = useMatches({
    base: true,
    xs: false,
  });

  const { data: countData, isLoading: isCountLoading } = useSWR({
    query: `
      SELECT COUNT(id) AS count FROM service_orders;
    `,
  });

  if (isLoading) return 'loading...';
  if (error) return <p>{error}</p>;

  const numberOfPages = (isCountLoading ? Infinity : countData[0].count) / pageSize;

  return (
    <Stack style={{ height: '100%', width: '100%' }} px={15} py={10}>
      <Grid>
        <Grid.Col span={{ base: 3.5, sm: 2.5 }}>
          <TextInput
            __clearable
            __clearSection
            placeholder="Cliente"
            leftSection={<IconUser size={16} stroke={1.5} />}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 2.5, sm: 1.5 }}>
          <TextInput placeholder="Placa" leftSection={<IconNumber123 size={16} stroke={1.5} />} />
        </Grid.Col>

        <Grid.Col span={{ base: 3, sm: 1.5 }}>
          <Select
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
              {data.map((row) => (
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
