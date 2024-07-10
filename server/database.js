import knex from 'knex';

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './mydb.sqlite',
    },
    useNullAsDefault: true,
});

db.schema.hasTable('users').then((exists) => {
    if (!exists) {
        return db.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('name');
            table.string('email');
        });
    }
});

export default db;
