//
// use our store to determine if we have a valid user object in the
// store.
// The mere fact that a user in the store implies we have an authenticated
// user.
//
export const isAuthenticated = (state) => {
  return !!state.user
}
