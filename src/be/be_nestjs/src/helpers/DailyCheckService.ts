import { RoomTypeService } from "@/module/room_type/room_type.service";
import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class DailyCheckService {
    constructor(
        private readonly roomtypeService: RoomTypeService
    ) {
        
    }

    @Cron('0 0 * * 6')
    async setWeekendPrice() {
        console.log("weekend start");
        await this.roomtypeService.applyWeekendPrice();
    }

    @Cron('0 0 * * 1')
    async resetWeekendPrice() {
        console.log("weekend end");
        await this.roomtypeService.resetNormalPrice();
    }

}