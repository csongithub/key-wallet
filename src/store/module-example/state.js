import { LocalStorage } from 'quasar'

//
// We are only tracking a User object in the LocalStorage
//
export default function () {
  return {
    user: LocalStorage.getItem('user')
  }
}
