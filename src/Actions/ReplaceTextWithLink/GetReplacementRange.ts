import type { EditorPosition } from "obsidian";
import type { MatchedPhrase } from "./MatchPhraseRulesAgainstScope";
import type { GetRangeEnd } from "./GetRangeEnd";
import type { GetRangeStart } from "./GetRangeStart";

export type GetReplacementRange = (cursor: EditorPosition, matchedPhrase: MatchedPhrase) => [start: EditorPosition, end: EditorPosition]

type Dependencies = {
  getRangeEnd: GetRangeEnd, 
  getRangeStart: GetRangeStart
}

export default ({
  getRangeEnd,
  getRangeStart,
}: Dependencies): GetReplacementRange => {
  /**
   * getReplacementRange
   * @param cursor 
   * @param matchedPhrase 
   * @returns 
   */
  return (cursor: EditorPosition, matchedPhrase: MatchedPhrase): [start: EditorPosition, end: EditorPosition] => {
    const start = getRangeStart(cursor, matchedPhrase);
    const end = getRangeEnd(start, matchedPhrase);
    return [start, end];
  }
}