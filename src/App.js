import Home from './Components/Home/Home';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import './App.css';
import { useEffect, useLayoutEffect, useReducer, useState } from 'react';
import Context from './constant/context';
import ABI from "./constant/ABI.json";
import AddCandidate from './Components/AddCandidate/AddCandidate';
import Result from './Components/Result/Result';
import Cookies from "js-cookie";
import { CONTRACT_ADDRESS,connect } from './constant/constants';
import Navbar from './Components/Navbar/Navbar';
import { reducer,initialState } from './constant/reducer';
import Election from './Components/Election/Election';
import VoterRegistration from './Components/VoterRegistration/VoterRegistration';
import Electiondetails from './Components/Election/Electiondetails';
import Voters from './Components/Voters/Voters';
import Vote from './Components/Vote/Vote';
function App(){
  const [details, dispatch] = useReducer(reducer,initialState);
  // const [flag,setflag]=useState(false)
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    }
    else if(!window.ethereum){
      alert("You need to have a metamask provider")
    }
  },[]);
  return (
   <>
   <Context.Provider value={{details,dispatch}}>
   <Router>
    <Navbar></Navbar>
    <Routes>
      <Route exact path="/" element={<Home/>}></Route>
      <Route exact path="/Election/:id" element={<Electiondetails/>}/> 
      <Route exact path="/Election" element={<Election/>}></Route> 
      <Route exact path="/AddCandidate" element={<AddCandidate/>}></Route> 
      <Route exact path="/Result" element={<Result/>}></Route> 
      <Route exact path="/Registration" element={<VoterRegistration/>}></Route>
      <Route exact path="/Voters" element={<Voters/>}></Route> 
      <Route exact path="/Voting" element={<Vote/>}></Route> 
    </Routes>
   </Router>
   </Context.Provider>
   </>
  );
}

export default App;
