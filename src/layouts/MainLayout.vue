<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn v-if="authenticated"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"/>
        <q-toolbar-title>KeyWallet</q-toolbar-title>
        <!-- <q-btn outline dense @click="newAccount()" v-if="authenticated">New Account</q-btn> -->
      </q-toolbar>
    </q-header>

    <q-drawer v-if="authenticated"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-white-smoke"
      :width="200"
      :breakpoint="600">
     <q-scroll-area class="fit">
           <q-list padding>
            <q-item v-for="item of menuItems"
                    :key="item.name"
                    :to="item.to" exact clickable v-ripple
                    @click="handle_function_call(item.onClickFunction)">
              <q-item-section avatar><q-icon :name="item.icon"/></q-item-section>
              <q-item-section>{{item.name}}</q-item-section>
            </q-item>
            <q-separator></q-separator>
            <q-item
              to=""
              exact
              clickable v-ripple
              @click="logout()">
              <q-item-section avatar><q-icon class="text-red"  name="power_settings_new"/></q-item-section>
              <q-item-section class="text-red">Logout</q-item-section>
            </q-item>
          </q-list>
       </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar'
import { fasWallet } from '@quasar/extras/fontawesome-v5'
export default {
  name: 'MainLayout',
  mounted () {
    // this.leftDrawerOpen = true
  },
  created () {
    this.fasWallet = fasWallet
    this.$root.$on('Authenticated', this.openLeftDrawerCallback)
    this.$root.$on('Logout', this.closeLeftDrawerCallback)
    this.$root.$on('WalletDeleted', this.onWalletDeleted)
  },
  components: {
  },
  data () {
    return {
      leftDrawerOpen: true,
      authenticated: false,
      menuItems: [
        {
          name: 'My Wallet',
          icon: fasWallet,
          to: '/account_store',
          onClickFunction: ''
        },
        // {
        //   name: 'Backup',
        //   icon: 'backup',
        //   to: '/backup',
        //   onClickFunction: ''
        // },
        {
          name: 'Change Password',
          icon: 'vpn_key',
          to: '/change_password',
          onClickFunction: ''
        },
        {
          name: 'Delete Wallet',
          icon: 'delete',
          to: '',
          onClickFunction: 'deleteAccount'
        }
        // {
        //   name: 'Logout',
        //   icon: 'power_settings_new',
        //   to: '',
        //   onClickFunction: 'logout'
        // }
      ]

    }
  },
  methods: {
    openLeftDrawerCallback: function () {
      this.authenticated = true
    },
    closeLeftDrawerCallback: function () {
      this.authenticated = false
    },
    // newAccount: function () {
    //   this.$root.$emit('NewAccount')
    // },
    logout: function () {
      if (LocalStorage.getItem('user')) {
        const user = LocalStorage.getItem('user')
        user.authenticated = false
        LocalStorage.set('user', user)
        this.$router.push({ path: '/' })
      }
    },
    deleteAccount: function () {
      this.$q.dialog({
        title: 'Confirm',
        message: 'With this action all saved accounts will be deleted.',
        cancel: true,
        persistent: true
      }).onOk(() => {
        if (LocalStorage.getItem('user')) {
          LocalStorage.remove('user')
          this.closeLeftDrawerCallback()
          this.$router.push({ path: '/' })
        }
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    handle_function_call: function (functionName) {
      if (functionName) { this[functionName]() }
    }
  }
}
</script>
