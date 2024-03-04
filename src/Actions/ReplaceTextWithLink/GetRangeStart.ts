import type { EditorPosition } from "obsidian";
import type Settings from "src/Settings/Settings";
import type { MatchedPhrase } from "./MatchPhraseRulesAgainstScope";

type Dependencies = {
  settings: Settings,
}
export type GetRangeStart = (cursor: EditorPosition, matchedPhrase: MatchedPhrase) => EditorPosition;

export default ({ settings }: Dependencies): GetRangeStart => {
  /**
   * getRangeStart
   * @param cursor 
   * @param matchedPhrase 
   * @returns 
   */
  return (cursor: EditorPosition, matchedPhrase: MatchedPhrase): EditorPosition => {
    const loopbackLength = settings.getLoopbackLength();
    return  {
      line: cursor.line,
      ch: cursor.ch - (Math.min(cursor.ch, loopbackLength)) + (matchedPhrase.index|| 0)
    } 
  }
}