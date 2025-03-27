import database from './database';

export interface DatabaseFetchInput {
  text: string;
  values?: unknown[];
}

export async function databaseFetcher({ text, values }: DatabaseFetchInput) {
  const result = await database.select(text, values);

  return result;
}
