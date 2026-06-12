import { Module } from "@nestjs/common";

import { MealPlansController } from "./meal-plans.controller";

@Module({
  controllers: [MealPlansController],
})
export class MealPlansModule {}
