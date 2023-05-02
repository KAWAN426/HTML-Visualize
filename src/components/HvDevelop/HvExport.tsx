import styled from 'styled-components'
import { compAttribute, ableInsert } from "../../addableComps/compData"
import { ReactComponent as SvgReact } from "../../icons/react.svg";
import { ReactComponent as SvgHtml } from "../../icons/html.svg";
import { ReactComponent as SvgClipBoard } from "../../icons/clipBoard.svg";
import CopyToClipboard from 'react-copy-to-clipboard';
import { useState } from 'react';

const HvExport = () => {
  const iconSize = { width: 32, height: 32 };
  const [hvResult, setHvResult] = useState<{ html: String, type: "react" | "html" } | null>(null);
  let usedStyle: { name: string, style: string }[] = [];
  let tabSize = 0;

  const indexCss = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap');
body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: white;
}
* {
  background-color: initial;
  margin: 0px;
  padding: 0px;
  border: none;
  outline: none;
  text-decoration: none;
  user-select: none;
}
input {
  min-width: 0px;
  min-height: 0px;
}
img {
  width: 300px;
  height: 300px;
}
a {
  text-decoration: none;
  cursor: pointer;
}
h1,
h2,
h3,
h4,
h5,
a,
textarea,
pre,
input,
select {
  /* font-family: 'Nanum Gothic', sans-serif; */
  font-size: 14px;
  font-weight: 400;
  color: #242424;
  font-family: 'Inter', sans-serif;
}`

  const makeHtmlCodeToCopy = (comp: HTMLElement) => {
    tabSize = 0;
    usedStyle = [];
    const result = getOriginHtml(comp, []);
    const htmlComp = result?.htmlComp.replace(/></g, ">\n<").replace(`\n`, "");
    let styleCode = "";
    result?.styleList.forEach((t) => {
      styleCode += t + "\n";
    });

    const appCode = `${htmlComp}\n<style>\n${styleCode}</style>\n<style>${indexCss}\n</style>`;

    return appCode;
  }

  const getOriginHtml = (comp: HTMLElement, imports: string[]) => {
    if (comp.className) { // 대상이 문자같은 클래스가 없는 객체가 아닐 경우
      let compName = "";
      if (comp.getAttribute("divide") === "true" || comp.id === "view") {
        compName = "container";
      } else {
        compName = `${comp.className}`;
      }
      let htmlComp: string = "";
      const styleList: string[] = [];

      const styleString = comp.style.cssText
        .replace(/; /g, ";\n  ")
        .replace("box-shadow: rgb(13, 153, 255) 0px 0px 0px 2.5px inset;\n", "")
        .replace("box-shadow: rgb(139, 204, 251) 0px 0px 0px 2.5px inset;\n", "");

      if (Boolean(styleString)) {
        if (usedStyle.filter(e => e.style === styleString).length === 0) { // 스타일 겹치면 하나로 통합
          usedStyle.push({ name: compName, style: styleString });
          styleList.push(`.${compName} {\n  ${styleString}\n}`);
        } else {
          compName = usedStyle.filter(e => e.style === styleString)[0].name;
        }
      }

      let attribute = "";
      if (Boolean(styleString)) {
        attribute += ` class="${compName}"`;
      }
      if (compAttribute[comp.tagName.toLowerCase()]) {
        compAttribute[comp.tagName.toLowerCase()].forEach((att) => {
          attribute += ` ${att}="${comp.getAttribute(att)}"`;
        });
      }

      htmlComp += `\n${"  ".repeat(tabSize)}<${comp.tagName.toLowerCase()}${attribute}${(ableInsert.indexOf(comp.tagName.toLowerCase()) > -1) ? " /" : ""}>`;
      tabSize++;
      let isChildText = false;
      const importArray: string[] = imports;
      if (comp.childNodes.length > 0) {
        comp.childNodes.forEach((childComp) => {
          const comp = childComp as HTMLElement;
          if (comp.nodeType === 3) { // 텍스트면 텍스트를 추가
            htmlComp += comp.textContent;
            isChildText = true;
          } else {
            isChildText = false;
            if (comp.getAttribute("divide") === "true") { // 내부에 컴포넌트가 따로 나뉘면 나눔
              makeHtmlCodeToCopy(comp);
              htmlComp += `\n${"  ".repeat(tabSize)}<${comp.tagName.toLowerCase()} />`
              importArray.push(comp.className);
            } else {
              const value = getOriginHtml(comp, importArray); // 내부 컴포넌트 결과를 가져옴
              if (value) {
                styleList.push(...value.styleList);
                htmlComp += value.htmlComp;
                tabSize--;
              }
            }
          }
        });
      }

      if (!(ableInsert.indexOf(comp.tagName.toLowerCase()) > -1)) {
        if (isChildText) htmlComp += `</${comp.tagName.toLowerCase()}>`;
        else htmlComp += `\n${"  ".repeat(tabSize - 1)}</${comp.tagName.toLowerCase()}>`;
      }
      return { styleList, htmlComp, importArray };
    }
  }

  const makeReactCodeToCopy = (comp: HTMLElement) => {
    tabSize = 0;
    usedStyle = [];
    const result = getReactHtml(comp, []);
    const htmlComp = result?.htmlComp.replace(/></g, ">\n<");
    let styleCode = "";
    let imports = "";
    result?.styleList.forEach((t) => {
      styleCode += t + "\n";
    });
    // result?.importArray.forEach((s) => {
    //   imports += `import ${s.charAt(0).toUpperCase() + s.slice(1)} from "./${s.charAt(0).toUpperCase() + s.slice(1)}"\n`
    // })

    const appCode = `import styled from 'styled-components'\n${imports}\nconst ${comp.className.charAt(0).toUpperCase() + comp.className.slice(1)} = () => {\n  return (${htmlComp}\n  )\n}\n${styleCode}\nexport default ${comp.className.charAt(0).toUpperCase() + comp.className.slice(1)}\n`;

    return appCode;
  }

  const getReactHtml = (comp: HTMLElement, imports: string[]) => {
    if (comp.className) { // 대상이 문자같은 클래스가 없는 객체가 아닐 경우
      let compName = "";
      if (comp.getAttribute("divide") === "true" || comp.id === "view") {
        compName = "Container";
      } else {
        compName = `${comp.className.charAt(0).toUpperCase() + comp.className.slice(1)}`;
      }
      let htmlComp: string = "";
      const styleList: string[] = [];
      let attribute = "";
      if (compAttribute[comp.tagName.toLowerCase()]) {
        compAttribute[comp.tagName.toLowerCase()].forEach((att) => {
          if (att !== "name") attribute += ` ${att}="${comp.getAttribute(att)}"`;
        });
      }

      const styleString = comp.style.cssText
        .replace(/; /g, ";\n  ")
        .replace("box-shadow: rgb(13, 153, 255) 0px 0px 0px 2.5px inset;\n", "")
        .replace("box-shadow: rgb(139, 204, 251) 0px 0px 0px 2.5px inset;\n", "");

      if (Boolean(styleString)) {
        if (usedStyle.filter(e => e.style === styleString).length === 0) { // 스타일 겹치면 하나로 통합
          usedStyle.push({ name: compName, style: styleString });
          styleList.push(`const ${compName} = styled.${comp.tagName.toLowerCase()}` + "`\n  " + styleString + "\n`");
        } else {
          compName = usedStyle.filter(e => e.style === styleString)[0].name;
        }
      } else {
        compName = comp.tagName.toLowerCase();
      }

      htmlComp += `\n    ${"  ".repeat(tabSize)}<${compName}${attribute}${ableInsert.indexOf(comp.tagName.toLowerCase()) > -1 ? " /" : ""}>`;
      tabSize++;
      let isChildText = false;
      const importArray: string[] = imports;
      if (comp.childNodes.length > 0) {
        comp.childNodes.forEach((childComp) => {
          const comp = childComp as HTMLElement;
          if (comp.nodeType === 3) { // 텍스트면 텍스트를 추가
            htmlComp += comp.textContent;
            isChildText = true;
          } else {
            isChildText = false;
            if (comp.getAttribute("divide") === "true") { // 내부에 컴포넌트가 따로 나뉘면 나눔
              makeReactCodeToCopy(comp);
              htmlComp += `\n    ${"  ".repeat(tabSize)}<${comp.className.charAt(0).toUpperCase() + comp.className.slice(1)} />`
              importArray.push(comp.className);
            } else {
              const value = getReactHtml(comp, importArray);
              if (value) {
                styleList.push(...value.styleList);
                htmlComp += value.htmlComp;
                tabSize--;
              }
            }
          }
        });
      }

      if (!(ableInsert.indexOf(comp.tagName.toLowerCase()) > -1)) {
        if (isChildText) htmlComp += `</${compName}>`;
        else htmlComp += `\n    ${"  ".repeat(tabSize - 1)}</${compName}>`;
      }
      return { styleList, htmlComp, importArray };
    }
  }

  return (
    <Container>
      <ExportBtn onClick={() => { setHvResult({ type: "react", html: makeReactCodeToCopy(document.getElementById("view") as HTMLElement) }) }}>
        <SvgReact {...iconSize} />
        <h1>React 코드 생성</h1>
      </ExportBtn>
      <ExportBtn onClick={() => { setHvResult({ type: "html", html: makeHtmlCodeToCopy(document.getElementById("view") as HTMLElement) }) }}>
        <SvgHtml {...iconSize} />
        <h1>HTML CSS 코드 생성</h1>
      </ExportBtn>
      {
        hvResult &&
        <>
          <ResultBar>
            <h1>Main</h1>
            <CopyToClipboard text={String(hvResult.html)}>
              <SvgClipBoard onClick={() => { window.alert("코드가 복사 되었습니다!") }} width={18} height={18} fill="#242424" style={{ padding: 4, cursor: "pointer" }} />
            </CopyToClipboard>
          </ResultBar>
          <ResultText>{hvResult.html}</ResultText>
          {
            hvResult.type === "react" &&
            <>
              <ResultBar>
                <h1>Index.css</h1>
                <CopyToClipboard text={indexCss}>
                  <SvgClipBoard onClick={() => { window.alert("코드가 복사 되었습니다!") }} width={18} height={18} fill="#242424" style={{ padding: 4, cursor: "pointer" }} />
                </CopyToClipboard>
              </ResultBar>
              <ResultText>{indexCss}</ResultText>
            </>
          }
        </>
      }
    </Container>
  )
}

const Container = styled.div`
  margin-top: 52px;
  padding-bottom: 20px;
  display:flex;
  flex-direction: column;
`
const ExportBtn = styled.button`
  display:flex;
  align-items: center;
  background-color: #1264A3;
  padding:10px 12px;
  color:white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin: 20px;
  margin-bottom: 0px;
  h1{
    color:white;
    margin-left: 8px;
    font-size: 14px;
  }
`
const ResultBar = styled.span`
  margin: 16px;
  margin-bottom: 0px;
  margin-top: 30px;
  padding: 5px 16px;
  background-color: #aaaaaa;
  display:flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px 4px 0px 0px;
  h1{
    font-weight: bold;
    font-size: 13px;
  }
  span{
    display:flex;
    align-items: center;
  }
`
const ResultText = styled.pre`
  height: 270px;
  margin: 0px 16px;
  padding: 12px;
  font-size: 14px;
  background-color: #3e3e3e;
  border-radius: 0px 0px 4px 4px;
  user-select: text;
  color:white;
  overflow: scroll;
  &::-webkit-scrollbar{
    width:10px;
    height:10px;
  }
  &::-webkit-scrollbar-corner{
    background-color: initial;
  }
  &::-webkit-scrollbar-thumb{
    background-color: rgba(54,54,54,0.4);
  }
`

export default HvExport;
