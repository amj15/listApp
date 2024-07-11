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
            table.string('image');
        });
    }
});

db.schema.hasTable('tasks').then((exists) => {
    if (!exists) {
        return db.schema.createTable('tasks', (table) => {
            table.increments('id').primary();
            table.string('title');
            table.string('description');
            table.date('createdAt');
            table.dateTime('maxDueDate');
            table.integer('userId');
            table.boolean('done');
        });
    }
});

export default db;
