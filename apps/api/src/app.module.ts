import path from "node:path";

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";

import { AiModule } from "./ai/ai.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { InventoryModule } from "./inventory/inventory.module";
import { createLoggerModuleParams } from "./logging/logging.config";
import { MealPlansModule } from "./meal-plans/meal-plans.module";
import { RecipesModule } from "./recipes/recipes.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SupabaseModule } from "./supabase/supabase.module";

@Module({
  imports: [
    LoggerModule.forRoot(createLoggerModuleParams()),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(process.env.AGENT_MODE === "1"
          ? [path.join(__dirname, "../../../.env.agent.local")]
          : []),
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
