import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1730864137298 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // Tạo bảng "user"
      await queryRunner.query(`
        CREATE TABLE "user" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR(255) NOT NULL,
          "dob" DATE NOT NULL DEFAULT CURRENT_DATE,
          "cccd" VARCHAR(20) NOT NULL DEFAULT '0000000000',
          "email" VARCHAR(255) NOT NULL,
          "password" VARCHAR(255) NOT NULL,
          "phone" VARCHAR(20) NOT NULL,
          "accountType" VARCHAR(50) NOT NULL DEFAULT 'google',
          "codeId" VARCHAR(255) DEFAULT NULL,
          "codeExpired" TIMESTAMP NOT NULL DEFAULT now(),
          "avatar" VARCHAR(255)
        );
      `);

      // Tạo bảng "role"
      await queryRunner.query(`
        CREATE TABLE "role" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR(100)
        );
      `);

      // Tạo bảng "user_role"
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
          "name" VARCHAR(255) NOT NULL,
          "description" TEXT NOT NULL,
          "discount" INT NOT NULL,
          "ownerId" INT NOT NULL,
          "phone" VARCHAR(20) NOT NULL,
          "email" VARCHAR(255) NOT NULL,
          "star" INT,
          FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "image"
      await queryRunner.query(`
        CREATE TABLE "image" (
          "id" SERIAL PRIMARY KEY,
          "url" VARCHAR(255) NOT NULL,
          "hotelId" INT,
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "room_type"
      await queryRunner.query(`
        CREATE TABLE "room_type" (
          "id" SERIAL,
          "type" INT NOT NULL,
          "price" INT NOT NULL,
          "weekend_price" INT NOT NULL,
          "flexible_price" INT NOT NULL,
          "hotelId" INT NOT NULL,
          "nums" INT,
          PRIMARY KEY ("id", "hotelId"),
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "room"
      await queryRunner.query(`
        CREATE TABLE "room" (
          "id" SERIAL,
          "name" VARCHAR(255) NOT NULL,  
          "type" INT NOT NULL,
          "status" VARCHAR(50) NOT NULL,
          "hotelId" INT NOT NULL,
          "roomTypeId" INT NOT NULL,
          PRIMARY KEY ("id"),
          FOREIGN KEY ("roomTypeId", "hotelId") REFERENCES "room_type"("id", "hotelId") ON DELETE CASCADE,
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "booking"
      await queryRunner.query(`
        CREATE TABLE "booking" (
          "id" SERIAL PRIMARY KEY,
          "userId" INT NOT NULL,
          "hotelId" INT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT now(),
          "checkinTime" TIMESTAMP NOT NULL,
          "checkoutTime" TIMESTAMP NOT NULL,
          "status" VARCHAR(50) NOT NULL,
          "note" VARCHAR(255),
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);
        
      // Tạo bảng "booking_detail"
      await queryRunner.query(`
        CREATE TABLE "booking_detail" (
          "id" SERIAL PRIMARY KEY,
          "bookingId" INT NOT NULL,
          "type" INT NOT NULL,
          "nums" INT NOT NULL,
          "price" NUMERIC NOT NULL,
          FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "bill"
      await queryRunner.query(`
        CREATE TABLE "bill" (
          "id" SERIAL PRIMARY KEY,
          "bookingId" INT NOT NULL,
          "numOfDay" INT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT now(),
          "totalCost" NUMERIC NOT NULL,
          FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "payment"
      await queryRunner.query(`
        CREATE TABLE "payment" (
          "id" SERIAL PRIMARY KEY,
          "billId" INT NOT NULL,
          "date" TIMESTAMP DEFAULT now(),
          "method" VARCHAR(50) NOT NULL,
          "status" VARCHAR(50) NOT NULL,
          FOREIGN KEY ("billId") REFERENCES "bill"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "report"
      await queryRunner.query(`
        CREATE TABLE "report" (
          "id" SERIAL PRIMARY KEY,
          "hotelId" INT NOT NULL,
          "startDate" TIMESTAMP NOT NULL,
          "endDate" TIMESTAMP NOT NULL,
          "totalProfit" NUMERIC DEFAULT 0,
          "createdAt" TIMESTAMP DEFAULT now(),
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "review"
      await queryRunner.query(`
        CREATE TABLE "review" (
          "id" SERIAL PRIMARY KEY,
          "comment" TEXT NOT NULL,
          "rating" INT NOT NULL,
          "createdAt" TIMESTAMP DEFAULT now(),
          "userId" INT NOT NULL,
          "hotelId" INT NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
          FOREIGN KEY ("hotelId") REFERENCES "hotel"("id") ON DELETE CASCADE
        );
      `);

      // Tạo bảng "location"
      await queryRunner.query(`
        CREATE TABLE "location" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR(255) NOT NULL,
          "district" VARCHAR(255) NOT NULL,
          "detailAddress" VARCHAR(255) NOT NULL,
          "city" VARCHAR(255) NOT NULL
        );
      `);

      // Tạo bảng "service"
      await queryRunner.query(`
        CREATE TABLE "service" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR(255) NOT NULL,
          "icon" VARCHAR(255) NOT NULL
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
