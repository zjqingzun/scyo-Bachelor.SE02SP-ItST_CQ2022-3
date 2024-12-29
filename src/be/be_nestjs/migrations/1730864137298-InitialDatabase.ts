import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1730864137298 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
          CREATE TABLE "user" (
            "id" SERIAL PRIMARY KEY,
            "name" VARCHAR NOT NULL,
            "dob" DATE NOT NULL DEFAULT CURRENT_DATE,
            "cccd" VARCHAR NOT NULL DEFAULT '0000000000',
            "email" VARCHAR NOT NULL,
            "password" VARCHAR NOT NULL,
            "phone" VARCHAR NOT NULL,
            "accountType" VARCHAR NOT NULL DEFAULT 'google',
            "codeId" VARCHAR NOT NULL DEFAULT '',
            "codeExpired" TIMESTAMP NOT NULL DEFAULT now(),
            "avatar" VARCHAR
          );
        `);

      // Tạo bảng "role"
      await queryRunner.query(`
        CREATE TABLE "role" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR
        );
      `);

      // Tạo bảng "user_role" (mối quan hệ giữa user và role)
      await queryRunner.query(`
        CREATE TABLE "users_roles" (
          "userId" INT NOT NULL,
          "roleId" INT NOT NULL,
          PRIMARY KEY ("userId", "roleId"),
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
          FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "hotel"
      await queryRunner.query(`
        CREATE TABLE "hotel" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR NOT NULL,
          "description" VARCHAR NOT NULL,
          "discount" INT NOT NULL,
          "ownerId" INT NOT NULL,
          "phone" VARCHAR NOT NULL,
          "email" VARCHAR NOT NULL,
          "star" INT,
          FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "image"
      await queryRunner.query(`
        CREATE TABLE "image" (
          "id" SERIAL PRIMARY KEY,
          "url" VARCHAR NOT NULL,
          "hotelId" INT,
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "room"
      await queryRunner.query(`
        CREATE TABLE "room" (
          "id" SERIAL,
          "roomType" INT NOT NULL,
          "price" INT NOT NULL,
          "weekend_price" INT NOT NULL,
          "flexible_price" INT NOT NULL,
          "hotelId" INT NOT NULL,
          "nums" INT,
          PRIMARY KEY ("id", "hotelId", "roomType"),
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "detail_room"
      await queryRunner.query(`
        CREATE TABLE "detail_room" (
          "id" SERIAL PRIMARY KEY, 
          "name" VARCHAR NOT NULL,  
          "status" VARCHAR NOT NULL,
          "hotelId" INT NOT NULL, 
          "roomType" INT NOT NULL,
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE, 
          FOREIGN KEY ("roomType", "hotelId") REFERENCES "room"("roomType", "hotelId") ON DELETE CASCADE 
        );
      `);

      // Tạo bảng "booking"
      await queryRunner.query(`
        CREATE TABLE "booking" (
          "id" SERIAL PRIMARY KEY,
          "userId" INT NOT NULL,
          "roomId" INT NOT NULL,
          "nums" INT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT now(),
          "checkinTime" TIMESTAMP DEFAULT now(),
          "checkoutTime" TIMESTAMP DEFAULT now(),
          "status" VARCHAR NOT NULL,
          "note" VARCHAR,
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
          FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "bill"
      await queryRunner.query(`
        CREATE TABLE "bill" (
          "id" SERIAL PRIMARY KEY,
          "userId" INT NOT NULL,
          "bookingId" INT NOT NULL,
          "numOfDay" INT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT now(),
          "totalCost" NUMERIC NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
          FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "payment"
      await queryRunner.query(`
        CREATE TABLE "payment" (
          "id" SERIAL PRIMARY KEY,
          "billId" INT NOT NULL,
          "date" TIMESTAMP DEFAULT now(),
          "method" VARCHAR,
          FOREIGN KEY ("billId") REFERENCES "bill"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "review"
      await queryRunner.query(`
        CREATE TABLE "review" (
          "id" SERIAL PRIMARY KEY,
          "comment" VARCHAR NOT NULL,
          "rating" INT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT now(),
          "userId" INT NOT NULL,
          "hotelId" INT NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "report"
      await queryRunner.query(`
        CREATE TABLE "report" (
          "id" SERIAL PRIMARY KEY,
          "hotelId" INT NOT NULL,
          "startDate" TIMESTAMP DEFAULT now(),
          "endDate" TIMESTAMP DEFAULT now(),
          "totalProfit" NUMERIC,
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "location"
      await queryRunner.query(`
        CREATE TABLE "location" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR NOT NULL,
          "district" VARCHAR NOT NULL,
          "detailAddress" VARCHAR NOT NULL,
          "city" VARCHAR NOT NULL
        );
      `);

      // Tạo bảng "service"
      await queryRunner.query(`
        CREATE TABLE "service" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR NOT NULL,
          "icon" VARCHAR NOT NULL
        );
      `);

      // Tạo bảng "rooms_services"
      await queryRunner.query(`
        CREATE TABLE "rooms_services" (
          "roomId" INT NOT NULL,
          "serviceId" INT NOT NULL,
          PRIMARY KEY ("roomId", "serviceId"),
          FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE,
          FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "hotels_locations"
      await queryRunner.query(`
        CREATE TABLE "hotels_locations" (
          "hotelId" INT NOT NULL,
          "locationId" INT NOT NULL,
          PRIMARY KEY ("hotelId", "locationId"),
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE,
          FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "user_favouriteHotel"
      await queryRunner.query(`
        CREATE TABLE "user_favouriteHotel" (
          "userId" INT NOT NULL,
          "hotelId" INT NOT NULL,
          PRIMARY KEY ("userId", "hotelId"),
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        // Hủy bỏ tất cả các bảng
        await queryRunner.query(`DROP TABLE IF EXISTS "user_favouriteHotel"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "hotels_locations"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "rooms_services"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "service"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "location"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "report"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "review"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "payment"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "bill"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "booking"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "room"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "hotels_images"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "image"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "hotel"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_role"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "role"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
    }
}
