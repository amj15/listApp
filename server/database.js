const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './mydb.sqlite',
    },
    useNullAsDefault: true,
});

knex.schema.hasTable('users').then((exists) => {
    if (!exists) {
        return knex.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('name');
            table.string('email');
        });
    }
});

module.exports = knex;
