import type { EditorPosition } from "obsidian"
import type { MatchedPhrase } from "./MatchPhraseRulesAgainstScope"

export type GetRangeEnd = (startingRange: EditorPosition, matchedPhrase: MatchedPhrase) => EditorPosition

export default (): GetRangeEnd => {

  /**
   * const getRangeEnd
   * @param startingRange 
   * @param matchedPhrase 
   * @returns 
   */
  return (startingRange: EditorPosition, matchedPhrase: MatchedPhrase): EditorPosition => {
    return {
      line: startingRange.line,
      ch: (matchedPhrase.text.length) + startingRange.ch,
    }
  }

}