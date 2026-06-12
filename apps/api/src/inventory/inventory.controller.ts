import { Controller, Get, UseGuards } from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("inventory")
@UseGuards(AuthGuard)
export class InventoryController {
  @Get()
  list(@CurrentUser() userId: string) {
    return { userId, items: [] };
  }
}
