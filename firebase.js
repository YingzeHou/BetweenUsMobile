// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { getAnalytics } from "firebase/analytics";
import {API_KEY, AUTH_DOMAIN, PROJ_ID, STORAGE_BUCKET, MSG_SENDER_ID, APP_ID, MEASUREMENT_ID} from "@env"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJ_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MSG_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID
};

let app;

if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}
else{
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth()
const storage = firebase.storage().ref();

export {db, auth, storage};
