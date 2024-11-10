import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialData1730889215378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "user" (name, email, password, phone)
            VALUES
                ('admin_1', 'admin_1@gmail.com', '012345', '0123456789'),
                ('user_1', 'user_1@gmail.com', '012345', '0123456789'),
                ('hotelier_1', 'hotelier_1@gmail.com', '012345', '0123456789'),
        `);

        await queryRunner.query(`
            INSERT INTO "role" (name) 
            VALUES 
                ('user'),
                ('hotelier'),
                ('admin');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "role" 
            WHERE 
                name = 'user',
                name = 'hotelier',
                name = 'admin';
        `);
    }

}
