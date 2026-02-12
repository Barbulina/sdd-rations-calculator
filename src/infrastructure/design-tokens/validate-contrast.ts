import Color from "colorjs.io";

/**
 * WCAG AA contrast validation function
 * Validates contrast ratio between foreground and background colors
 * Per contracts/validation-api.md
 */

export interface ContrastValidationResult {
  /** Calculated contrast ratio */
  ratio: number;
  
  /** Whether ratio meets WCAG AA threshold */
  passes: boolean;
  
  /** Required minimum ratio for given text size */
  required: number;
  
  /** WCAG conformance level achieved */
  level: 'AAA' | 'AA' | 'fail';
  
  /** Human-readable result message */
  message: string;
}

/**
 * Validates WCAG AA contrast ratio for color token
 * @param foreground - Hex color code (e.g., "#6750A4")
 * @param background - Hex color code (e.g., "#FFFBFE")
 * @param textSize - "normal" (< 18pt) or "large" (≥ 18pt)
 * @returns Validation result with contrast ratio and pass/fail
 */
export function validateContrastRatio(
  foreground: string,
  background: string,
  textSize: 'normal' | 'large' = 'normal'
): ContrastValidationResult {
  try {
    const fg = new Color(foreground);
    const bg = new Color(background);
    
    // Calculate WCAG 2.1 contrast ratio
    const ratio = Math.abs(fg.contrast(bg, 'WCAG21'));
    
    // WCAG AA thresholds
    const required = textSize === 'normal' ? 4.5 : 3.0;
    const aaaThreshold = textSize === 'normal' ? 7.0 : 4.5;
    
    const passes = ratio >= required;
    const level: 'AAA' | 'AA' | 'fail' = 
      ratio >= aaaThreshold ? 'AAA' : 
      ratio >= required ? 'AA' : 
      'fail';
    
    const message = passes
      ? `Contrast ratio ${ratio.toFixed(1)}:1 ${level === 'AAA' ? 'exceeds WCAG AA requirement' : 'meets WCAG AA requirement'} (${required}:1)${level === 'AAA' ? ' and achieves AAA' : ''}`
      : `Contrast ratio ${ratio.toFixed(1)}:1 fails WCAG AA requirement (${required}:1) for ${textSize} text`;
    
    return {
      ratio: Math.round(ratio * 10) / 10, // Round to 1 decimal place
      passes,
      required,
      level,
      message
    };
  } catch (error) {
    throw new Error(`Invalid color value: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Validates a color token against standard M3 backgrounds
 * @param colorHex - Hex color code to validate
 * @param theme - Theme variant ('light' or 'dark')
 * @returns Validation result
 */
export function validateTokenContrast(
  colorHex: string,
  theme: 'light' | 'dark'
): ContrastValidationResult {
  // Material Design 3 standard surface colors
  const backgrounds = {
    light: '#FFFBFE', // M3 light surface
    dark: '#1C1B1F'   // M3 dark surface
  };
  
  return validateContrastRatio(colorHex, backgrounds[theme], 'normal');
}
