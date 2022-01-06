import styled from "styled-components"
import { theme_color } from "../style/GlobalStyle"

const FooterWrap = styled.div`
  background: ${theme_color.main_3};
  padding: 12px;
  text-align: center;
  color: ${theme_color.text_sub1};
  font-size: 13px;
  width: 100%;
  height: 40px;
  position: absolute;
  bottom: 0;
`

const Footer = () => {
  return <FooterWrap>© 2021 © Copyright. All rights Reserved.</FooterWrap>
}

export default Footer
