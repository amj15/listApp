import db from '../database.js';

const getTasks = async () => {
    try {
        const tasks = await db.transaction(async (trx) => {
            const result = await trx('tasks')
                .leftJoin('users', 'tasks.userId', 'users.id')
                .select(
                    'tasks.id',
                    'tasks.title',
                    'tasks.description',
                    'tasks.createdAt',
                    'tasks.maxDueDate',
                    'tasks.userId',
                    'tasks.done',
                    'users.name as userName',
                    'users.image as avatar',
                    'users.id as userId',
                )
                .orderBy('tasks.maxDueDate', 'ASC');

            return result;
        });

        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

export { getTasks };
