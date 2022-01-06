import React, { useState, useContext, useEffect } from "react"
import { useParams } from "react-router"
import styled from "styled-components"
import { GlobalContext } from "../contexts"
import { LoadingAnimation } from "../component/PopUpBox"
import { setAuthToken, getAuthToken, setUsername, getUsername } from "../utils"
import {
  theme_color,
  colorChange,
  UserControlButton,
  RoomControlButton,
  OauthButtons,
  bounceDown,
} from "../style/GlobalStyle"
import { useHistory } from "react-router-dom"
import { WebAPI } from "../WebAPI/WebAPI"
import { io } from "socket.io-client"
const socket = io("https://fay-trpg-api.herokuapp.com")

const GamePageWrap = styled.div`
  width: 50vw;
  height: 50vh;
  margin: 10vh auto;
  background: gray;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`
const ChatBoxWrap = styled.div`
  display: flex;
  position: relative;
  padding: 5px;
`
const ButtonsWrap = styled.div``

const ChatWrap = styled.div`
  display: flex;
  flex-direction: column;
  overflow: scroll;
  div {
    padding: 5px;
  }
`
const ChatBTN = styled.div`
  border: black solid 1px;
`
const RollDiceBarWrap = styled.div`
  position: absolute;
  width: 50%;
  background-color: white;
  top: 0;
`

const MyMessage = styled.div`
  text-align: right;
`
const OthersMessage = styled.div``

