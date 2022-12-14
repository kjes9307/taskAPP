import React from 'react';
import './App.scss';
import {UnAuthScreen} from "unauth"
import { useAuth } from 'context/userContext';
import {Main} from "auth";
import {library} from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

function App() {
  // 若需要user 資訊則從useAuth 取得
  const {user} = useAuth()
  return (
    <div className="App">
      {user? <Main /> :<UnAuthScreen />}
    </div>
  );
}

export default App;
