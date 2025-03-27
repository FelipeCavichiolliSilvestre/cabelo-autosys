import { Badge, Table } from '@mantine/core';
import { OrderListItem } from '../hooks';
import { useNavigate } from 'react-router';
import { OrderStatus } from '../types';

export type OrdersTableRowProps = OrderListItem;

export default function OrdersTableRow(props: OrdersTableRowProps) {
  const { id, createdAt, isClosed, car, client } = props;

  const navigate = useNavigate();

  return (
    <Table.Tr onClick={() => navigate(`/orders/${id}`)}>
      <Table.Td>{id.toString().padStart(5, '0')}</Table.Td>
      <Table.Td>{client.name}</Table.Td>
      <Table.Td>{car.make}</Table.Td>
      <Table.Td>{car.model}</Table.Td>
      <Table.Td>{car.year}</Table.Td>
      <Table.Td>{car.licensePlate}</Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>
        {isClosed ? (
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
        {createdAt.toLocaleDateString('pt-BR')} {createdAt.toLocaleTimeString('pt-BR')}
      </Table.Td>
    </Table.Tr>
  );
}
