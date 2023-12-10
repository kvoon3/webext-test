import { describe, expect, it } from 'vitest'
import { addProperties, reduceProperties } from './bookmark'

const mock_bookmarks: chrome.bookmarks.BookmarkTreeNode[] = [
  {
    id: '1',
    index: 0,
    dateAdded: 0,
    dateGroupModified: 0,
    parentId: '1',
    unmodifiable: 'managed',
    title: '',
    children: [{
      id: '2',
      title: '',
      index: 0,
      dateAdded: 0,
      dateGroupModified: 0,
      parentId: '1',
      unmodifiable: 'managed',
      children: [{
        title: '',
        id: '3',
        index: 0,
      }],
    }],
  },
]

describe('bookmarks', () => {
  it('reduce useless properties', () => {
    expect(reduceProperties(mock_bookmarks)).toStrictEqual([
      {
        title: '',
        children: [{
          title: '',
          children: [{
            title: '',
          }],
        }],
      },
    ],
    )
  })

  it('add properties', () => {
    expect(
      addProperties(
        reduceProperties(mock_bookmarks),
        {
          folded: true,
        },
      ),
    ).toStrictEqual([
      {
        title: '',
        folded: true,
        children: [{
          title: '',
          folded: true,
          children: [{
            title: '',
            folded: true,
          }],
        }],
      },
    ],
    )
  })
})
