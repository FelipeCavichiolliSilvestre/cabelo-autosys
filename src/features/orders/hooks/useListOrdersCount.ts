import sql from 'sqlite-bricks';
import { UseListOrdersParams } from './useListOrders';
import { DatabaseFetchInput } from '@/database';
import { useMemo } from 'react';
import { OrderStatus } from '../types';
import useSWR from 'swr';

export function useListOrdersCount(params: UseListOrdersCountParams) {
  const { clientName, licensePlate, status } = params;

  const query: DatabaseFetchInput = useMemo(() => {
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
      builder = builder.where('service_orders.is_closed', Number(status === OrderStatus.closed));
    }

    return builder.toParams();
  }, [licensePlate, clientName, status]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error, isLoading, isValidating } = useSWR<any[]>(query);

  const count = data ? data[0].count : undefined;

  return { count, error, isLoading, isValidating };
}

export type UseListOrdersCountParams = Pick<
  UseListOrdersParams,
  'clientName' | 'licensePlate' | 'status'
>;
