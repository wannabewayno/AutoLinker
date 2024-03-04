import type { EditorPosition } from 'obsidian';

export type HasCursorMovedForward = (currCursor: EditorPosition) => boolean
/**
 * Has the cursor moved forward provider.
 * @returns {Function<boolean>} - A function that when given the current Editor position, it determines if it's moved forward.
 */
export default () => {
  let previousCursor: EditorPosition;

  return (currCursor: EditorPosition): boolean => {
    const prevCursor = previousCursor || currCursor;
    previousCursor = currCursor;
    if (currCursor.line !== prevCursor.line) return false;
    return currCursor.ch > prevCursor.ch;
  }
}