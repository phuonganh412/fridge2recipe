import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import WebSocket from "ws";

import type { Database } from "./database.types";

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client!: SupabaseClient<Database>;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.get<string>("SUPABASE_URL");
    const serviceRoleKey = this.config.get<string>("SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !serviceRoleKey) {
      throw new Error(
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured",
      );
    }

    this.client = createClient<Database>(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      realtime: {
        transport: WebSocket as unknown as typeof globalThis.WebSocket,
      },
    });
  }

  getClient(): SupabaseClient<Database> {
    return this.client;
  }
}
