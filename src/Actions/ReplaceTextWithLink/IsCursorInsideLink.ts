export type IsCursorInsideLink = (beforeCursor: string, afterCursor: string) => boolean

/**
 * @returns {Function<boolean>} - A function that takes in the text before and after the current cursor position and tells you if the cursor is inside a link.
 */
export default (): IsCursorInsideLink => {
  /** 
   * @param {string} beforeCursor - text before the cursor on the same line.
   * @param {string} afterCursor - text after the cursor on the same line.
   * @returns {boolean} -
   */
  return (beforeCursor: string, afterCursor: string): boolean => {
    const bracketsToTheLeft = /\[\[[^\]]*$/.test(beforeCursor);
    if (!bracketsToTheLeft) return false;
    const bracketsToTheRight = /^[^[]*\]\]/.test(afterCursor);
    return bracketsToTheRight;
  }
}