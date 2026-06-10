import { createGateway } from "@ai-sdk/gateway";

/**
 * Internal AI wrapper. All product AI calls should go through this module
 * so providers can be swapped without touching feature code.
 */
const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

export function getAiGateway() {
  return gateway;
}
