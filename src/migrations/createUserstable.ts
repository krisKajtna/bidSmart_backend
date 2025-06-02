import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable implements MigrationInterface {
    name = 'CreateUsersTable';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'confirmPassword',
                        type: 'varchar',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamptz',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamptz',
                        default: 'now()',
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}