const RollDiceBar = ({
  setEditingRollDice,
  setDiceInput,
  diceSendingHandler,
}) => {
  const [command, setCommand] = useState("")

  const rollDice = (xd = null, dx = null, cal = null, num = 0) => {
    if (!xd || !dx) {
      return alert("錯誤")
    }
    const dices = []
    let Result = 0
    for (let i = 0; i < xd; i++) {
      const d = Math.floor(Math.random() * dx) + 1
      dices.push(d)
      Result += d
    }
    if (cal) {
      switch (cal) {
        case "+": {
          Result += num
          break
        }
        case "-": {
          Result -= num
          break
        }
        case "*": {
          Result *= num
          break
        }
        case "/": {
          Result /= num
          break
        }
      }
    }
    setDiceInput(
      `系統：rolled ${xd}d${dx}${cal}${num}. Result is [${dices}] ${cal} ${num} = ${Result}.`
    )
    setEditingRollDice(false)
    return
  }
  const handleRolldice = (str) => {
    if (!str) {
      setEditingRollDice(false)
      return
    }

    //目前可以動，達成值跟括弧還沒做
    const dice = str.split(" ").join("").split(/d|D/) // 分割字串
    const mathSymbol = str[str.search(/\+|-|\*|\//)] // 取計算符號
    const flatAndEffectNum = dice[1].split(/\+|-|\*|\//) // 取額外影響值
    rollDice(
      Number(dice[0]),
      Number(flatAndEffectNum[0]),
      mathSymbol,
      Number(flatAndEffectNum[1])
    )
  }
  const infixToPostfix = (str) => {
    //現在是計算 postfix
    const items = []
    class Stack {
      constructor() {
        this[items] = []
      }

      push(element) {
        this[items].push(element)
      }

      pop() {
        return this[items].pop()
      }

      peek() {
        return this[items][this[items].length - 1]
      }

      isEmpty() {
        return this[items].length === 0
      }

      toString() {
        return this[items].toString()
      }
    }
    if (!str) {
      setEditingRollDice(false)
      return
    }

    //目前可以動，達成值跟括弧還沒做
    const infix = str.split("") // 分割字串
    console.log(infix)
    const stack = new Stack()
    infix.forEach((el) => {
      console.log(el, stack)
      if ("+-*x/dD ".indexOf(el) === -1) {
        stack.push(el)
      } else {
        const last = Number(stack.pop())
        const penultimate = Number(stack.pop())
        let cal

        switch (el) {
          case "+":
            cal = last + penultimate
            stack.push(cal)
            break
          case "-":
            cal = last - penultimate
            stack.push(cal)
            break
          case "*" || "x" || "d" || "D":
            cal = last * penultimate
            stack.push(cal)
            break
          case "/":
            cal = penultimate / last
            stack.push(cal)
            break
          default:
            break
        }
        return Number(stack.toString())
      }
    })
  }
  return (
    <RollDiceBarWrap>
      <div>請依照格式丟骰</div>
      <input
        onChange={(e) => {
          setCommand(e.target.value)
        }}
      />
      <button
        onClick={() => {
          handleRolldice(command)
        }}
      >
        送出
      </button>
    </RollDiceBarWrap>
  )
}

const ChatBox = ({
  messageInput,
  setMessageInput,
  inputSendingHandler,
  diceSendingHandler,
  setDiceInput,
}) => {
  //處理 Editor 輸出格式不同的問題
  const [editingRollDice, setEditingRollDice] = useState(false)
  return (
    <ChatBoxWrap>
      {editingRollDice && (
        <RollDiceBar
          show={editingRollDice}
          onHide={() => setEditingRollDice(false)}
          setEditingRollDice={setEditingRollDice}
          diceSendingHandler={diceSendingHandler}
          setDiceInput={setDiceInput}
        />
      )}
      <textarea onChange={(e) => setMessageInput(e.target.value)} />
      <ButtonsWrap>
        <ChatBTN
          onClick={() => {
            inputSendingHandler()
            setMessageInput("")
          }}
        >
          送出
        </ChatBTN>
        <ChatBTN
          onClick={() => {
            setEditingRollDice(true)
          }}
        >
          丟骰
        </ChatBTN>
      </ButtonsWrap>
    </ChatBoxWrap>
  )
}
const ChatButtons = () => {
  const history = useHistory()
  return (
    <RoomControlButton
      onClick={() => {
        history.push("/rooms")
      }}
    >
      回到大廳
    </RoomControlButton>
  )
}
const GamePage = () => {
  let { roomId } = useParams()
  const { user, setUser, token, setToken } = useContext(GlobalContext)
  const [nicknameInput, setNicknameInput] = useState("你")
  const [messageInput, setMessageInput] = useState("")
  const [chatMessageLayout, setChatMessageLayout] = useState([])
  const [diceInput, setDiceInput] = useState()

  useEffect(() => {
    WebAPI.checkToken(getAuthToken()).then((res) => {
      console.log("res", res)
      if (res.ok) {
        setAuthToken(res.token)
        setToken(res.token)
        setUser(res.user.id)
      } else {
        history.push("/")
      }
    })

    WebAPI.enterRoom(roomId, token).then((res) => {
      setChatMessageLayout(res.Chats)
    })
    socket.emit("joinRoom", {
      room: roomId,
    })
  }, [])

  useEffect(() => {
    socket.on("chatSent", function (message) {
      let newState = [...chatMessageLayout, message]
      setChatMessageLayout(newState)
    })
    return () => {
      socket.offAny()
    }
  })

  const diceSendingHandler = () => {
    //處理系統訊息
    if (!diceInput) return
    socket.emit("sendChat", {
      wsId: socket.id,
      userId: user,
      roomId: roomId,
      content: diceInput,
      to: null,
    })
    setDiceInput(null)
  }

  const inputSendingHandler = () => {
    if (!messageInput) return
    socket.emit("sendChat", {
      wsId: socket.id,
      userId: user,
      roomId: roomId,
      content: messageInput,
      to: null,
    })
    setMessageInput("")
  }

  if (diceInput) {
    diceSendingHandler()
  }
  return (
    <GamePageWrap>
      <ChatWrap>
        {chatMessageLayout.map((msgObj) =>
          user === msgObj.userId ? (
            <MyMessage key={msgObj.id}>說: {msgObj.content}</MyMessage>
          ) : (
            <OthersMessage key={msgObj.id}>說: {msgObj.content}</OthersMessage>
          )
        )}
      </ChatWrap>
      <ChatBox
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        inputSendingHandler={inputSendingHandler}
        diceSendingHandler={diceSendingHandler}
        setDiceInput={setDiceInput}
      />
      <ChatButtons />
    </GamePageWrap>
  )
}

export default GamePage
