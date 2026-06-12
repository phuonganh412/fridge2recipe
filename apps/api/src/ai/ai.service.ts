import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createGateway } from "@ai-sdk/gateway";

/**
 * Internal AI wrapper. All product AI calls should go through this service
 * so providers can be swapped without touching feature code.
 */
@Injectable()
export class AiService {
  private readonly gateway;

  constructor(config: ConfigService) {
    this.gateway = createGateway({
      apiKey: config.get<string>("AI_GATEWAY_API_KEY"),
    });
  }

  getGateway() {
    return this.gateway;
  }
}
