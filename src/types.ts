export type UntitledPartten = 'Untitled' | 'parse-url'

export type ReducedBookmarkTreeNode = Pick<chrome.bookmarks.BookmarkTreeNode, | 'title'
  | 'children'
  | 'url'>
