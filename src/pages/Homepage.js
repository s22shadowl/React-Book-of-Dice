import React, { useState, useContext, useEffect } from "react"
import styled from "styled-components"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { GlobalContext } from "../contexts"
import * as Yup from "yup"
import book_img from "../book.png"
import { LoadingAnimation } from "../component/PopUpBox"
import { setAuthToken, getAuthToken, setUsername, getUsername } from "../utils"
import {
  theme_color,
  colorChange,
  colorChange_loading,
  UserControlButton,
  OauthButtons,
  bounceDown,
} from "../style/GlobalStyle"
import { useHistory } from "react-router-dom"
import { WebAPI } from "../WebAPI/WebAPI"

const LoginBoxWrap = styled.div`
  position: relative;
  border: 3px solid ${theme_color.main_1};
  width: 50%;
  min-width: 180px;
  margin: 20% 30% 50px auto;
  padding: 10px;
  animation: ${colorChange} 5s infinite;
`
const HomePageWrap = styled.div`
  background: no-repeat url(${book_img});
  background-size: 100% auto;
  width: 30vw;
  min-width: 310px;
  height: 80vh;
  max-height: 80vh;
  text-align: center;
  margin: 20px auto;
  padding: 30px;
  flex-grow: 1;
  animation: ${bounceDown} 5s infinite;
  :hover {
    animation: none;
    p {
      animation: ${colorChange_loading} 2s infinite;
    }
  }
`

const Title = styled.div`
  margin-top: 15%;
  font-family: cataneo bt;
  font-size: 5rem;
  margin-left: -10%;
  animation: ${colorChange} 5s infinite;
  @media (min-width: 1200px) and (max-width: 1550px) {
    font-size: 4rem;
  }
  @media (max-width: 1200px) {
    font-size: 3rem;
  }
`

const LoginBox = ({
  defaultUsername,
  nickname,
  isLogin,
  isLoading,
  setIsLoading,
}) => {
  const history = useHistory()
  const valuesSchema = Yup.object().shape({
    username: Yup.string().required("請輸入帳號"),
    password: Yup.string().required("請輸入密碼"),
  })
  /*
                  <ErrorMessage name="username" />
                <br />
                <ErrorMessage name="password" />
  */
  return (
    // 第三方登入未實作，ErrorMessage 還在想怎麼寫比較好看
    <LoginBoxWrap>
      {isLogin ? (
        <>
          <div>歡迎回來！{nickname || defaultUsername}</div>
          <UserControlButton onClick={() => history.push("/rooms")}>
            開始
          </UserControlButton>
          <UserControlButton
            onClick={() => {
              WebAPI.logout()
            }}
          >
            登出
          </UserControlButton>
        </>
      ) : (
        <Formik
          initialValues={{
            username: defaultUsername || "",
            password: "",
          }}
          validationSchema={valuesSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              actions.setSubmitting(false)
              console.log(values)
              setIsLoading(true)
              WebAPI.login(values)
                .then((response) => {
                  console.log(response)
                  if (response.ok) {
                    const token = response.token
                    setIsLoading(false)
                    setAuthToken(token)
                    setUsername(response.user.username)
                    console.log("Success:", response)
                    history.push("/rooms")
                  } else {
                    setUsername(values.username)
                    alert("帳號或密碼錯誤")
                    window.location.reload()
                  }
                })
                .catch((error) => {
                  console.error("Error:", error)
                })
            }, 500)
          }}
        >
          {(formik) => (
            <Form>
              <Field
                name="username"
                type="text"
                className="input"
                placeholder="Username"
              />
              <Field
                name="password"
                type="password"
                className="input"
                placeholder="Password"
              />
              <p className="alert"></p>
              <div>◆◆ or ◆◆</div>
              <OauthButtons history={history} />
              <UserControlButton type="submit" disabled={formik.isSubmitting}>
                登入
              </UserControlButton>
              <UserControlButton
                disabled={formik.isSubmitting}
                onClick={() => {
                  history.push("/register")
                }}
              >
                註冊
              </UserControlButton>
            </Form>
          )}
        </Formik>
      )}
    </LoginBoxWrap>
  )
}

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(false)
  const { user, setUser, token, setToken, isLoading, setIsLoading } =
    useContext(GlobalContext)
  const [nickname, setNickname] = useState()
  const defaultUsername = getUsername()
  useEffect(() => {
    if (getAuthToken()) {
      // local storage 有 Token 才驗證
      WebAPI.checkToken(getAuthToken()).then((res) => {
        console.log(res)
        if (res.ok) {
          // 驗證通過，更新 state
          setAuthToken(res.token)
          setToken(res.token)
          setUser(res.user.id)
          setNickname(res.user.nickname)
          setIsLogin(true)
        } else {
          setAuthToken(null)
          setToken(null)
        }
      })
    }
  }, [])
  return (
    <>
      {isLoading ? (
        <>
          <LoadingAnimation />
        </>
      ) : (
        <HomePageWrap>
          <Title>Book of Dice</Title>
          <LoginBox
            defaultUsername={defaultUsername}
            isLogin={isLogin}
            isLoading={isLoading}
            nickname={nickname}
            setIsLoading={setIsLoading}
          />
        </HomePageWrap>
      )}
    </>
  )
}

export default HomePage
