import { IUser } from '../types';
import firebase from './config'
import { API } from "aws-amplify";
import { createUser, updateUser } from '../graphql/mutations';
import { getUser } from '../graphql/queries';

export const loginGoogle = (): void => {
  if (!navigator.onLine) {
    alert("오프라인 상태입니다.");
    return;
  };
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      const provider = new firebase.auth.GoogleAuthProvider();
      return firebase.auth().signInWithPopup(provider);
    }).catch((error) => {
      alert('로그인 실패\n' + error.message)
    }).then(async (result: any) => {
      var credential = result.credential;
      var token = credential.accessToken;
      // sessionStorage.setItem("token", JSON.stringify(token));

      const { displayName, photoURL, uid } = result.user;
      sessionStorage.setItem("token", JSON.stringify(result.user.getIdToken()))
      if (displayName && photoURL) {
        const joinId = displayName + uid.substr(0, 6);
        const userData: IUser = { img: photoURL, name: displayName, id: uid, joinId, friends: [] };
        localStorage.setItem("user", JSON.stringify(userData));
        const isUserInDb = await API.graphql({
          query: getUser,
          variables: { id: userData.id }
        }) as { data: { getUser: IUser | null } };
        const resultData = isUserInDb.data.getUser;
        if (!resultData) {
          await API.graphql({
            query: createUser,
            variables: {
              input: {
                img: userData.img,
                name: userData.name,
                id: userData.id,
                joinId: userData.joinId,
                friends: []
              }
            }
          });
        } else {
          if (resultData.friends) {
            await API.graphql({
              query: updateUser,
              variables: {
                input: {
                  img: userData.img,
                  name: userData.name,
                  id: userData.id,
                  joinId: userData.joinId
                }
              }
            });
          } else {
            await API.graphql({
              query: updateUser,
              variables: {
                input: {
                  img: userData.img,
                  name: userData.name,
                  id: userData.id,
                  joinId: userData.joinId,
                  friends: []
                }
              }
            });
          }
        }
        alert('로그인 완료');
      }
      window.location.reload();
    }).catch((error) => {
      alert('로그인 실패\n' + error.message);
    });
}

export const logout = (): void => {
  if (window.confirm('로그아웃 하겠습니까?')) {
    if (!navigator.onLine) {
      alert("오프라인 상태입니다.");
      return;
    };
    firebase.auth().signOut().then(() => {
      localStorage.removeItem('user');
      sessionStorage.clear();
      alert('로그아웃 완료');
      window.location.reload();
    }).catch(() => {
      alert('로그아웃 실패');
    });
  }
}

export const getCurrentUser = (): IUser | null => {
  const { currentUser } = firebase.auth();

  if (currentUser) {
    const { displayName, photoURL, uid } = currentUser;
    if (displayName && photoURL) {
      const joinId = displayName + uid.substr(0, 6);
      const userData: IUser = { img: photoURL, name: displayName, id: uid, joinId };
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    }
    return null;
  }
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const { displayName, photoURL, uid } = user;
      if (displayName && photoURL) {
        const joinId = displayName + uid.substr(0, 6);
        const userData: IUser = { img: photoURL, name: displayName, id: uid, joinId };
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }
    }
  });
  return JSON.parse(localStorage.getItem("user") || JSON.stringify(null));
}