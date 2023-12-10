<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { isDark, session, supabase, toggleDark } from '~/logic/state'
import type { UntitledPartten } from '~/types'
import { reduceProperties } from '~/utils/bookmark'

// supabase table name
enum TableName {
  bookmarks = 'bookmarks',
}

const localBookmarks = ref<chrome.bookmarks.BookmarkTreeNode[] | null>(null)
const remoteBookmarks = ref<chrome.bookmarks.BookmarkTreeNode[] | null>(null)

async function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error)
    consola.error('sign out error', error)
}

async function getRemoteBookmarks() {
  const res = await supabase
    .from(TableName.bookmarks)
    .select('*')

  const { data, error } = res
  if (error)
    consola.log(`get bookmarks error:${error}`)

  consola.log('data', data)
  return res
}

async function uploadBookmarks() {
  if (!localBookmarks.value) {
    consola.log('not find bookmarks')
    return
  }

  consola.log('reduced local bookmarks', reduceProperties(localBookmarks.value))

  if (remoteBookmarks.value?.length) {
    consola.log('update')
    const { data, error } = await supabase
      .from(TableName.bookmarks)
      .update([
        {
          update_at: new Date().toISOString(),
          bookmarks: localBookmarks,
        },
      ])
      .eq('user_id', session.value?.user.id)

    consola.log('data', data)
    if (error)
      consola.error('error', error)
  }
  else {
    consola.log('insert')
    const { data, error } = await supabase
      .from(TableName.bookmarks)
      .insert([
        {
          user_id: session.value?.user.id,
          user_email: session.value?.user.email,
          bookmarks: localBookmarks,
        },
      ])

    consola.log('data', data)
    if (error)
      consola.error('error', error)
  }
}

const bookmarkUrlVisible = ref(true)
const toggleBookmarkUrlVisible = useToggle(bookmarkUrlVisible)
// TODO: use type: UntitledPartten
const untitledPartten = ref<UntitledPartten>('parse-url')

onMounted(async () => {
  const { data } = await getRemoteBookmarks()
  remoteBookmarks.value = data

  localBookmarks.value = await chrome.bookmarks.getTree()
  consola.log('local bookmarksTree', localBookmarks)
})
</script>

<template>
  <main class="w-[600px] px-4 py-5 text-center text-gray-700" border-2 space-y-2 bg-base text-base>
    <section>
      <button mt-2 btn @click="openOptionsPage">
        Open Options
      </button>
      <AuthEmailOTP v-if="!session" />
      <button btn @click="() => signOut()">
        Sign Out
      </button>
      <button btn @click="() => uploadBookmarks()">
        upload bookmarks
      </button>
      <button btn @click="() => getRemoteBookmarks()">
        get bookmarks
      </button>
      <button :class="isDark ? 'i-carbon-moon' : 'i-carbon-sun'" btn @click="() => toggleDark()" />
    </section>

    <fieldset>
      <OptionCheckbox :value="bookmarkUrlVisible" />
      <div flex="~ center" justify-start space-x-2>
        <input type="checkbox" name="url visible" checked @click="() => toggleBookmarkUrlVisible()">
        <label for="url visible">Url Visible</label>
      </div>
      <div flex="~ center" justify-start space-x-2>
        <input id="1" type="radio" name="title partten" value="untitled" @change="() => untitledPartten = 'Untitled'">
        <label for="1">Untitled</label>

        <input id="2" type="radio" name="title partten" value="parse-url" checked @change="() => untitledPartten = 'parse-url'">
        <label for="2">Parse Url</label>
      </div>
    </fieldset>
    <section h-100 of-scroll rounded text-left text-lg>
      <BookmarksTree
        v-if="localBookmarks && localBookmarks.length"
        :bookmarks="localBookmarks"
        :title-partten="untitledPartten"
        :url-visible="bookmarkUrlVisible"
      />
    </section>
  </main>
</template>
