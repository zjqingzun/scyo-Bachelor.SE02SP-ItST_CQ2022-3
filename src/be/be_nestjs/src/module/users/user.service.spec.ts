import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service"
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/module/users/entities/user.entity'; // Đường dẫn đúng đến entity
import { DataSource } from "typeorm";


describe('UserService', () => {
    let service : UserService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          imports: [
            TypeOrmModule.forFeature([User]),
          ],
          providers: [
            UserService,
          ],
        }).compile();
    
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
      });
})