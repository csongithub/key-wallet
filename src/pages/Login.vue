<template>
  <q-page class="bg-grey-3 column">
    <div class="q-mt-xl q-mx-sm" >
        <q-card class="my-card q-mb-sm" flat bordered>
          <q-card-section class="bg-primary text-white">
            <div class="absolute-center">Confirm Password</div>
          </q-card-section>

          <q-card-section>
           <q-input class="" outlined v-model="password" label="Password" placeholder="enter master password"  dense :type="!showPassword ? 'password': 'text'"
                     :rules="[(val) => (val && val.length > 0) || 'Please enter password']"/>
           <q-checkbox class="text-grey-8"  dense  size="xs" v-model="showPassword" label="Show"/>

            <q-btn type="submit" class="q-mt-md q-mb-sm" color="primary" label="Confirm" style="min-width:100%" @click="confirmPassword"/>
            <span v-if="error" class="text-red">{{error}}</span>
          </q-card-section>
    </q-card>
     </div>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
// import Vue from 'vue'

export default {
  name: 'PageIndex',
  mounted () {
    if (LocalStorage.getItem('user')) {
      const user = LocalStorage.getItem('user')
      user.authenticated = false
      LocalStorage.set('user', user)
      this.$root.$emit('Logout')
    }
  },
  data () {
    return {
      password: '',
      showPassword: false,
      error: ''
    }
  },
  methods: {
    confirmPassword: function () {
      const user = LocalStorage.getItem('user')
      if (user.password === this.password) {
        user.authenticated = true
        LocalStorage.set('user', user)
        this.$router.push({ path: '/account_store' })
        this.$root.$emit('Authenticated')
      } else {
        this.error = 'Incorrect Password'
      }
    }
  }
}
</script>
