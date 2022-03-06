import React, { useState } from 'react';
import App from "./App";
import Galary from "./viewPic";



export default function MainApp() {

  const [toggle, setToggle] = useState(false);
  const toggleChecked = () => setToggle(toggle => !toggle);

  const propFunction = (toggle) => {
    setToggle(toggle);
  }

  
  return (
     <div>
        {toggle && <App  propFunction={propFunction} /> }
        {!toggle && <Galary  propFunction={propFunction}  /> }
     </div>
  );
}