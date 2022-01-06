import React, { useContext } from "react"
import { RoomControlButton } from "../style/GlobalStyle"
import { GlobalContext } from "../contexts"
import styled from "styled-components"
import { WebAPI } from "../WebAPI/WebAPI"
import { useHistory } from "react-router"

const RoomBoxWrap = styled.div`
  flex: 0 1 28%;
  height: 28%;
  width: 50%;
  padding: 10px;
  display: flex;
  border: 3px solid black;
`
const RoomImage = styled.div`
  height: 100%;
  background-size: 100% auto;
`

const RoomTitle = styled.div`
  font-size: 1.5rem;
`
const RoomContext = styled.div``
const RoomBoxLeft = styled.div`
  width: 40%;

  padding: 5px;
`
const RoomBoxRight = styled.div`
  position: relative;
  width: 60%;
  padding: 10px;
  border: 3px solid black;
`

const RoomButtonsWrap = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`

const RoomButtons = ({ roomid, userId }) => {
  const { user, setUser, token, setToken, isLoading, setIsLoading } =
    useContext(GlobalContext)
  const history = useHistory()
  return (
    <RoomButtonsWrap>
      <RoomControlButton
        onClick={() => {
          WebAPI.enterRoom(roomid, token).then((response) => {
            history.push(`/gameroom/${roomid}`)
          })
        }}
      >
        進入房間
      </RoomControlButton>
      {userId === user && (
        <RoomControlButton
          onClick={() => {
            WebAPI.deleteRoom(roomid, token).then((response) => {
              if (response.ok) {
                window.location.reload()
              }
            })
          }}
        >
          刪除房間
        </RoomControlButton>
      )}
    </RoomButtonsWrap>
  )
}

const RoomBox = (room) => {
  return (
    <RoomBoxWrap>
      <RoomBoxLeft>
        <RoomTitle>
          NO.{room.roomid}/{room.title}
        </RoomTitle>
        <RoomImage />
      </RoomBoxLeft>
      <RoomBoxRight>
        <RoomContext>
          建立時間：{room.content}
          <br />
          系統：{room.system}
        </RoomContext>
        <RoomButtons roomid={room.roomid} userId={room.userId} />
      </RoomBoxRight>
    </RoomBoxWrap>
  )
}

export default RoomBox
