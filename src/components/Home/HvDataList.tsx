import styled from 'styled-components';
import { ReactComponent as SvgPlus } from "../../icons/plus.svg";
import { ReactComponent as SvgGoogleIcon } from "../../icons/googleIcon.svg";
import { API } from 'aws-amplify';
import { listHvData } from '../../graphql/queries';
import { useEffect, useState } from 'react';
import { IHvData, IUser } from '../../types';
import { Link, useNavigate } from 'react-router-dom';
import { createHvData } from '../../graphql/mutations';
import { getCurrentUser, loginGoogle } from '../../firebase/auth';
const leftBarSize = "233px";

const HvDataList = ({ user }: { user: IUser | null }) => {
  const [hvList, setHvList] = useState<IHvData[] | null>(JSON.parse(sessionStorage.getItem("hvList") || JSON.stringify(null)));
  const navigate = useNavigate();
  const [scale, setScale] = useState<number | null>(Number(JSON.parse(sessionStorage.getItem("listScale") || JSON.stringify(null))));

  const getRandomId = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let id = '';
    for (let i = 0; i < 10; i++) {
      const randomNum = Math.floor(Math.random() * chars.length);
      id += chars.substring(randomNum, randomNum + 1);
    }
    return id;
  }
  const getHvDataList = async () => {
    const user = getCurrentUser();
    sessionStorage.setItem("hvList", JSON.stringify(null));
    if (user) {
      const { data } = await API.graphql({
        query: listHvData,
        variables: {
          filter: { author: { eq: user.id } }
        }
      }) as { data: { listHvData: { items: IHvData[] } } };
      const result = data.listHvData.items;
      if (result) {
        result.forEach((hv) => {
          hv.html = String(hv.html.replace(/\\/g, "").replace(/<br>/g, "")).replace(/contenteditable="true"/g, "");
          sessionStorage.setItem(String(hv.id), JSON.stringify(hv));
        });
        setHvList(result);
        sessionStorage.setItem("hvList", JSON.stringify(result));
      } else setHvList(null);
    } else setHvList(null);
  }
  const tempHtml = `<div class=\"App\" style=\"width: 100%; height: 100%; overflow: auto; display: block; background-color: white;\" id=\"view\"></div>`;
  const addHv = async () => {
    if (window.confirm("새 프로젝트를 생성 하시겠습니까?")) {
      if (!navigator.onLine) {
        alert("오프라인 상태입니다.");
        return;
      };
      const user = getCurrentUser();
      if (user) {
        const result = await API.graphql({
          query: createHvData,
          variables: {
            input: {
              id: getRandomId(),
              html: tempHtml,
              title: "New Hv Project",
              author: user.id
            }
          }
        }) as { data: { createHvData: IHvData | null } };
        const data = result.data.createHvData;
        if (data) {
          getHvDataList();
          navigate(`/hv/${data.id}`);
        } else alert("오류! 프로젝트 생성 실패!");
      } else alert("로그인이 되어있지 않습니다.");
    }
  }

  useEffect(() => {
    getHvDataList();
  }, [user])

  useEffect(() => {
    if (!scale) {
      const scaleWidth = document.getElementById("dev1")?.offsetWidth;
      setScale(scaleWidth ? scaleWidth / 360 / 3.3 : null);
      if (scaleWidth) sessionStorage.setItem("listScale", JSON.stringify(scaleWidth / 360 / 3.3));
    }
    hvList?.forEach((hv) => {
      const width = document.getElementById(hv.id + "cont")?.offsetWidth;
      const preview = document.getElementById(String(hv.id));
      if (preview && width) {
        const scale = width / 360 / 3.3;
        preview.style.transform = `scale(${scale})`;
        sessionStorage.setItem("listScale", JSON.stringify(scale));
      }
    });
    window.addEventListener("resize", () => {
      hvList?.forEach((hv) => {
        const width = document.getElementById(hv.id + "cont")?.offsetWidth;
        const preview = document.getElementById(String(hv.id));
        if (preview && width) {
          const scale = width / 360 / 3.3;
          preview.style.transform = `scale(${scale})`;
          sessionStorage.setItem("listScale", JSON.stringify(scale));
        }
      });
    });
  }, [hvList])

  function compare(a: IHvData, b: IHvData) {
    if (a.updatedAt < b.updatedAt) return 1;
    if (a.updatedAt > b.updatedAt) return -1;
    return 0;
  }

  return (
    <Container>
      {
        user
          ? <Develop num={"1"} onClick={() => { addHv() }} >
            <HvPreviewContainer id="dev1"><SvgPlus width="28" height="28" fill="#676767" /></HvPreviewContainer>
            <DevelopTitle>Make New HV!</DevelopTitle>
          </Develop>
          : <Login>
            <SvgGoogleIcon onClick={loginGoogle} />
            <h1 onClick={loginGoogle}>Login Google</h1>
          </Login>
      }
      {
        user && hvList && hvList.sort(compare).map((data, key) => {
          return (
            <Develop key={key} num={String(key % 2)}>
              <Link to={`/hv/${data.id}`}>
                <HvPreviewContainer id={data.id + "cont"}>
                  <HvPreview style={{ transform: `scale(${scale})` }} id={String(data.id)} dangerouslySetInnerHTML={{ __html: String(data.html) }} />
                </HvPreviewContainer>
                <DevelopTitle>{data.title}</DevelopTitle>
              </Link>
            </Develop>
          )
        })
      }
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
const Login = styled.article`
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
  height:720px;
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

export default HvDataList;