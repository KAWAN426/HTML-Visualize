import styled from 'styled-components';
import { ReactComponent as SvgGoogleIcon } from "../../icons/googleIcon.svg";
import { API } from 'aws-amplify';
import { listShareComps } from '../../graphql/queries';
import { useEffect, useState } from 'react';
import { IShareComp, IUser } from '../../types';
import { getCurrentUser, loginGoogle } from '../../firebase/auth';
const leftBarSize = "233px";

const ShareCompList = ({ user }: { user: IUser | null }) => {
  const [shareCompList, setShareCompList] = useState<IShareComp[] | null>(JSON.parse(sessionStorage.getItem("shareComp") || JSON.stringify(null)));

  const getShareComp = async () => {
    const user = getCurrentUser();
    sessionStorage.setItem("shareComp", JSON.stringify(null));
    if (user) {
      const { data } = await API.graphql({
        query: listShareComps
      }) as { data: { listShareComps: { items: IShareComp[] } } };
      const result = data.listShareComps.items;
      if (result) {
        setShareCompList(result);
        sessionStorage.setItem("shareComp", JSON.stringify(result));
      } else setShareCompList(null);
    } else setShareCompList(null);
  }
  const resizeListSize = () => {
    shareCompList?.forEach((data) => {
      const originComp = document.getElementById(data.id);
      const childComp = originComp?.childNodes[0] as HTMLElement;
      const contWidth = document.getElementById(data.id + "Cont")?.clientWidth;
      const contHeight = document.getElementById(data.id + "Cont")?.clientHeight;
      let scale = 1;
      if (contHeight && contWidth && originComp) {
        if (childComp.clientWidth / 3 * 2 >= childComp.clientHeight) {
          scale = (contWidth / childComp.clientWidth) - (contWidth / childComp.clientWidth * 0.3);
          if (scale > 2) scale = (scale / 4) + 1;
        } else {
          scale = (contHeight / childComp.clientHeight) - (contHeight / childComp.clientHeight * 0.3);
          if (scale > 2) scale = (scale / 4) + 1;
        }
        originComp.style.transform = `scale(${scale})`;
      }
      const parentComp = document.getElementById(data.id + "Cont")?.parentNode as HTMLElement;
      if (parentComp) {
        parentComp.style.display = "flex";
      }
    })
  }

  useEffect(() => {
    getShareComp();
  }, [])

  useEffect(() => {
    resizeListSize();
    window.addEventListener("resize", () => {
      resizeListSize();
    });
  }, [shareCompList]);

  return (
    <Container>
      {/* {
        !user &&
        <Login>
          <SvgGoogleIcon onClick={loginGoogle} />
          <h1 onClick={loginGoogle}>Login Google</h1>
        </Login>
      }
      {
        user && shareCompList && shareCompList.map((data, key) =>
          <Develop key={key} num={String(key % 2)} onClick={() => { sessionStorage.setItem("copyHv", JSON.stringify(data.html)); }}>
            <HvPreviewContainer id={data.id + "Cont"}>
              <HvPreview id={data.id} dangerouslySetInnerHTML={{ __html: String(data.html) }} />
            </HvPreviewContainer>
            <DevelopTitle>{data.name}</DevelopTitle>
          </Develop>
        )
      } */}
    </Container>
  )
}

const Container = styled.main`
  display:flex;
  flex-wrap:wrap;
  width:100%;
  height:100%;
  padding-bottom: 24px;
  background-color: initial;
  margin-top: 52px;
  margin-left: ${leftBarSize};
  @media screen and (max-width: 600px) {
    margin-left: 70px;
  }
`
const Login = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  height:calc(100vh - 52px - 24px);
  width: calc(100vw - ${leftBarSize});
  @media screen and (max-width: 600px) {
    width: calc(100vw - 70px);
  }
  h1{
    cursor: pointer;
    font-size: 20px;
    margin-left: 12px;
    @media screen and (max-width: 600px) {
      font-size: 16px;
    }
  }
  svg{
    cursor: pointer;
    width:36px;
    height:36px;
    @media screen and (max-width: 600px) {
      width:28px;
      height:28px;
    }
  }
`
const HvPreviewContainer = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  background-color: #ededed;
  width:calc(((100vw - ${leftBarSize}) / 2) - 42px);
  height:calc((((100vw - ${leftBarSize}) / 2) - 42px) / 3 * 2);
  @media screen and (min-width: 1600px) {
    width:calc(((100vw - ${leftBarSize}) / 3) - 38px);
    height:calc((((100vw - ${leftBarSize}) / 3) - 38px) / 3 * 2);
  }
  @media screen and (max-width: 900px) {
    width:calc(((100vw - ${leftBarSize}) / 1) - 58px);
    height:calc((((100vw - ${leftBarSize}) / 1) - 58px) / 3 * 2);
  }
  @media screen and (max-width: 600px) {
    width:calc(((100vw - 70px) / 1) - 58px);
    height:calc(((100vw - 70px / 1) - 58px) / 3 * 2);
  }
`
const Develop = styled.section<{ num: string }>` // 0은 오른쪽 1은 왼쪽
  margin: 28px;
  margin-right: 0px;
  margin-bottom: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  outline: 2px solid #dadada;
  border-radius: 8px;
  display:none;
`
const DevelopTitle = styled.h1`
  background-color: #fafafa;
  color:black;
  font-size: 14px;
  height:20px;
  padding:10px 16px;
  display:flex;
  align-items: center;
`
const HvPreview = styled.div`
  position: absolute;
  border-radius: 8px;
  z-index: 2;
  width:360px;
  height:360px;
  display:flex;
  align-items: center;
  justify-content: center;
  &::-webkit-scrollbar{
    width:8px;
    height:8px;
    background-color: initial;
  }
  &::-webkit-scrollbar-thumb{
    background-color: rgba(54,54,54,0.4);
  }
  div{
    &::-webkit-scrollbar{
    width:8px;
    height:8px;
    background-color: initial;
    }
    &::-webkit-scrollbar-thumb{
      background-color: rgba(54,54,54,0.4);
    }
  }
`
export default ShareCompList;