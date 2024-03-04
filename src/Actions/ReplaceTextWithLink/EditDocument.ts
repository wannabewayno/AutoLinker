import type { Editor } from "obsidian";
import type { MatchedPhrase } from "./MatchPhraseRulesAgainstScope";
import { GetReplacementRange } from "./GetReplacementRange";
import { GetReplacement } from "./GetReplacement";

type Dependencies = {
  getReplacementRange: GetReplacementRange,
  getReplacement: GetReplacement,
}

export type EditDocument = (editor: Editor, matchedPhrase: MatchedPhrase) => void

export default ({
  getReplacementRange,
  getReplacement,
}: Dependencies): EditDocument => {
  /**
   * editDocument
   * Receives the current editor and the phrase to replace.
   * It then edits the document to replace the desired phrase with a given link.
   * @param editor 
   * @param matchedPhrase 
   */
  return (editor: Editor, matchedPhrase: MatchedPhrase) => {
    const cursor = editor.getCursor();
    const [start, end] = getReplacementRange(cursor, matchedPhrase);
    const replacementText = getReplacement(matchedPhrase);

    // Replace the matching phrase in the document with the replacement.
    editor.replaceRange(replacementText, start, end);
    
    // Update the cursor to the position past the added text so you can keep typing.
    const newCursorPosition = {
      line: start.line,
      ch: start.ch + replacementText.length + 1 // Adjust for 'extra' dummy white-space that was added.
    };
    editor.setCursor(newCursorPosition);
  }
}