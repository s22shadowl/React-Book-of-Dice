const TOKEN_NAME = "token"
const USERNAME = "username"

export const setAuthToken = (token) => {
  if (!token) {
    localStorage.removeItem(TOKEN_NAME)
  } else {
    localStorage.setItem(TOKEN_NAME, token)
  }
}
export const setUsername = (username) => {
  if (!username) {
    localStorage.removeItem(USERNAME)
  } else {
    localStorage.setItem(USERNAME, username)
  }
}
export const getUsername = () => {
  const username = localStorage.getItem(USERNAME)
  return username ? username : null
}
export const getAuthToken = () => {
  const token = localStorage.getItem(TOKEN_NAME)
  return token ? token : null
}
