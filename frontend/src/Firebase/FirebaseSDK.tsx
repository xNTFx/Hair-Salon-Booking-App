// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDkCkigQ6D2zfAq_UP8j2E53Jj0tI1VOJg',
  authDomain: 'hairdresser-site-isi.firebaseapp.com',
  projectId: 'hairdresser-site-isi',
  storageBucket: 'hairdresser-site-isi.appspot.com',
  messagingSenderId: '51858955730',
  appId: '1:51858955730:web:d5478fd6bf7e6c0abebc0b',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
