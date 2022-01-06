import React, { useContext } from "react"
import styled from "styled-components"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import book_img from "../book.png"
import {
  theme_color,
  colorChange,
  OauthButtons,
  UserControlButton,
  bounceDown,
} from "../style/GlobalStyle"
import { useHistory } from "react-router-dom"
import { WebAPI } from "../WebAPI/WebAPI"
import { LoadingAnimation } from "../component/PopUpBox"
import { GlobalContext } from "../contexts"

const RegisterPageWrap = styled.div`
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
  }
`
const RegisterForm = styled.div`
  position: relative;
  border: 3px solid ${theme_color.book_sub};
  width: 50%;
  min-width: 180px;
  margin: 20% 30% 50px auto;
  padding: 10px;
  animation: ${colorChange} 5s infinite;
`
const RegisterPage = () => {
  // 排版（資料格式錯誤提示、整個註冊 box）、動畫待升級
  const { isLoading, setIsLoading } = useContext(GlobalContext)
  const history = useHistory()
  const valuesSchema = Yup.object().shape({
    //資料驗證
    username: Yup.string()
      .min(8, "帳號長度需超過八碼")
      .matches(/^(?=.*\d)(?=.*[a-zA-Z]).{8,16}$/, "帳號需包含英文字母與數字")
      .required("請輸入帳號"),
    password: Yup.string()
      .min(8, "密碼長度需超過八碼")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
        "密碼需包含大小寫混和的英文字母與數字"
      )
      .required("請輸入密碼"),
    passwordCheck: Yup.string().when("password", (password, schema) => {
      return password
        ? schema.oneOf([password], "兩次密碼需相同").required("請確認密碼")
        : schema
    }),
    email: Yup.string().email().required("請輸入 Email"),
  })
  return (
    <>
      {isLoading ? (
        <>
          <LoadingAnimation />
        </>
      ) : (
        <RegisterPageWrap>
          <RegisterForm>
            <Formik
              initialValues={{
                username: "",
                password: "",
                passwordCheck: "",
                email: "",
              }}
              validationSchema={valuesSchema}
              onSubmit={(values, actions) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2))
                  WebAPI.register(values).then((response) => {
                    if (response.ok) {
                      history.push("/")
                    }
                  })
                  actions.setSubmitting(false)
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
                  <p className="alert">
                    <ErrorMessage name="username" />
                  </p>
                  <Field
                    name="password"
                    type="password"
                    className="input"
                    placeholder="Password"
                  />
                  <p className="alert">
                    <ErrorMessage name="password" />
                  </p>
                  <Field
                    name="passwordCheck"
                    type="password"
                    className="input"
                    placeholder="Check your Password"
                  />
                  <p className="alert">
                    <ErrorMessage name="passwordCheck" />
                  </p>
                  <Field
                    name="email"
                    type="email"
                    className="input"
                    placeholder="Email"
                  />
                  <p className="alert">
                    <ErrorMessage name="email" />
                  </p>
                  <UserControlButton
                    type="submit"
                    disabled={formik.isSubmitting}
                  >
                    註冊
                  </UserControlButton>
                  <UserControlButton
                    disabled={formik.isSubmitting}
                    onClick={() => {
                      history.push("/")
                    }}
                  >
                    取消
                  </UserControlButton>
                  <div>◆◆ or ◆◆</div>
                  <OauthButtons formik={formik} />
                </Form>
              )}
            </Formik>
          </RegisterForm>
        </RegisterPageWrap>
      )}
    </>
  )
}

export default RegisterPage
