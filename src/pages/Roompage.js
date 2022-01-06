import React, { useState, useContext, useEffect } from "react"
import styled from "styled-components"
import RoomBox from "../component/Room"
import { GlobalContext } from "../contexts"
import { setAuthToken, getAuthToken } from "../utils"
import { theme_color, RoomControlButton } from "../style/GlobalStyle"
import { useHistory } from "react-router-dom"
import { WebAPI } from "../WebAPI/WebAPI"
import openbook_img from "../open_book.png"
import { LoadingAnimation } from "../component/PopUpBox"
import { CreateRoomForm, SearchRoomForm } from "../component/PopUpBox"

const RoomPageWrap = styled.div`
  position: relative;
  margin: 5vh 10vw 40px 10vw;
  padding-top: 15vh;
  width: 80vw;
  height: 90vh;
  background: no-repeat url(${openbook_img});
  background-size: 100% auto;
`
const UserSettingBarWrap = styled.div`
  position: absolute;
  display: flex;
  top: 0%;
  left: 0%;
  text-align: center;
`
const RoomSettingBarWrap = styled.div`
  position: absolute;
  width: 80%;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0%);
`
const RoomListWrap = styled.div`
  margin: 0 auto 0 auto;
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`
const UserSettingButton = styled.div`
  font-size: 2rem;
  border: 3px solid black;
  background-color: ${theme_color.text_sub1};
  margin: 5px;
  padding: 3px;
`
const RoomSettingButton = styled.button`
  background-color: inherit;
  font-size: 2rem;
  border: 3px solid black;
  background-color: ${theme_color.text_sub1};
  width: 15%;
  margin: 5px;
  padding: 5px;
`
const EmptyRoomWrap = styled.div``

const UserSettingBar = ({ user }) => {
  // 未完工
  const { token, setToken, isLoading, setIsLoading } = useContext(GlobalContext)
  return (
    <UserSettingBarWrap>
      <UserSettingButton
        onClick={() => {
          WebAPI.getUserInfo(user, token).then((res) => console.log(res))
        }}
      >
        個人資料
      </UserSettingButton>
      <UserSettingButton onClick={WebAPI.logout}>登出</UserSettingButton>
    </UserSettingBarWrap>
  )
}

const RoomSettingBar = ({ setFilter, getRoomList }) => {
  // 功能完成
  const [EditingCreateRoom, setEditingCreateRoom] = useState(false)
  const [EditingSearchRoom, setEditingSearchRoom] = useState(false)
  const { token, setToken, isLoading, setIsLoading } = useContext(GlobalContext)
  const [offset, setOffset] = useState(0)
  const [roomCount, setRoomCount] = useState(0)
  WebAPI.getRoomCount(token).then((res) => setRoomCount(res.roomCount))
  return (
    <RoomSettingBarWrap>
      {EditingCreateRoom && (
        <CreateRoomForm
          show={EditingCreateRoom}
          onHide={() => setEditingCreateRoom(false)}
          setEditingCreateRoom={setEditingCreateRoom}
        />
      )}
      {EditingSearchRoom && (
        <SearchRoomForm
          show={EditingSearchRoom}
          onHide={() => setEditingSearchRoom(false)}
          setEditingSearchRoom={setEditingSearchRoom}
          getRoomList={getRoomList}
        />
      )}
      <RoomSettingButton
        onClick={() => {
          setEditingCreateRoom(true)
        }}
      >
        創立房間
      </RoomSettingButton>
      <RoomSettingButton
        onClick={() => {
          setEditingSearchRoom(true)
        }}
      >
        搜索房間
      </RoomSettingButton>
      <RoomSettingButton
        onClick={() => {
          setFilter("My")
          setIsLoading(true)
          getRoomList()
        }}
      >
        我的房間
      </RoomSettingButton>
      <RoomSettingButton
        onClick={() => {
          setFilter("None")
          setIsLoading(true)
          getRoomList()
        }}
      >
        所有房間
      </RoomSettingButton>
      <RoomSettingButton
        onClick={() => {
          getRoomList(offset - 6)
          setOffset(offset - 6)
        }}
      >
        上一頁
      </RoomSettingButton>
      <RoomSettingButton
        onClick={() => {
          getRoomList(offset + 6)
          setOffset(offset + 6)
        }}
      >
        下一頁
      </RoomSettingButton>
      <span>{roomCount}</span>
    </RoomSettingBarWrap>
  )
}

const RoomPage = () => {
  const { user, setUser, token, setToken, isLoading, setIsLoading } =
    useContext(GlobalContext)
  const [rooms, setRooms] = useState([])
  const [filter, setFilter] = useState("None")
  const FILTER_MAP = {
    None: (room) => room,
    My: (room) => room.userId === user,
  }
  const history = useHistory()
  const getRoomList = (offset, title, system) => {
    WebAPI.getRoomList(offset, title, system)
      .then((response) => {
        if (response) {
          setIsLoading(false)
          setRooms(response)
        }
      })
      .catch((error) => console.error(error))
  }

  useEffect(() => {
    setIsLoading(true)
    WebAPI.checkToken(getAuthToken()).then((res) => {
      if (res.ok) {
        setAuthToken(res.token)
        setToken(res.token)
        setUser(res.user.id)
      } else {
        history.push("/")
      }
    })
    getRoomList()
  }, [])

  const RoomList = () => {
    const renderRooms = rooms
      .filter(FILTER_MAP[filter])
      .map((room) => (
        <RoomBox
          key={room.id}
          roomid={room.id}
          content={room.createdAt}
          title={room.title}
          system={room.system}
          userId={room.userId}
        />
      ))
    const clearSearch = () => {
      setFilter("None")
      getRoomList()
    }
    const emptyRoom = (
      <EmptyRoomWrap>
        找不到房間
        <RoomSettingButton onClick={clearSearch}>清空條件</RoomSettingButton>
      </EmptyRoomWrap>
    )
    return (
      <RoomListWrap>
        {isLoading ? (
          <LoadingAnimation />
        ) : renderRooms.length !== 0 ? (
          renderRooms
        ) : (
          emptyRoom
        )}
      </RoomListWrap>
    )
  }

  return (
    <RoomPageWrap>
      <UserSettingBar user={user} />
      <RoomList />
      <RoomSettingBar setFilter={setFilter} getRoomList={getRoomList} />
    </RoomPageWrap>
  )
}

export default RoomPage
