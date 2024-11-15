import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialData1730889215378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "user" (name, email, password, phone, avatar)
            VALUES
                ('admin_1', 'admin_1@gmail.com', '012345', '0123456789', 'admin_1.jpg'),
                ('user_1', 'user_1@gmail.com', '012345', '0123456789', 'user_1.jpg'),
                ('hotelier_1', 'hotelier_1@gmail.com', '012345', '0123456789', 'hotelier_1.jpg');
        `);

        await queryRunner.query(`
            INSERT INTO "role" (name) 
            VALUES 
                ('user'),
                ('hotelier'),
                ('admin');
        `);

        await queryRunner.query(`
            INSERT INTO "users_roles" ("userId", "roleId") 
            VALUES 
                (1, 3),
                (2, 1),
                (3, 1);
        `);

        await queryRunner.query(`
            INSERT INTO "hotel" (name, description, discount, "ownerId", phone, email, star) 
            VALUES 
                ('The Sóng Apartment - Căn Hộ Nghỉ Dưỡng Vũng Tàu - Hao''s Homestay',
                'You might be eligible for a Genius discount at The Sóng Apartment - Căn Hộ Nghỉ Dưỡng Vũng Tàu - Hao''s Homestay. Sign in to check if a Genius discount is available for your selected dates.
        
                Genius discounts at this property are subject to booking dates, stay dates, and other available deals.
        
                Offering a private beach area and a garden, The Sóng Apartment - Căn Hộ Nghỉ Dưỡng Vũng Tàu - Hao''s Homestay in Vung Tau is close to Back Beach and White Rabbit Park Vung Tau. With sea views, this accommodation features a balcony and a swimming pool. The accommodation provides a sauna, free Wifi throughout the property, and family rooms.
        
                At the apartment complex, all units have air conditioning, a seating area, a flat-screen TV with streaming services, a kitchen, a dining area, a safety deposit box, and a private bathroom with a walk-in shower, slippers, and a hair dryer. A microwave, a fridge, and stovetop are also provided, as well as a kettle. At the apartment complex, each unit is fitted with bed linen and towels.
        
                There is a coffee shop, and packed lunches are also available.
        
                Guests can take advantage of yoga classes held on site. The area is popular for cycling, and bike rental and car rental are available at the apartment. A water park and kids pool are available at The Sóng Apartment - Căn Hộ Nghỉ Dưỡng Vũng Tàu - Hao''s Homestay, while guests can also relax on the sun terrace.
        
                Christ of Vung Tau is 2.2 miles from the accommodation, while Ho May Culture and Ecotourism Park is 2.4 miles from the property. Tan Son Nhat International Airport is 62 miles away, and the property offers a paid airport shuttle service.
        
                Couples in particular like the location – they rated it 9.2 for a two-person trip.',
                0,
                3,
                '0123456789',
                'thesong@gmail.com',
                4),
            ('Minh Hoang Hotel',
            'Bạn có thể đủ điều kiện hưởng giảm giá Genius tại Minh Hoang Hotel. Để biết giảm giá Genius có áp dụng cho ngày bạn đã chọn hay không, hãy đăng nhập.
        
            Giảm giá Genius tại chỗ nghỉ này tùy thuộc vào ngày đặt phòng, ngày lưu trú và các ưu đãi có sẵn khác.
        
            Tọa lạc tại Thành phố Hồ Chí Minh, cách Chùa Giác Lâm 3,4 km, Minh Hoang Hotel có phòng nghỉ gắn máy điều hòa và sảnh khách chung. Trong số các tiện nghi của khách sạn này còn có máy ATM, dịch vụ đỗ xe cho khách và WiFi miễn phí trong toàn bộ khuôn viên. Chỗ nghỉ cung cấp dịch vụ lễ tân 24 giờ, dịch vụ phòng và dịch vụ thu đổi ngoại tệ cho khách.
        
            Tất cả phòng nghỉ tại Huy Hoang 2 Hotel đều được trang bị tủ để quần áo, Tại Minh Hoang Hotel, mỗi phòng còn có bàn làm việc, TV màn hình phẳng và phòng tắm riêng.
        
            Công viên Văn hóa Đầm Sen và Chợ Tân Định đều nằm trong bán kính 5 km từ khách sạn. Sân bay gần nhất là sân bay quốc tế Tân Sơn Nhất, cách Minh Hoang Hotel 5 km.
        
            Các cặp đôi đặc biệt thích địa điểm này — họ cho điểm 8,5 khi đánh giá chuyến đi hai người.',
            0,
            3,
            '0123456789',
            'minhhoang@gmail.com',
            2);
        `);        

        await queryRunner.query(`
            INSERT INTO "location" (name, district, "detailAddress", city) 
            VALUES 
                ('', '', '28 Đường Thi Sách, Vũng Tàu, Vietnam', 'Vũng Tàu'),
                ('', 'Tân Bình', '74 Binh Gia, Ward 13, Tan Binh District, Quận Tân Bình, TP. Hồ Chí Minh, Việt Nam', 'Hồ Chí Minh');
        `);

        await queryRunner.query(`
            INSERT INTO "hotels_locations" ("hotelId", "locationId") 
            VALUES 
                (1, 1),
                (2, 2);
        `);

        await queryRunner.query(`
            INSERT INTO "room" (name, "roomType", nums, price, status, "hotelId") 
            VALUES 
                ('Căn hộ 2 phòng ngủ', 4, 2, 500000, 'available', 1),
                ('Phòng Superior giường đôi', 2, 4, 400000, 'available', 2),
                ('Căn hộ một phòng ngủ có ban công', 1, 2, 400000, 'available', 1),
                ('Phòng Superior gia đình', 4, 1, 580000, 'available', 2);
        `);

        await queryRunner.query(`
            INSERT INTO "service" (name, icon) 
            VALUES 
                ('WiFi miễn phí', 'wifi.png'),
                ('Ban công', 'balcony.png'),
                ('Cách âm', 'mute.png'),
                ('Điều hòa', 'air_condition.png'),
                ('Bếp', 'kitchen.png');
        `);

        await queryRunner.query(`
            INSERT INTO "image" (url, "hotelId") 
            VALUES
                ('604751720.jpg', 1),
                ('604748509.jpg', 1),
                ('604748411.jpg', 1),
                ('604748409.jpg', 1),
                ('604748403.jpg', 1),
                ('604751711.jpg', 1),
                ('257330293.jpg', 2),
                ('257329932.jpg', 2),
                ('257329954.jpg', 2),
                ('256161675.jpg', 2),
                ('257329989.jpg', 2),
                ('257329048.jpg', 2),
                ('257328043.jpg', 2);
        `);

        await queryRunner.query(`
            INSERT INTO "rooms_services" ("roomId", "serviceId") 
            VALUES 
                (1, 1),
                (2, 3),
                (1, 2),
                (2, 1),
                (1, 5),
                (2, 4);
        `);

        await queryRunner.query(`
            INSERT INTO "review" (comment, rating, "userId", "hotelId") 
            VALUES 
                ('Phòng dở tệ', 1, 2, 2),
                ('View đẹp, phòng ở thoải mái, nhân viên thân thiện', 5, 2, 1);
        `);

        await queryRunner.query(`
            INSERT INTO "report" ("hotelId", "totalProfit") 
            VALUES 
                (1, 5000000),
                (2, 2000000);
        `);

        await queryRunner.query(`
            INSERT INTO "booking" ("userId", "roomId", nums, status, note) 
            VALUES 
                (2, 1, 2, 'waiting', ''),
                (2, 2, 1, 'done', 'Checkin vào buổi trưa');
        `);

        await queryRunner.query(`
            INSERT INTO "bill" ("userId", "bookingId", "numOfDay", "totalCost") 
            VALUES 
                (2, 1, 5, 5000000),
                (2, 2, 3, 1200000);
        `);

        await queryRunner.query(`
            INSERT INTO "payment" ("billId", method) 
            VALUES 
                (1, 'momo'),
                (2, 'internet banking');
        `);

        await queryRunner.query(`
            INSERT INTO "user_favouriteHotel" ("userId", "hotelId") 
            VALUES 
                (2, 1);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "user"
            WHERE
               name = 'admin_1',
               name = 'user_1',
               name = 'hotelier_1';
        `);

        await queryRunner.query(`
            DELETE FROM "role" 
            WHERE 
                name = 'user',
                name = 'hotelier',
                name = 'admin';
        `);
    }

}
