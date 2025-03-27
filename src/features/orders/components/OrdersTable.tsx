import { Badge, Box, LoadingOverlay, Table, Transition } from '@mantine/core';
import { OrderListItem } from '../hooks';
import { useNavigate } from 'react-router';
import { OrderStatus } from '../types';
import classes from './OrderTableStyle.module.css';

export interface OrdersTableProps {
  orders?: OrderListItem[];
  isLoading: boolean;
  error: unknown;
}

export default function OrdersTable(props: OrdersTableProps) {
  const { orders, isLoading } = props;

  const navigate = useNavigate();

  return (
    <Box style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
      <Transition mounted={isLoading} transition="fade" duration={50} timingFunction="ease">
        {(styles) => <LoadingOverlay style={styles} visible={isLoading} />}
      </Transition>

      <Table
        layout="fixed"
        highlightOnHover
        withColumnBorders
        stickyHeader
        className={classes.table}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ width: '5.5ch' }}>No</Table.Th>
            <Table.Th style={{ width: '30.5ch' }}>Cliente</Table.Th>
            <Table.Th style={{ width: '10.5ch' }}>Marca</Table.Th>
            <Table.Th style={{ width: '15.5ch' }}>Modelo</Table.Th>
            <Table.Th style={{ width: '4.5ch' }}>Ano</Table.Th>
            <Table.Th style={{ width: '8.5ch' }}>Placa</Table.Th>
            <Table.Th style={{ width: '8.5ch', textAlign: 'center' }}>Status</Table.Th>
            <Table.Th style={{ width: '19.5ch' }}>Data</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {orders?.map((row) => (
            <Table.Tr key={row.id} onClick={() => navigate(`/orders/${row.id}`)}>
              <Table.Td>{row.id.toString().padStart(5, '0')}</Table.Td>
              <Table.Td>{row.client.name}</Table.Td>
              <Table.Td>{row.car.make}</Table.Td>
              <Table.Td>{row.car.model}</Table.Td>
              <Table.Td>{row.car.year}</Table.Td>
              <Table.Td>{row.car.licensePlate}</Table.Td>
              <Table.Td style={{ textAlign: 'center' }}>
                {row.isClosed ? (
                  <Badge color="pink" variant="light">
                    {OrderStatus.closed}
                  </Badge>
                ) : (
                  <Badge color="green" variant="light">
                    {OrderStatus.open}
                  </Badge>
                )}
              </Table.Td>
              <Table.Td>
                {new Date(row.createdAt).toLocaleDateString('pt-BR')}{' '}
                {new Date(row.createdAt).toLocaleTimeString('pt-BR')}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Box>
  );
}
