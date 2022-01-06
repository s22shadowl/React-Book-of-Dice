import { setAuthToken } from "../utils"

export const googleOauth = {
  onSuccessFunc: async (googleData) => {
    console.log(googleData)
    const res = await fetch(
      "https://fay-trpg-api.herokuapp.com/user/auth/google",
      {
        method: "POST",
        body: JSON.stringify({
          token: googleData.tokenId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    const response = await res.json()
    if (response.ok) {
      const token = response.token
      setAuthToken(token)
      console.log("Success:", response)
      window.location.reload()
    } else {
      alert("Google 登入錯誤")
      window.location.reload()
    }
  },
  onFailureFunc: (err) => {
    console.error(err)
  },
}
