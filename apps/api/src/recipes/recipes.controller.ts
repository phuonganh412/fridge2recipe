import { Controller, Post, UseGuards } from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("recipes")
@UseGuards(AuthGuard)
export class RecipesController {
  @Post("suggest")
  suggest(@CurrentUser() userId: string) {
    return {
      userId,
      suggestions: [],
      message: "Recipe suggestions are not implemented yet",
    };
  }
}
