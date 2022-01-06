import { setAuthToken, getAuthToken } from "./utils"

const BASE_URL = "https://fay-trpg-api.herokuapp.com/"

export const login = (body) => {
  return fetch(`${BASE_URL}user/login`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      console.error("Error:", error)
      setAuthToken("")
    })
}

export const logout = () => {
  setAuthToken(null)
  window.location.reload()
}

export const register = (body) => {
  return fetch(`${BASE_URL}user/register`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

export const roomlist = () => {
  return fetch(`${BASE_URL}room`, {
    method: "GET",
  })
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

export const checktoken = (token) => {
  return fetch(`${BASE_URL}user/checkToken`, {
    method: "GET",
    headers: new Headers({
      Authorization: token,
    }),
  })
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}
export const createroom = (body, token) => {
  return fetch(`${BASE_URL}room/new`, {
    method: "POST",
    headers: new Headers({
      Authorization: token,
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      title: body.title,
      system: body.system,
    }),
  })
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}
export const deleteRoom = (roomId, token) => {
  return fetch(`${BASE_URL}room/${roomId}?_method=DELETE`, {
    method: "POST",
    headers: new Headers({
      Authorization: token,
    }),
  })
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}
