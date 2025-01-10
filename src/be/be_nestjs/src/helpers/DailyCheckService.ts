import { RoomTypeService } from "@/module/room_type/room_type.service";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class DailyCheckService {
    constructor(
        private readonly roomtypeService: RoomTypeService
    ) {
        
    }

    @Cron('0 0 * * *')
    async updateWeekendPriceForHotel() {
        const currenDate = new Date();
        if (currenDate.getDay() === 0 || currenDate.getDay() === 6) {
            await this.roomtypeService.applyWeekendPrice();
        } else {
            await this.roomtypeService.resetNormalPrice();
        }
        
    }

}