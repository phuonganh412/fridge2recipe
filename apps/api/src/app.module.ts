import path from "node:path";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AiModule } from "./ai/ai.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { InventoryModule } from "./inventory/inventory.module";
import { MealPlansModule } from "./meal-plans/meal-plans.module";
import { RecipesModule } from "./recipes/recipes.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SupabaseModule } from "./supabase/supabase.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.join(__dirname, "../../../.env.local"),
        path.join(__dirname, "../../../.env"),
      ],
    }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    AiModule,
    HealthModule,
    InventoryModule,
    RecipesModule,
    MealPlansModule,
  ],
})
export class AppModule {}
