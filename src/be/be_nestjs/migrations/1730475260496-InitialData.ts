import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialData1730475260496 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "user" (brand, model, year) VALUES ('Ford', 'Mustang', 1964);`);
        await queryRunner.query(`INSERT INTO "hotel" (brand, model, year) VALUES ('Ford', 'Mustang', 1964);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user" WHERE brand = 'Volvo';`)
    }

}
