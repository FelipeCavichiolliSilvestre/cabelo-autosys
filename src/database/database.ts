import Database from '@tauri-apps/plugin-sql';

const database = await Database.load('sqlite:database.sqlite3');

export default database;
