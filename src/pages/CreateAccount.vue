<template>
  <q-page class="bg-grey-3 column">
    <div class="q-mt-xl q-mx-sm" >
        <q-card class="my-card q-mb-sm" flat bordered>
          <q-card-section class="bg-primary text-white">
            <div class="absolute-center">Create Master Key</div>
          </q-card-section>

          <q-card-section>
           <q-input class="q-mb-sm" outlined v-model="password" label="Password" placeholder="enter master password"  dense :type="!showPassword ? 'password': 'text'"
                     :rules="[(val) => (val && val.length > 0) || 'Please enter password']"/>
            <q-input outlined v-model="rePassword" label="Match Password" placeholder="re-enter master password"  dense :type="!showPassword ? 'password': 'text'"
                     :rules="[(val) => (val && val.length > 0) || 'Please enter password']"/>
             <q-checkbox class="text-grey-8"  dense  size="xs" v-model="showPassword" label="Show"/>

            <q-btn type="submit" class="q-mt-md" color="primary" label="Create" style="min-width:100%" @click="createMasterPassword"/>
            <q-separator class="bg-primary"></q-separator>
           <span v-if="password !== rePassword && (password !== '' && rePassword !== '')" class="text-red q-mt-md">Password did not match</span>
          </q-card-section>
    </q-card>
     </div>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'PageIndex',
  mounted () {
    if (LocalStorage.getItem('user')) {
      this.goToLogin()
    }
  },
  data () {
    return {
      password: '',
      rePassword: '',
      showPassword: false
    }
  },
  methods: {
    createMasterPassword: function () {
      if (this.password !== this.rePassword) {
        // Do not do anything
      } else {
        const user = {
          password: this.password,
          authenticated: false,
          accounts: []
        }
        LocalStorage.set('user', user)
        this.goToLogin()
      }
    },
    goToLogin: function () {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>
