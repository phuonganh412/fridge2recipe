import { Controller, Get, UseGuards } from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("meal-plans")
@UseGuards(AuthGuard)
export class MealPlansController {
  @Get()
  list(@CurrentUser() userId: string) {
    return { userId, mealPlans: [] };
  }
}
