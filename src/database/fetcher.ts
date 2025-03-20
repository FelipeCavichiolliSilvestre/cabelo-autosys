import database from './database';

export interface DatabaseFetchInput {
  query: string;
  bindValues?: unknown[];
}

export async function databaseFetcher({ query, bindValues }: DatabaseFetchInput) {
  const result = await database.select(query, bindValues);

  return result;
}
