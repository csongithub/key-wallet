import { LocalStorage } from 'quasar'

//
// user has logged in successfully.
// this is the place where we are going to set the
// state of our store with our user object.
//
export const LOGIN = (state, user) => {
  state.user = user
  LocalStorage.set('user', user)
}

//
// user has explicitly been logged out, or was
// forceably logged out because of an expired token
// clear out our state and reset everything basically
//
export const LOGOUT = (state, user) => {
  state.user = null
  LocalStorage.clear()
  location.replace('/')
}
