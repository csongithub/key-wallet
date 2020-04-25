<template>
  <q-page class="bg-grey-3 column">
    <div class="q-mt-sm q-ml-sm q-mr-sm">
      <q-card class="my-card q-mb-sm" flat bordered v-for="(account,index) in accounts" :key="index">
      <q-card-section class="bg-primary text-white text-left" >
         {{account.name}}
       <q-btn size="xs"  icon="edit" class="float-right" @click="editAccount(account)" v-if="account.readonly"/>
       <q-btn size="xs"  icon="save" class="float-right" @click="saveAccount(account)" v-else/>
       <q-btn size="xs"  icon="delete" class="float-right" @click="deleteAccount(index)"/>
      </q-card-section>
      <q-card-section>
         <q-input v-model="account.name" label="Account Name" dense :readonly="account.readonly" v-if="!account.readonly"/>
         <q-input v-model="account.email" label="Email" dense :readonly="account.readonly" />
         <q-input v-model="account.username" label="Username" dense :readonly="account.readonly"/>
         <q-input v-model="account.password" label="Password" dense :readonly="account.readonly" type="text" v-if="account.showPassword">
          <template v-slot:append v-if="!account.isNew">
            <q-icon :name="fasEyeSlash" color="primary" @click.stop="hidePassword(index)"/>
          </template>
         </q-input>
         <q-input v-model="account.password" label="Password" dense :readonly="account.readonly" type="password" v-else>
          <template v-slot:append>
            <q-icon :name="fasEye" color="primary" @click.stop="showPassword(index)"/>
          </template>
         </q-input>
      </q-card-section>
    </q-card>
    </div>

    <q-page-sticky position="bottom-right" :offset="fabPos">
      <q-btn size="sm" fab icon="add" color="primary" :disable="fabDragged" v-touch-pan.mouse="moveFab" @click="addNewAccount()"/>
      <!-- <q-btn size="" fab icon="add" color="primary" @click="addNewAccount()"/> -->
    </q-page-sticky>
    <div v-if="!accounts.length" class="no-account absolute-center">
      <div class="text-h6 text-primary text-center" style="opacity: .5">No Accounts</div>
    </div>
  </q-page>
</template>

<script>
import { LocalStorage } from 'quasar'
import { fasEye, fasEyeSlash } from '@quasar/extras/fontawesome-v5'
export default {
  name: 'PageIndex',
  mounted () {
    if (LocalStorage.getItem('user')) {
      this.user = LocalStorage.getItem('user')
      if (!this.user.authenticated) {
        this.$router.push({ path: '/login' })
      } else if (this.user.accounts) {
        this.$root.$emit('Authenticated')
        this.accounts = this.user.accounts
      }
    }
  },
  created () {
    this.fasEye = fasEye
    this.fasEyeSlash = fasEyeSlash
  },
  computed: {
  },
  data () {
    return {
      user: null,
      accounts: [],
      alphabetArray: ['a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', '?', '!', '\\', '_', '-', '&', '@', '#', '$', '%', '*', '(', ')', ' '],
      key: 'key-3088-#%*2205_@',
      encrypt: true,
      decrypt: false,
      maskedPassword: '******',
      fabPos: [18, 18],
      fabDragged: false
    }
  },
  methods: {
    moveFab (ev) {
      this.fabDragged = ev.isFirst !== true && ev.isFinal !== true

      this.fabPos = [
        this.fabPos[0] - ev.delta.x,
        this.fabPos[1] - ev.delta.y
      ]
    },
    newAccount: function () {
      return {
        name: 'Account Name',
        email: '',
        username: '',
        password: '',
        encryptedPassword: '',
        showPassword: true,
        readonly: false,
        isNew: true
      }
    },
    addNewAccount: function () {
      this.accounts.unshift(this.newAccount())
    },
    editAccount: function (account) {
      account.readonly = false
      account.isNew = true
      account.showPassword = true
      account.password = this.getValue(account.encryptedPassword, this.decrypt)
    },
    saveAccount (account) {
      account.readonly = true
      account.isNew = false
      account.showPassword = false
      // account.encryptedPassword = this.getValue(account.password, this.encrypt)
      // account.password = this.maskedPassword
      LocalStorage.set('user', this.user)
    },
    showPassword: function (index) {
      this.accounts[index].showPassword = true
      // this.accounts[index].password = this.getValue(this.accounts[index].encryptedPassword, this.decrypt)
    },
    hidePassword: function (index) {
      this.accounts[index].showPassword = false
    },
    deleteAccount: function (index) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.accounts.splice(index, 1)
        LocalStorage.set('user', this.user)
      }).onCancel(() => {
      }).onDismiss(() => {
      })
    },
    getValue: function (message, mode) {
      const isEncrypting = mode,
        encryptedArray = this.encrypted_array(message, mode)

      let finalMessage = encryptedArray.reduce(function (acc, char, index) {
        acc += char
        return acc
      }, '')

      if (!isEncrypting) {
        finalMessage = finalMessage.toLowerCase()
      }
      return finalMessage
    },
    encrypted_array: function (message, mode) {
      const isEncrypting = mode,
        messageArray = this.convert_to_array(message),
        keyArrays = this.key_adjusted_arrays(),
        alphabetArray = this.alphabetArray

      const encryptedArray = messageArray.map(function (item, index) {
        const currentIndex = (index % keyArrays.length),
          currentKeyArray = keyArrays[currentIndex]

        if (isEncrypting) {
          const alphabetIndex = alphabetArray.indexOf(item),
            encryptedCharacter = currentKeyArray[alphabetIndex]

          return encryptedCharacter
        } else {
          const encryptedIndex = currentKeyArray.indexOf(item),
            decryptedCharacter = alphabetArray[encryptedIndex]

          return decryptedCharacter
        }
      })
      return encryptedArray
    },
    convert_to_array: function (message) {
      return message.split('')
    },
    get_adjusted_key_array: function (item) {
      const itemIndex = this.alphabetArray.indexOf(item),
        beforeIndexArray = this.alphabetArray.slice(0, itemIndex),
        afterIndexArray = this.alphabetArray.slice(itemIndex)

      return afterIndexArray.concat(beforeIndexArray)
    },
    key_adjusted_arrays: function () {
      const adjustedArrays = []
      const keyArray = this.convert_to_array(this.key)
      keyArray.forEach(item => adjustedArrays.push(this.get_adjusted_key_array(item)))
      return adjustedArrays
    }
  }
}
</script>.

<style lang="scss">
</style>
