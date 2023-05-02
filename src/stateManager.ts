import { API } from "aws-amplify";
import create from "zustand";
import { getCurrentUser } from "./firebase/auth";
import { updateHvData } from "./graphql/mutations";
import { IHvData } from "./types";

const isSelectChange: boolean = false;
const hvResult: String = "";
const isChangeHv: boolean = true;

export const useStore = create(() => ({ isSelectChange, hvResult, isChangeHv }));

let onDelay = false;
export const changeHvStorage = async (hvData: IHvData, newHvList?: String[]) => {
  if (!navigator.onLine) return;
  const user = getCurrentUser();
  if (document.getElementById("view")?.outerHTML !== undefined && user && hvData.id) {
    const sHistory: string[] = JSON.parse(sessionStorage.getItem(hvData.id + "hstry") || JSON.stringify([]));
    const html = newHvList ? newHvList[newHvList.length - 1] : (document.getElementById("view")?.outerHTML as string)
      .replace("box-shadow: rgb(13, 153, 255) 0px 0px 0px 2.5px inset;", "")
      .replace("box-shadow: rgb(139, 204, 251) 0px 0px 0px 2.5px inset;", "")
      .replace(/contenteditable="true"/g, "")
      .replace(/<br>/g, "");
    if (sHistory[sHistory.length - 1] !== html || (newHvList && newHvList.length > 0)) {
      if (newHvList) {
        sessionStorage.setItem(hvData.id + "hstry", JSON.stringify(newHvList));
      } else {
        sessionStorage.setItem(hvData.id + "hstry", JSON.stringify([...sHistory, html]));
        sessionStorage.setItem(hvData.id + "undo", JSON.stringify([]));
      }
      useStore.setState({ isChangeHv: true });
      if (!onDelay) {
        if (user.id === hvData.author) {
          const result = API.graphql({
            query: updateHvData,
            variables: {
              input: {
                id: hvData.id,
                html
              }
            }
          }) as any;
          result.then(({ data }: { data: { updateHvData: IHvData } }) => {
            if (!(data && data.updateHvData)) console.error("HV 업데이트 실패");
          });
          onDelay = true;
          setTimeout(() => {
            onDelay = false;
          }, 500);
        } else alert("로그인 되어있지 않습니다.");
      } else return;
    }
  }
}

export const getSelectComp = (hvId: string): HTMLElement | null => {
  const storageCompName: string | null = JSON.parse(sessionStorage.getItem(hvId + "selectComp") || JSON.stringify(null));
  const selectComp: HTMLElement | null = storageCompName ? document.querySelector("." + storageCompName) : null;
  return selectComp;
}

export const setSelectComp = (hvId: string, compClassName: string) => {
  const selectComp = getSelectComp(hvId);
  if (selectComp) selectComp.style.boxShadow = "";
  sessionStorage.setItem(hvId + "selectComp", JSON.stringify(compClassName));
  const compElem: HTMLElement | null = document.querySelector("." + compClassName);
  if (compElem) compElem.style.boxShadow = "inset 0px 0px 0px 2.5px #0D99FF";
  useStore.setState({ isSelectChange: true });
}