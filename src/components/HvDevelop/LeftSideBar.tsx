import styled from 'styled-components';
import CompSet from './CompSet';
import CompLayer from './CompLayer';
import { useState } from 'react';
import { IHvData } from '../../types';

const LeftSideBar = ({ hvData }: { hvData: IHvData }) => {
  const [sidePage, setSidePage] = useState(0);
  return (
    <Container id="leftSideBar">
      <PageSelectBtn>
        <h1 style={{ opacity: sidePage === 0 ? "1" : "0.6" }}
          onClick={() => {
            setSidePage(0);
            document.getElementById("leftSideBar")?.scrollTo(0, 0);
          }}
        >Comp</h1>
        <h1 style={{ opacity: sidePage === 1 ? "1" : "0.6" }}
          onClick={() => {
            setSidePage(1);
            document.getElementById("leftSideBar")?.scrollTo(0, 0);
          }}
        >Layer</h1>
      </PageSelectBtn>
      {sidePage === 0 && <CompSet hvData={hvData} />}
      {sidePage === 1 && <CompLayer hvData={hvData} />}
    </Container>
  )
}

const Container = styled.aside`
  left:0px;
  position: absolute;
  display:flex;
  flex-direction: column;
  overflow-y: auto;
  width:340px;
  height:calc(100vh - 52px);
  background-color: white;
  &::-webkit-scrollbar{
    width:6px;
    background-color: initial;
  }
  &::-webkit-scrollbar-thumb{
    background-color: rgba(54,54,54,0.4);
  }
  @media screen and (max-width: 800px) {
    display: none;
  }
`
const PageSelectBtn = styled.section`
  display: flex;
  padding: 3px 10px;
  border-bottom: 1.5px solid rgba(54,54,54,0.25);
  position: fixed;
  width:calc(340px - 20px);
  background-color: white;
  h1{
    padding: 12px 10px;
    font-size: 13px;
    cursor: pointer;
    font-weight: bold;
  }
`

export default LeftSideBar
