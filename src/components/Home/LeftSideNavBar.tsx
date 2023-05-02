import styled from 'styled-components'
import { ReactComponent as SvgGoogleIcon } from '../../icons/googleIcon.svg';
import { loginGoogle, logout } from "../../firebase/auth";
import { IUser } from '../../types';

const LeftSideNavBar = ({ user }: { user: IUser | null }) => {
  return (
    <Container>
      {
        user
          ? <Profile>
            <ProfileImg onClick={() => { logout() }} src={String(user.img)} />
            <ProfileName onClick={() => { logout() }}>{user.name}</ProfileName>
          </Profile>
          : <Profile>
            <SvgGoogleIcon onClick={() => { loginGoogle() }} width={32} height={32} style={{ marginRight: 12 }} />
            <ProfileName onClick={() => { loginGoogle() }}>구글 로그인</ProfileName>
          </Profile>
      }
    </Container>
  )
}

const Container = styled.div`
  min-height:100vh;
  min-width: auto;
  background-color: white;
  @media screen and (max-width: 600px) {
    min-width: 100vw;
    min-height:auto;
  }
`
const Profile = styled.div`
  width:186px;
  display:flex;
  align-items: center;
  padding: 22px;
  margin-bottom: 24px;
  margin-top: 12px;
  @media screen and (max-width: 600px) {
    padding: 0px;
    margin-top: 20px;
    margin-bottom: 20px;
    width:auto;
    padding-left: 30px;
  }
`
const ProfileImg = styled.img`
  width:32px;
  height:32px;
  border-radius: 200px;
  margin-right: 12px;
  cursor: pointer;
`
const ProfileName = styled.h1`
  font-size: 18px;
  display:flex;
  word-break:break-all;
  cursor: pointer;
`

export default LeftSideNavBar;
