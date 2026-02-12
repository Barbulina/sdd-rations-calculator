/**
 * Design Token Type Definitions
 *
 * Provides type-safe utility classes for Tailwind CSS based on design tokens.
 * Auto-generated from tokens.json via Style Dictionary transformation.
 *
 * @packageDocumentation
 */

/**
 * Category Color Utility Classes
 *
 * Semantic colors for aliment categories following M3 color roles.
 * WCAG AA compliant (4.5:1+ contrast ratios).
 */
export type CategoryColorClass =
  | "category-lacteal"
  | "category-cereals-flours-pulses-legumes-tubers"
  | "category-fruits"
  | "category-vegetables"
  | "category-oily-dry-fruits"
  | "category-drinks"
  | "category-others";

/**
 * State Indicator Utility Classes
 *
 * Colors for offline/online status and synchronization state.
 * WCAG AA compliant (4.5:1+ contrast ratios).
 */
export type StateColorClass =
  | "state-offline"
  | "state-syncing"
  | "state-sync-error"
  | "state-online";

/**
 * Feedback State Utility Classes
 *
 * Semantic colors for user action feedback.
 * WCAG AA compliant (4.5:1+ contrast ratios).
 */
export type FeedbackColorClass =
  | "feedback-success"
  | "feedback-warning"
  | "feedback-error"
  | "feedback-info";

/**
 * All Color Utility Classes
 *
 * Union of all color token types.
 */
export type ColorClass =
  | CategoryColorClass
  | StateColorClass
  | FeedbackColorClass;

/**
 * Spacing Utility Classes
 *
 * 8px grid system for consistent spacing and layout alignment.
 * Touch target compliant (space-5+ meets 44px minimum).
 */
export type SpacingClass =
  | "space-0" // 0px / 0rem
  | "space-1" // 8px / 0.5rem
  | "space-2" // 16px / 1rem
  | "space-3" // 24px / 1.5rem
  | "space-4" // 32px / 2rem
  | "space-5" // 40px / 2.5rem - Minimum for touch targets
  | "space-6" // 48px / 3rem
  | "space-8" // 64px / 4rem
  | "space-10" // 80px / 5rem
  | "space-12"; // 96px / 6rem

/**
 * Typography Scale Classes
 *
 * Material Design 3 type scale for mobile-first typography.
 *
 * Note: Typography tokens are available as CSS custom properties,
 * not as Tailwind utility classes. Use with CSS variables:
 * - var(--heading-1-font-size)
 * - var(--body-medium-line-height)
 * - etc.
 */
export type TypographyClass =
  | "heading-1" // 57px Display Large
  | "heading-2" // 45px Display Medium
  | "heading-3" // 36px Display Small
  | "heading-4" // 32px Headline Large
  | "heading-5" // 28px Headline Medium
  | "heading-6" // 24px Headline Small
  | "body-large" // 16px Body Large
  | "body-medium" // 14px Body Medium
  | "body-small" // 12px Body Small
  | "label-large" // 14px Label Large
  | "label-medium" // 12px Label Medium
  | "label-small"; // 11px Label Small

/**
 * Background Color Utilities
 *
 * Type-safe background color classes.
 * @example bg-category-lacteal
 */
export type BgColorClass = `bg-${ColorClass}`;

/**
 * Text Color Utilities
 *
 * Type-safe text color classes.
 * @example text-state-offline
 */
export type TextColorClass = `text-${ColorClass}`;

/**
 * Border Color Utilities
 *
 * Type-safe border color classes.
 * @example border-feedback-error
 */
export type BorderColorClass = `border-${ColorClass}`;

/**
 * Padding Utilities
 *
 * Type-safe padding classes.
 * @example p-space-4, px-space-3, py-space-2
 */
export type PaddingClass =
  | `p-${SpacingClass}`
  | `px-${SpacingClass}`
  | `py-${SpacingClass}`
  | `pt-${SpacingClass}`
  | `pr-${SpacingClass}`
  | `pb-${SpacingClass}`
  | `pl-${SpacingClass}`;

/**
 * Margin Utilities
 *
 * Type-safe margin classes.
 * @example m-space-5, mx-space-6, my-space-1
 */
export type MarginClass =
  | `m-${SpacingClass}`
  | `mx-${SpacingClass}`
  | `my-${SpacingClass}`
  | `mt-${SpacingClass}`
  | `mr-${SpacingClass}`
  | `mb-${SpacingClass}`
  | `ml-${SpacingClass}`;

/**
 * Gap Utilities
 *
 * Type-safe gap classes for flexbox/grid layouts.
 * @example gap-space-4, gap-x-space-3, gap-y-space-2
 */
export type GapClass =
  | `gap-${SpacingClass}`
  | `gap-x-${SpacingClass}`
  | `gap-y-${SpacingClass}`;

/**
 * All Design Token Utility Classes
 *
 * Union of all available design token utility classes.
 */
export type DesignTokenClass =
  | BgColorClass
  | TextColorClass
  | BorderColorClass
  | PaddingClass
  | MarginClass
  | GapClass;

/**
 * Helper type for className props with design token autocomplete
 *
 * @example
 * interface ButtonProps {
 *   className?: DesignTokenClassName;
 * }
 *
 * <Button className="bg-category-lacteal text-white p-space-4" />
 */
export type DesignTokenClassName = DesignTokenClass | string;

/**
 * Token Values Type (for programmatic access)
 *
 * @example
 * import tokens from '@/infrastructure/design-tokens/tailwind-tokens';
 * const lactealColor: string = tokens['category-lacteal'];
 */
export interface DesignTokens {
  // Category colors
  "category-lacteal": string;
  "category-cereals-flours-pulses-legumes-tubers": string;
  "category-fruits": string;
  "category-vegetables": string;
  "category-oily-dry-fruits": string;
  "category-drinks": string;
  "category-others": string;

  // State colors
  "state-offline": string;
  "state-syncing": string;
  "state-sync-error": string;
  "state-online": string;

  // Feedback colors
  "feedback-success": string;
  "feedback-warning": string;
  "feedback-error": string;
  "feedback-info": string;

  // Spacing
  "space-0": string;
  "space-1": string;
  "space-2": string;
  "space-3": string;
  "space-4": string;
  "space-5": string;
  "space-6": string;
  "space-8": string;
  "space-10": string;
  "space-12": string;

  // Typography (CSS custom properties only, not Tailwind classes)
  "heading-1": string;
  "heading-2": string;
  "heading-3": string;
  "heading-4": string;
  "heading-5": string;
  "heading-6": string;
  "body-large": string;
  "body-medium": string;
  "body-small": string;
  "label-large": string;
  "label-medium": string;
  "label-small": string;
}

declare const tokens: DesignTokens;
export default tokens;
