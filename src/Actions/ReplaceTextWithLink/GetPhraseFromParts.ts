import type Settings from "src/Settings/Settings";

type Dependencies = {
  settings: Settings,
}

export type MatchingScope = { scope: string, startingIndexShift: number }
export type GetPhraseFromParts = (beforeCursor: string, afterCursor: string) => MatchingScope;

export default ({ settings }: Dependencies) => {
  /**
   * getPhraseFromParts
   * Filter out links from active text and return left and right parts as a whole with dummy white space around cursor/word boundary.
   * returns text before and after the cursor as a whole with links stripped
   * 							beforeCursor										afterCursor
   * <--------------------------------------><------------------------->
   * this is [[some text|before the]] cursor| and this is text [[after]]
   * returns 'this is cursor| and this is text'
   * @param beforeCursor 
   * @param afterCursor 
   * @param loopbackLength 
   * @returns {string} - 
   */
  return (beforeCursor: string, afterCursor: string): MatchingScope => {
    const loopbackLength = settings.getLoopbackLength();
    // It's great that we can shift out things to recursivley match but we need to know the new starting.
    let startingIndexShift = 0;
    const textBeforeCursor = beforeCursor
      .slice(-loopbackLength) // Get the text before the cursor.
      .replace(/^.*\]\]/g, strippedText => {  // Strip anything that looks like a link, count the length of the stripped out text.
        startingIndexShift += strippedText.length
        return ''
      })

    const textAfterCursor = afterCursor
      .slice(0,loopbackLength) // Get the text after the cursor incase we're in the middle of a line editing the content.
      .replace(/\[\[.*$/g,''); // Strip anything that looks like a link to quell inifinit recursion.

    return { scope: textBeforeCursor.concat(textAfterCursor), startingIndexShift };
  }
}