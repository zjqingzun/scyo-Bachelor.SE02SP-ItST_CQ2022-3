import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1730475192391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "hotels_locations";`);
        await queryRunner.query(`DROP TABLE "rooms_services";`);
        await queryRunner.query(`DROP TABLE "service";`);
        await queryRunner.query(`DROP TABLE "location";`);
        await queryRunner.query(`DROP TABLE "report";`);
        await queryRunner.query(`DROP TABLE "review";`);
        await queryRunner.query(`DROP TABLE "payment";`);
        await queryRunner.query(`DROP TABLE "bill";`);
        await queryRunner.query(`DROP TABLE "booking";`);
        await queryRunner.query(`DROP TABLE "room";`);
        await queryRunner.query(`DROP TABLE "hotel";`);
        await queryRunner.query(`DROP TABLE "user";`);
    }

}
