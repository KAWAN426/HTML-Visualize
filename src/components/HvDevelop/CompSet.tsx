import styled from 'styled-components';
import { ReactComponent as SvgSearch } from "../../icons/search.svg";
import { ReactComponent as SvgPlus } from "../../icons/plus.svg";
import { compData, ableInsert } from '../../addableComps/compData'
import { changeHvStorage, getSelectComp } from "../../stateManager"
import { useState } from 'react'
import { ICompData, IHvData } from "../../types"
import kmp from "kmp";
import { useParams } from "react-router-dom";

const CompSet = ({ hvData }: { hvData: IHvData }) => {
  const hvId = useParams().id || JSON.parse(sessionStorage.getItem("hvId") || JSON.stringify(null));
  const iconStyles = { fill: "#242424", width: 14, height: 14 };
  const [compList, setCompList] = useState(compData);
  const [searchText, setSearchText] = useState('');
  const [nameList, setNameList] = useState<String[]>([]);

  const getRandomId = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    let id = '';
    for (let i = 0; i < 5; i++) {
      const randomNum = Math.floor(Math.random() * chars.length);
      id += chars.substring(randomNum, randomNum + 1);
    }
    return id;
  }
  const searchComp = (keyword: string) => {
    setSearchText(keyword);
    if (keyword !== "") {
      const newCompList: ICompData[] = [];
      compData.map((data, key) => {
        const text = data.name + " " + data.descript;
        if (kmp(text, keyword) > -1) {
          newCompList.push(compData[key]);
        }
      })
      setCompList(newCompList);
    } else setCompList(compData);
  }

  const addComp = (data: ICompData): any => {
    const createElement: HTMLElement = document.createElement("div");
    createElement.insertAdjacentHTML('beforeend', data.comp);
    const newComp = createElement.children[0] as HTMLElement;
    newComp.className = `hv${data.id}${getRandomId()}`;
    if (nameList.indexOf(newComp.className) > -1) {
      return addComp(data);
    }
    setNameList([...nameList, newComp.className]);
    const selectComp = getSelectComp(hvId);
    if (selectComp) {
      if (ableInsert.indexOf(selectComp.tagName.toLowerCase()) > -1) {
        window.alert("선택한 Html에는 Element를 추가할 수 없습니다.");
      } else {
        selectComp.append(newComp);
        changeHvStorage(hvData);
      }
    } else {
      document.getElementById("view")?.append(newComp);
      changeHvStorage(hvData);
    }
  }

  const sortFunc = (a: ICompData, b: ICompData) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }

  return (
    <>
      <SearchContainer>
        <SearchInput value={searchText} onChange={(e) => { searchComp(e.target.value); }} type={"text"} placeholder={"Search"} />
        <SearchBtn>
          <SvgSearch width={16} height={16} fill={"#E8E8E8"} />
        </SearchBtn>
      </SearchContainer>
      {
        compList.sort(sortFunc).map((data, key) => (
          <Comp key={key}>
            <CompTitle title={data.descript}>{data.name}</CompTitle>
            <CompDescript>{data.descript}</CompDescript>
            <CompAddBtn>
              <span onClick={() => { addComp(data) }}>
                <SvgPlus {...iconStyles} />
                <h2>Add</h2>
              </span>
            </CompAddBtn>
          </Comp>
        ))
      }
    </>
  )
}

const SearchContainer = styled.section`
  margin: 20px 16px;
  display: flex;
  align-items: center;
  width:calc(100% - 32px);
  margin-top: 62px;
`
const SearchInput = styled.input`
  width:calc(100% - 28px - 46px);
  background-color: #363636;
  font-size: 14px;
  font-weight: bold;
  padding: 0px 16px;
  border-radius: 4px 0px 0px 4px;
  height:40px;
  color:#E8E8E8;
`
const SearchBtn = styled.button`
  display:flex;
  align-items: center;
  justify-content: center;
  background-color:#676767;
  width:46px;
  height:40px;
  border-radius: 0px 4px 4px 0px;
  cursor: pointer;
`
const Comp = styled.section`
  width:calc(100% - 24px - 32px - 4px);
  border: 2px solid rgba(54,54,54,0.4);
  padding : 12px;
  padding-bottom: 0px;
  margin: 0px 16px;
  margin-top: 18px;
  margin-bottom: 12px;
  border-radius: 4px;
  display:flex;
  background-color: white;
  flex-direction: column;
`
const CompTitle = styled.h1`
  font-weight: 600;
  font-size: 15px;
  line-height: 16px;
  max-height: calc(16px * 2);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow:ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`
const CompDescript = styled.h2`
  font-size: 13px;
  line-height: 17px;
  max-height: calc(17px * 4);
  overflow: hidden;
  text-overflow:ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`
const CompAddBtn = styled.span`
  display:flex;
  justify-content: flex-end;
  margin-top: 16px;
  span{
    display:flex;
    align-items: center;
    cursor: pointer;
    padding: 12px;
    padding-right: 6px;
    h2{
      font-size: 14px;
      margin-left: 9px;
      margin-top: 3px;
    }
  }
`

export default CompSet
