import React, { useContext, useState } from "react"
import styled from "styled-components"
import {
  theme_color,
  RoomControlButton,
  colorChange,
  colorChange_loading,
} from "../style/GlobalStyle"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { GlobalContext } from "../contexts"
import { WebAPI } from "../WebAPI/WebAPI"
import circle_img from "../circle.png"
import * as Yup from "yup"

const PopUpBoxWrap = styled.div`
  position: absolute;
  width: 300px;
  height: 10vh;
  background-color: ${theme_color.text_sub2};
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`
const PopUpBoxMask = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 0;
`
const IsLoadingWrap = styled.div`
  position: absolute;
  text-align: center;
  top: 50%;
  left: 50%;
  background-color: ${theme_color.main_3};
  transform: translate(-50%, -50%);
  width: 30vh;
  height: 30vh;
  z-index: 100;
`
const IsLoadingAnimate = styled.p`
  background: no-repeat url(${circle_img});
  background-size: 100% auto;
  animation: ${colorChange_loading} 2s infinite;
  border-radius: 100%;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
`
const IsLoadingText = styled.div`
  margin-top: 70%;
  font-size: 1.5rem;
  animation: ${colorChange} 2s infinite;
`

export const LoadingAnimation = () => {
  return (
    <PopUpBoxMask onClick={(e) => e.stopPropagation()}>
      <IsLoadingWrap>
        <IsLoadingAnimate />
        <IsLoadingText>Loading...</IsLoadingText>
      </IsLoadingWrap>
    </PopUpBoxMask>
  )
}
export const CreateRoomForm = ({ setEditingCreateRoom }) => {
  const { token, setToken } = useContext(GlobalContext)
  const valuesSchema = Yup.object().shape({
    title: Yup.string(),
    system: Yup.string(),
  })
  return (
    <PopUpBoxMask onClick={() => setEditingCreateRoom(false)}>
      <PopUpBoxWrap onClick={(e) => e.stopPropagation()}>
        <div>建立房間</div>
        <Formik
          initialValues={{
            title: "",
            system: "",
          }}
          validationSchema={valuesSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2))
              actions.setSubmitting(false)
              WebAPI.createRoom(values, token).then((response) => {
                setEditingCreateRoom(false)
                window.location.reload() // 到時候換寫法
              })
            }, 500)
          }}
        >
          {(formik) => (
            <Form>
              <Field
                name="title"
                type="text"
                className="input"
                placeholder="Title"
              />
              <Field
                name="system"
                type="text"
                className="input"
                placeholder="System"
              />
              <p className="alert"></p>
              <RoomControlButton type="submit" disabled={formik.isSubmitting}>
                送出
              </RoomControlButton>
              <RoomControlButton
                disabled={formik.isSubmitting}
                onClick={() => {
                  setEditingCreateRoom(false)
                }}
              >
                取消
              </RoomControlButton>
            </Form>
          )}
        </Formik>
      </PopUpBoxWrap>
    </PopUpBoxMask>
  )
}
export const SearchRoomForm = ({ setEditingSearchRoom, getRoomList }) => {
  const systems = ["", "COC", "DND", "WOD"]
  const [systemFilter, setSystemFilter] = useState()
  const [titleFilter, setTitleFilter] = useState()
  const system = systems.map((system) => (
    <option value={system} key={system}>
      {system}
    </option>
  ))

  return (
    <PopUpBoxMask onClick={() => setEditingSearchRoom(false)}>
      <PopUpBoxWrap onClick={(e) => e.stopPropagation()}>
        <div>搜索房間</div>
        <p>
          標題
          <input
            type="text"
            name="title"
            onChange={(e) => setTitleFilter(e.target.value)}
            placeholder={"請輸入標題"}
          />
        </p>
        <p>
          系統：
          <select
            name="system"
            onChange={(e) => {
              setSystemFilter(e.target.value)
            }}
          >
            {system}
          </select>
        </p>
        <RoomControlButton
          onClick={() => {
            getRoomList(0, titleFilter, systemFilter)
            setEditingSearchRoom(false)
          }}
        >
          搜尋
        </RoomControlButton>
        <RoomControlButton
          onClick={() => {
            setEditingSearchRoom(false)
          }}
        >
          取消
        </RoomControlButton>
      </PopUpBoxWrap>
    </PopUpBoxMask>
  )
}
