import { useEffect, useState } from 'react';
import styled from 'styled-components';
import HvDataList from '../components/Home/HvDataList';
import ShareCompList from '../components/Home/ShareCompList';
import { ReactComponent as SvgApps } from "../icons/apps.svg";
import { ReactComponent as SvgFriends } from "../icons/friends.svg";
import { ReactComponent as SvgCommunity } from "../icons/community.svg";
import { ReactComponent as SvgProfile } from "../icons/profile.svg";
import { ReactComponent as SvgWifiOff } from "../icons/wifiOff.svg";
import { getCurrentUser, loginGoogle, logout } from '../firebase/auth';
import { IUser } from '../types';
import { Link, useLocation } from 'react-router-dom';
import Friends from '../components/Home/Friends';
import firebase from "../firebase/config";

const Home = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const iconStyle = { width: 22, height: 22, fill: "#363636" };
  const { pathname } = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);

    window.addEventListener('online', () => { setIsOnline(true) });
    window.addEventListener('offline', () => { setIsOnline(false) });
  }, [])

  return (
    <>
      <TopBar>
        <HvLogo><h2>H</h2><h1>TML</h1><h3>V</h3><h1>isualize</h1></HvLogo>
        {
          !isOnline
            ? <Offline>
              <SvgWifiOff fill="white" width={24} height={24} style={{ margin: "0px 12px", cursor: "pointer" }} />
              <h1>오프라인</h1>
            </Offline>
            : user
              ? <Profile onClick={logout} src={String(user.img)} />
              : <SvgProfile width={30} height={30} style={{ margin: "0px 24px", cursor: "pointer" }} onClick={loginGoogle} />
        }
      </TopBar>
      <main style={{ display: "flex" }}>
        <LeftSideNavBar>
          <Link to={"/"}>
            <HvNav>
              <SvgApps {...iconStyle} />
              <HvNavTitle>My Hv List</HvNavTitle>
            </HvNav>
          </Link>
          <Link to={"/friends"}>
            <HvNav>
              <SvgFriends {...iconStyle} />
              <HvNavTitle>Friends</HvNavTitle>
            </HvNav>
          </Link>
          <Link to={"/community"}>
            <HvNav>
              <SvgCommunity {...iconStyle} />
              <HvNavTitle>Community</HvNavTitle>
            </HvNav>
          </Link>
        </LeftSideNavBar>
        {pathname === "/" && <HvDataList user={user} />}
        {pathname === "/friends" && <Friends user={user} />}
        {pathname === "/community" && <ShareCompList user={user} />}
      </main>
    </>
  )
}
const Offline = styled.span`
  display:flex;
  align-items: center;
  margin: 0px 24px;
  h1{
    color:white;
    font-size: 16px;
  }
`
const LeftSideNavBar = styled.aside`
  height:calc(100vh - 52px - 10px);
  padding-top: 10px;
  min-width: auto;
  background-color: white;
  position: fixed;
  margin-top: 52px;
  z-index: 10;
`
const HvNav = styled.div`
  width:185px;
  display:flex;
  align-items: center;
  padding: 12px 24px;
  margin-top: 8px;
  cursor: pointer;
  @media screen and (max-width: 600px) {
    width:auto;
  }
`
const HvNavTitle = styled.h1`
  font-size: 16px;
  margin-left: 18px;
  color:#363636;
  @media screen and (max-width: 600px) {
    display:none;
  }
`
const HvLogo = styled.title`
  display:flex;
  margin-left: 24px;
  h1{
    color:white;
    font-size: 17px;
  }
  h2{
    font-size: 17px;
    color:#FC1010;
  }
  h3{
    font-size: 17px;
    color:#08B624;
    margin-left: 6px;
  }
`
const TopBar = styled.header`
  display:flex;
  background-color: #272727;
  height: 52px;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width:100%;
  z-index: 999;
`
const Profile = styled.img`
  width:30px;
  height:30px;
  border-radius: 10px;
  margin:0px 24px;
  cursor: pointer;
  background-color: #aaaaaa;
`

export default Home;