import styled, { createGlobalStyle, keyframes } from "styled-components"
import wood_floor from "../wood_floor.jpg"
import GoogleLogin from "react-google-login"
import { googleOauth } from "../WebAPI/OAuthAPI"

const theme_color = {
  main_1: "#151926",
  main_2: "#31263f",
  main_3: "#403252",
  text_main: "#8b0000",
  text_sub1: "#ffff99",
  text_sub2: "F5DEB8",
  book_main: "#4B0080",
  book_sub: "#151926",
}

export const colorChange = keyframes`
0% {
    color: ${theme_color.text_main};
}
50% {
    color: red;
}
100% {
    color: ${theme_color.text_main};
}
`
export const colorChange_loading = keyframes`
0% {
    background-color: ${theme_color.text_main};
}
50% {
  background-color: red;
}
100% {
  background-color: ${theme_color.text_main};
}
`

export const bounceDown = keyframes`
25% {
    transform: translateY(-5px);
}
50%,100% {
    transform: translateY(0px);
}
75% {
    transform: translateY(5px);
}
`

const GlobalStyle = createGlobalStyle`
    * {
        font-family: "微軟正黑體";
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    body {
      background: url(${wood_floor}) no-repeat;
      display: flex; 
      flex-direction: column; 
    }
    input {
        background-color: ${theme_color.main_1};
        color: red;
        padding:3px;
        border: none;
        margin: 5px;
    }
    label {
      margin: 5px;
      color: white;
    }
    ::placeholder {
      color: ${theme_color.text_main};
    }
    .alert {
      color: ${theme_color.text_main};
    }
    table {
      max-width: 1100px;
      max-height: 1100px;
      padding: 25px 20px 20px 20px ;
    }
`

const OauthButtonsWrap = styled.div`
  justify-content: center;
`

const UserControlButton = styled.button`
  border: none;
  background-color: ${theme_color.main_1};
  color: inherit;
  padding: 5px;
  margin: 3px;
  border: ${theme_color.text_main} 1px solid;
`
const RoomControlButton = styled.button`
  border: 3px solid black;
  background-color: ${theme_color.text_sub1};
  font-size: 1.5rem;
  padding: 5px;
  margin: 5px;
`

const OauthButtons = () => {
  // FaceBook 與 Twitter 串接未實作
  return (
    <OauthButtonsWrap>
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        buttonText="使用 Google 登入"
        onSuccess={googleOauth.onSuccessFunc}
        onFailure={googleOauth.onFailureFunc}
        cookiePolicy={"single_host_origin"}
      />
      <UserControlButton>Facebook</UserControlButton> 
      <UserControlButton>Twitter</UserControlButton>
    </OauthButtonsWrap>
  )
}

export default GlobalStyle
export { theme_color, OauthButtons, UserControlButton, RoomControlButton }
