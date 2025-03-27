import { Box, LoadingOverlay, Table, Transition } from '@mantine/core';
import { OrderListItem } from '../hooks';
import classes from './OrderTableStyle.module.css';
import OrdersTableRow from './OrdersTableRow';

export interface OrdersTableProps {
  orders?: OrderListItem[];
  isLoading: boolean;
  error: unknown;
}

export default function OrdersTable(props: OrdersTableProps) {
  const { orders, isLoading } = props;

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

        <Table.Tbody>{orders?.map((row) => <OrdersTableRow key={row.id} {...row} />)}</Table.Tbody>
      </Table>
    </Box>
  );
}
