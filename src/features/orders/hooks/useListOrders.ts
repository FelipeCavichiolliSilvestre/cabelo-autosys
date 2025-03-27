import { useMemo } from 'react';
import sql from 'sqlite-bricks';
import { OrderStatus } from '../types';
import { DatabaseFetchInput } from '@/database';
import useSWR from 'swr';

export function useListOrders(params: UseListOrdersParams) {
  const { pageSize, pageNumber, clientName, licensePlate, status } = params;

  const query: DatabaseFetchInput = useMemo(() => {
    let builder = sql
      .select(
        'service_orders.id',
        'service_orders.created_at',
        'service_orders.is_closed',
        'clients.name AS client_name',
        'cars.license_plate AS car_license_plate',
        'cars.make AS car_make',
        'cars.model AS car_model',
        'cars.year AS car_year',
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

    if (licensePlate) builder = builder.where(sql.like('cars.license_plate', `%${licensePlate}%`));
    if (clientName) builder = builder.where(sql.like('clients.name', `%${clientName}%`));
    if (status) {
      builder = builder.where('service_orders.is_closed', Number(status === OrderStatus.closed));
    }

    return builder.toParams();
  }, [licensePlate, pageSize, pageNumber, clientName, status]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, isLoading, isValidating } = useSWR<any[]>(query);

  const orders = useMemo(() => {
    if (!data) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders: OrderListItem[] = data.map((row: any) => ({
      id: row.id,
      createdAt: new Date(row.created_at),
      isClosed: Boolean(row.is_closed),
      client: { name: row.client_name },
      car: {
        licensePlate: row.car_license_plate,
        make: row.car_make,
        model: row.car_model,
        year: row.car_year,
      },
    }));

    return orders;
  }, [data]);

  return { orders, error, isLoading, isValidating };
}

export interface UseListOrdersParams {
  pageNumber: number;
  pageSize: number;
  licensePlate?: string;
  clientName?: string;
  status?: OrderStatus;
}

export interface OrderListItem {
  id: number;
  createdAt: Date;
  isClosed: boolean;
  client: { name: string };
  car: { licensePlate: string; make: string; model: string; year: number };
}
