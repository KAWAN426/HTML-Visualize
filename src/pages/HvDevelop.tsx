import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHvData } from "../graphql/queries";
import { API } from 'aws-amplify';
import { IHvData } from '../types';
import LeftSideBar from "../components/HvDevelop/LeftSideBar";
import TopBar from "../components/HvDevelop/TopBar";
import HvView from "../components/HvDevelop/HvView";
import { getCurrentUser } from '../firebase/auth';
import RightSideBar from '../components/HvDevelop/RightSideBar';

const HvDevelop = () => {
  const hvId = useParams().id || JSON.parse(sessionStorage.getItem("hvId") || JSON.stringify(null));
  const [hvData, setHvData] = useState<IHvData | null | "loading">(JSON.parse(sessionStorage.getItem(hvId) || JSON.stringify("loading")));

  const getHvDataFromAmplify = async () => {
    const user = getCurrentUser();
    if (user) {
      const { data } = await API.graphql({
        query: getHvData,
        variables: {
          id: hvId
        }
      }) as { data: { getHvData: IHvData | null } };
      const result: IHvData | null = data.getHvData;
      if (result && result.author === user.id) {
        if (result !== null) result.html = String(result.html.replace(/\\/g, "").replace(/<br>/g, "")).replace(/contenteditable="true"/g, "");
        setHvData(result);
      } else setHvData(null);
    } else setHvData(null);
  }

  useEffect(() => {
    sessionStorage.removeItem(hvId + "selectComp");
    sessionStorage.setItem("hvId", JSON.stringify(hvId));
    if (hvData === null || hvData === "loading") {
      getHvDataFromAmplify();
    }
  }, [])

  if (hvData !== null && hvData !== "loading") {
    return (
      <>
        <TopBar hvData={hvData} />
        <Container>
          <LeftSideBar hvData={hvData} />
          <HvView hvData={hvData} />
          <RightSideBar hvData={hvData} />
        </Container>
      </>
    )
  } else if (hvData === "loading") {
    return (
      <Loading>
        로딩중입니다.
      </Loading>
    )
  }
  else {
    return (
      <div>
        존재하지 않는 페이지 입니다.
      </div>
    )
  }
}

const Container = styled.main`
  width:100%;
  min-height:calc(100vh - 52px);
  display:flex;
`
const Loading = styled.h1`
  width:100vw;
  height:100vh;
  display:flex;
  font-size: 18px;
  align-items: center;
  justify-content: center;
`

export default HvDevelop;