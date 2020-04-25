<template>
  <q-page class="bg-grey-3 column">
    <div class="q-mt-xl q-mx-sm">
        <q-card class="my-card text-white" flat bordered>
          <q-card-section class="bg-primary text-white">
            <div class="absolute-center">Change Master Key</div>
          </q-card-section>

          <q-card-section>
            <q-input class="q-mb-sm" outlined v-model="oldPassword" label="Old Password" placeholder="enter old password"  dense :type="!showPassword ? 'password': 'text'"
                     :rules="[(val) => (val && val.length > 0) || 'Please enter password']" @keyup="validateOldPassword()"/>
            <q-input class="q-mb-sm" outlined v-model="newPassword" label="New Password" placeholder="enter new password"  dense :type="!showPassword ? 'password': 'text'"
                     :rules="[(val) => (val && val.length > 0) || 'Please enter password']"/>
            <q-input outlined v-model="rePassword" label="Match Password" placeholder="re-enter master password"  dense :type="!showPassword ? 'password': 'text'"
                     :rules="[(val) => (val && val.length > 0) || 'Please enter password']"/>
            <q-checkbox class="text-grey-8"  dense  size="xs" v-model="showPassword" label="Show"/>

            <q-btn type="submit" class="q-mt-md" color="primary" label="Change" style="min-width:100%" @click="changePassword"/>
            <q-separator class="bg-primary"></q-separator>
            <span v-if="newPassword !== rePassword && (password !== '' && rePassword !== '')" class="text-red q-mt-md">Password did not match</span>
            <span v-if="invalidOldPassword" class="text-red q-mt-md">Incorrect old password</span>
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
      this.user = LocalStorage.getItem('user')
      if (!this.user.authenticated) {
        this.$router.push({ path: '/login' })
      } else if (this.user.accounts) {
        this.$root.$emit('Authenticated')
      }
    }
  },
  data () {
    return {
      oldPassword: '',
      newPassword: '',
      rePassword: '',
      showPassword: false,
      invalidOldPassword: false,
      user: null
    }
  },
  methods: {
    validateOldPassword: function () {
      if (this.oldPassword !== this.user.password) {
        this.invalidOldPassword = true
      } else {
        this.invalidOldPassword = false
      }
    },
    changePassword: function () {
      if (this.newPassword !== this.rePassword) {
        // Do not do anything
      } else {
        this.user.password = this.newPassword
        LocalStorage.set('user', this.user)
        this.$router.push({ path: '/login' })
      }
    }
  }
}
</script>
