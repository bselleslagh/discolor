// Result descriptions for DISC profiles
import odatResults from "../../docs/odat_results_copy.json";

export type ColorProfile = {
  color_name: string;
  factor: string;
  factor_full_name: string;
  short_summary: string;
  traits: string[];
  strengths: string[];
  watch_outs: string[];
  communication_tips: string[];
  typical_motivators: string[];
  disclaimer_line: string;
};

export type BlendedTemplate = {
  intro: string;
  note: string;
};

export const colorProfiles: Record<string, ColorProfile> = odatResults.colors;
export const blendedTemplate: BlendedTemplate = odatResults.blended_result_template;
export const generalDisclaimer = odatResults.general_disclaimer;
export const attribution = odatResults.attribution;

/**
 * Gets the profile for a color
 */
export function getColorProfile(color: string): ColorProfile | undefined {
  return colorProfiles[color];
}

/**
 * Gets profiles for blended types (e.g., "Red/Yellow")
 */
export function getBlendedProfiles(colors: string): ColorProfile[] {
  const colorList = colors.split("/");
  return colorList
    .map((color) => colorProfiles[color])
    .filter((profile): profile is ColorProfile => profile !== undefined);
}

/**
 * Gets the formatted blended intro text
 */
export function getBlendedIntro(colors: string): string {
  return blendedTemplate.intro.replace("{colors}", colors);
}
