import type { ReducedBookmarkTreeNode } from '~/types'

export function reduceProperties(bookmarks: chrome.bookmarks.BookmarkTreeNode[]) {
  return bookmarks.map((i) => {
    // @ts-expect-error - type error
    delete i.id
    delete i.index
    delete i.dateAdded
    delete i.dateGroupModified
    delete i.parentId
    delete i.unmodifiable
    // @ts-expect-error - type error
    delete i.dateLastUsed
    if (i.children && i.children.length)
      reduceProperties(i.children)
    return i
  })
}

export function addProperties<
  T extends chrome.bookmarks.BookmarkTreeNode | ReducedBookmarkTreeNode,
P extends object,
>(
  bookmarks: (T)[],
  params: P,
  options?: {
    parent?: boolean
    child?: boolean
  },
// FIXME: return correct type declare
// (T | (T & P))[]
): (T & P)[] {
  return bookmarks.map((i) => {
    // parent
    if (i.children && i.children.length) {
      return {
        ...i,
        // ...params,
        ...(options?.parent ? params : {}),
        children: addProperties(i.children, params),
      }
    }
    // child
    else {
      return {
        ...i,
        // ...params,
        ...(options?.child ? params : {}),
      }
    }
  }) as any
}
