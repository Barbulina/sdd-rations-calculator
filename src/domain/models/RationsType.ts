/**
 * RationsType Enum
 *
 * Represents the seven categories of food aliments with Spanish display labels.
 * Each type maps to a corresponding design token color from the design system.
 *
 * @see ../../infrastructure/design-tokens/tokens.json for color definitions
 */
export enum RationsType {
  /** Dairy products (lácteos) */
  lacteal = "lácteos",

  /** Cereals, flours, pulses, legumes, and tubers */
  cereals_flours_pulses_legumes_tubers = "cereales, harinas, legumbres y tuberculos",

  /** Fruits (frutas) */
  fruits = "frutas",

  /** Vegetables (hortalizas) */
  vegetables = "hortalizas",

  /** Oily and dry fruits (frutas secas y grasa) */
  oily_and_dry_fruit = "frutas secas y grasa",

  /** Drinks/beverages (bebidas) */
  drinks = "bebidas",

  /** Other food items (otros) */
  others = "otros",
}
