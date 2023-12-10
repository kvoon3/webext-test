<script setup lang="ts">
import { session, supabase } from '~/logic/state'

const email = ref('')
const token = ref('')
const isNeedToken = ref(false)

async function signIn() {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: { shouldCreateUser: true },
  })

  isNeedToken.value = !error && !data.user && !data.session
}

async function verify() {
  const {
    data,
    error,
  } = await supabase.auth.verifyOtp({
    email: email.value,
    token: token.value,
    type: 'email',
  })

  if (error) {
    consola.error(`verify error: ${error.message}`)
    return
  }

  session.value = data.session
}
</script>

<template>
  <section
    flex flex-col flex-center space-y-2
  >
    <section space-x-2>
      <input
        v-model="email"
        type="email"
        placeholder="Your email"
        required border-1 rounded-md px2 leading-loose
      >
      <button
        btn
        @click="() => signIn()"
      >
        Login
      </button>
    </section>
    <section v-show="isNeedToken" space-x-2>
      <input
        v-model="token"
        placeholder="Your Token"
        border-1 rounded-md px2 leading-loose
      >

      <button class="btn" @click="() => verify()">
        verify
      </button>
    </section>
  </section>
</template>
