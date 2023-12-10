<script setup lang="ts">
import parseUrl from 'parse-url'
import type { UntitledPartten } from '~/types'
import { addProperties } from '~/utils/bookmark'

const props = withDefaults(defineProps<{
  bookmarks: chrome.bookmarks.BookmarkTreeNode[]
  titlePartten?: UntitledPartten
  urlVisible?: boolean
}>(), {
  titlePartten: 'Untitled',
  urlVisible: false,
})

function genTitle(bookmark: chrome.bookmarks.BookmarkTreeNode) {
  if (bookmark.title)
    return bookmark.title

  if (bookmark.id === '0')
    return 'Local Bookmarks(Root)'

  switch (props.titlePartten) {
    case 'Untitled': {
      return 'Untitled'
    }
    case 'parse-url': {
      return bookmark.url ? parseUrl(bookmark.url).resource : ''
    }
  }
}

const theBookmarks = ref(addProperties(
  props.bookmarks,
  { folded: true },
  { parent: true },
),
)

type TheBookmark = typeof theBookmarks.value[number]

function handleClick(bookmark: TheBookmark) {
  if (bookmark.children)
    bookmark.folded = !bookmark.folded
  else
    window.open(bookmark.url)
}
</script>

<template>
  <ul p2 text-left bg-base text-base>
    <li v-for="bookmark in theBookmarks" :key="bookmark.id">
      <div
        hover="cursor-pointer bg-slate-1/60 dark:bg-dark7"
        flex items-center rounded py2 pl3 space-x-1
        @click="() => handleClick(bookmark)"
      >
        <!-- folder -->
        <i v-if="bookmark.children && bookmark.children.length" i-carbon-folder inline-block />
        <!-- bookmark link -->
        <img v-if="bookmark.url" :src="`https://www.google.com/s2/favicons?sz=16&domain_url=${bookmark.url}`" alt="">

        <span truncate>
          {{ genTitle(bookmark) }}
          <span v-show="urlVisible" text="slate-4 slate-5">
            {{ bookmark.url ? ` (${bookmark.url})` : '' }}
          </span>
        </span>
        <span
          v-if="bookmark.children"
          flex="~ center"
        >
          <button v-if="bookmark.folded" i-carbon-caret-right />
          <button v-else i-carbon-caret-down />
        </span>
      </div>
      <BookmarksTree
        v-show="!bookmark.folded"
        v-if="bookmark.children"
        :title-partten="titlePartten"
        :bookmarks="bookmark.children"
        :url-visible="urlVisible"
        pl3
      />
    </li>
  </ul>
</template>
