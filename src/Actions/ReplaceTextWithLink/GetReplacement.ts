import type { MatchedPhrase } from "./MatchPhraseRulesAgainstScope";

export type GetReplacement = (matchedPhrase: MatchedPhrase) => string

export default (): GetReplacement => {
  /**
   * const getReplacement
   * @param matchedPhrase 
   * @returns 
   */
   return (matchedPhrase: MatchedPhrase): string => {
    return `[[${matchedPhrase.replaceWith}|${matchedPhrase.text}]]`;
  }
}