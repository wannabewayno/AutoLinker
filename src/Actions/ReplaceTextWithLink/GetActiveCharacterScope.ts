import type Settings from 'src/Settings/Settings';
import type { HasCursorMovedForward } from './HasCursorMovedForward';
import type { GetPhraseFromParts, MatchingScope } from './GetPhraseFromParts';
import type { IsCursorInsideLink } from './IsCursorInsideLink';

type Dependencies = {
  settings: Settings,
  hasCursorMovedForward: HasCursorMovedForward,
  getPhraseFromParts: GetPhraseFromParts,
  isCursorInsideLink: IsCursorInsideLink,
}

interface IEditorPosition {
  line: number,
  ch: number,
}

interface IEditor {
  getCursor(string?: string): IEditorPosition,
  getLine(line: number): string,
}

export type GetActiveCharacterScope = (editor: IEditor) => { scope: string, startingIndexShift: number } | null;

/**
 * 
 */
export default ({
  hasCursorMovedForward,
  getPhraseFromParts,
  isCursorInsideLink,
}: Dependencies) => {

  /**
   * Performantly finds the active text scope around the currrent cursor position.
   * Only return valid text if the user is actively typing outside of the link.
   * Valid text will be returned without any text inside links.
   * Only considers text N positions from the cursor that matches the longest custom rule the user has defined.
   */
  return (editor: IEditor): MatchingScope | null => {
    const cursor = editor.getCursor();
    const didCursorMoveForward = hasCursorMovedForward(cursor);
  
    // If the cursor did not move forward, then the user hasn't typed anything...
    if (!didCursorMoveForward) return null;
  
    // The point of this plugin is to generate links from text...
    // If the user is typing inside a link, don't try and interpret what they're doing.
    const beforeCursor = editor.getLine(cursor.line).slice(0, cursor.ch);
    const afterCursor = editor.getLine(cursor.line).slice(cursor.ch);

    const itIs = isCursorInsideLink(beforeCursor, afterCursor)
    if (itIs) return null;

    /*
      Here we test the text at the boundaries. We want to gaurd against being at the end of the line
      We may not have finished typing yet.
      However we may be editing inside a word, allow this as our RegEx matches as word boundary matches so it won't do
      substring matches
    */
    const boundary = beforeCursor.slice(-1) + afterCursor.slice(0,1);
    if (/^[^\s]{1}$/.test(boundary)) return null;

  
    return getPhraseFromParts(beforeCursor, afterCursor);
  }
}