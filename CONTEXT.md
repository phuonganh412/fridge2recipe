# Fridge2Recipe

Fridge2Recipe is a personal food planning context centered on turning known fridge contents into practical meal plans and recipe suggestions.

## Language

**User**:
A person using Fridge2Recipe to manage their own food inventory and planning.
_Avoid_: Account, customer

**Fridge Inventory**:
The user's current view of food they have available at home.
_Avoid_: Pantry, stock, warehouse

**Inventory Item**:
A single food item recorded in the fridge inventory, such as eggs, milk, spinach, or leftover rice.
_Avoid_: Product, SKU, asset

**Fridge Photo**:
An image supplied by the user to help identify inventory items.
_Avoid_: Receipt image, product scan

**Recipe Suggestion**:
A proposed recipe based on the user's fridge inventory, preferences, and planning needs.
_Avoid_: Search result, recommendation

**Generated Recipe**:
A recipe created or adapted for the user rather than copied from a fixed recipe catalog.
_Avoid_: External recipe, scraped recipe

**Meal Plan**:
A user's planned set of meals for future dates.
_Avoid_: Calendar, schedule

**Meal Plan Entry**:
One planned meal within a meal plan.
_Avoid_: Event, booking

**Shopping List**:
Items the user may need to buy to complete selected meals or recipes.
_Avoid_: Cart, order

**AI Usage**:
The product-visible consumption of AI features such as recipe generation, fridge-photo understanding, and recipe image generation.
_Avoid_: Token telemetry, model logs
