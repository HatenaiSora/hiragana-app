import firebase from 'firebase';
const config = {
  apiKey: 'AIzaSyCuBuaYnIap5NMUPIusKoNIpPPCTjtDM9w',
  authDomain: 'hiragana-app-72dda.firebaseapp.com',
  databaseURL: 'https://hiragana-app-72dda.firebaseio.com',
  projectId: 'hiragana-app-72dda',
  storageBucket: 'hiragana-app-72dda.appspot.com',
  messagingSenderId: '406688854480',
  appId: '1:406688854480:web:54d53b835be79242'
};
firebase.initializeApp(config);
const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export { db };
export default firebase;
