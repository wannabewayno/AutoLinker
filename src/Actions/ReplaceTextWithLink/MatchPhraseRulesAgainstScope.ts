import type Settings from "src/Settings/Settings";
import type { MatchingScope } from "./GetPhraseFromParts";

type Dependencies = {
  settings: Settings
}

export type MatchedPhrase = {
  text: string
  index: number
  replaceWith: string
}
export type MatchPhraseRulesAgainstScope = ({ scope, startingIndexShift }: MatchingScope) => MatchedPhrase | null

/**
 * MatchPhraseRulesAgainstScope Provider
 */
export default ({ settings }: Dependencies): MatchPhraseRulesAgainstScope => {
  
  /**
   * const MatchPhraseRulesAgainstScope
   */
  return ({ scope, startingIndexShift }: MatchingScope): MatchedPhrase | null => {
    const phraseRules = settings.getActiveRules();

    for (const [phrase, replacement, id] of phraseRules) {
      const match = scope.match(phrase);
      if (match) {
        // Track that we used this rule for analytics
        settings.ruleUsed(id);
        return {
          text: match[0],
          index: (match.index || 0) + startingIndexShift,
          replaceWith: replacement,
        }
      }
    }
    return null;
  }
}