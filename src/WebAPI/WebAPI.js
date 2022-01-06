import { setAuthToken } from "../utils"

const BASE_URL = "https://fay-trpg-api.herokuapp.com/"

const APIInstance = (API_URL, token = null, method = "GET", body = null) => {
  const params = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  }
  if (token) {
    params.headers.Authorization = token
  }
  if (body) {
    params.body = JSON.stringify(body)
  }
  return fetch(`${BASE_URL + API_URL}`, params)
    .then((res) => {
      return res.json()
    })
    .catch((error) => {
      console.error("Error", error)
    })
}

export const WebAPI = {
  // 身分驗證

  login: (body) => APIInstance("user/login", null, "POST", body),
  logout: () => {
    setAuthToken(null)
    window.location.reload()
  },
  register: (body) => APIInstance("user/register", null, "POST", body),
  checkToken: (token) => APIInstance("user/checkToken", token),

  // 房間處理
  getRoomList: (offset, title = null, system = null) => {
    let query = "room?limit=6"
    if (offset) query += `&offset=${offset}`
    if (title) query += `&title=${title}`
    if (system) query += `&system=${system}`
    return APIInstance(query)
  },
  createRoom: (body, token) => APIInstance("room/new", token, "POST", body),
  enterRoom: (roomId, token) => APIInstance(`room/${roomId}`, token),
  deleteRoom: (roomId, token) =>
    APIInstance(`room/${roomId}?_method=DELETE`, token, "POST"),

  // 使用者資料
  getRoomCount: (token) => APIInstance("room/count", token),
  getUserInfo: (user, token) => APIInstance(`user/${user}`, token),
}
