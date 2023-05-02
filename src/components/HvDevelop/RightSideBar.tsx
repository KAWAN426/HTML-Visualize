import styled from 'styled-components';
import { useState } from 'react';
import { IHvData } from '../../types';
import StyleSet from './StyleSet';
import HvExport from './HvExport';

const RightSideBar = ({ hvData }: { hvData: IHvData }) => {
  const [sidePage, setSidePage] = useState(0);
  return (
    <Container>
      <PageSelectBtn id="rightSideBar">
        <h1 style={{ opacity: sidePage === 0 ? "1" : "0.6" }}
          onClick={() => {
            setSidePage(0);
            document.getElementById("rightSideBar")?.scrollTo(0, 0);
          }}
        >Style</h1>
        <h1 style={{ opacity: sidePage === 1 ? "1" : "0.6" }}
          onClick={() => {
            setSidePage(1);
            document.getElementById("rightSideBar")?.scrollTo(0, 0);
          }}
        >Export</h1>
      </PageSelectBtn>
      {sidePage === 0 && <StyleSet hvData={hvData} />}
      {sidePage === 1 && <HvExport />}
    </Container>
  )
}

const Container = styled.aside`
  position: absolute;
  right:0px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 320px;
  height: calc(100vh - 52px);
  background-color: white;
  &::-webkit-scrollbar{
    width: 6px;
    background-color: initial;
  }
  &::-webkit-scrollbar-thumb{
    background-color: rgba(54, 54, 54, 0.4);
  }
  @media screen and (max-width: 800px) {
    display:none;
  }
`
const PageSelectBtn = styled.section`
  display: flex;
  position: fixed;
  background-color: white;
  width:calc(320px - 20px);
  padding: 3px 10px;
  z-index: 1;
  border-bottom: 1.5px solid rgba(54,54,54,0.25);
  h1{
    padding: 12px 10px;
    font-size: 13px;
    cursor: pointer;
    font-weight: bold;
  }
`

export default RightSideBar;
