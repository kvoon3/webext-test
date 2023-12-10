import type { Session } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark()
export const toggleDark = useToggle(isDark)

const anno_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wbm55dXB2bXhteWhncXpodWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE0OTYxNzQsImV4cCI6MjAxNzA3MjE3NH0.yZQk4AOSTN-XhmAZRgIcOsiMYUNWSO3xFRiVg4L1NsU'
const supabase_url = 'https://mpnnyupvmxmyhgqzhukz.supabase.co'

export const supabase = createClient(supabase_url, anno_key, {
  auth: {
    autoRefreshToken: true,
  },
})

export const session = ref<Session | null>(null)

supabase.auth.onAuthStateChange(async (_, _session) => {
  session.value = _session
  consola.log('session change', _session)
})

supabase.auth.getSession().then(({ data }) => {
  session.value = data.session
  consola.log('data', data)
})
