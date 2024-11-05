import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB4WpaKFplaUts6qW0C_N-ONd-KpVqy0bw",
    authDomain: "hethonghangxedulich.firebaseapp.com",
    databaseURL: "https://hethonghangxedulich-default-rtdb.firebaseio.com",
    projectId: "hethonghangxedulich",
    storageBucket: "hethonghangxedulich.appspot.com",
    messagingSenderId: "819503679867",
    appId: "1:819503679867:web:72f842f9401702d75ed5de"
  };

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const auth = app.auth();

export { auth, firebase };