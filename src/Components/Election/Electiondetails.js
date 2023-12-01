import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../constant/context';
import { connect } from '../../constant/constants'
import { Spin } from 'antd';

function Electiondetails(props) {
    const { id }=useParams();
    const {details,dispatch}=useContext(Context)
    const [election,setelection]=useState({})
    const [candidates,setcandidates]=useState([])
    const [isloading,setisloading]=useState(false)
    const [vote,setvote]=useState("")
    const[flag,setflag]=useState(false);
    const navigate=useNavigate();
    const statusmap={"1":"Created","2":"Voting","3":"Ended"}

    useEffect(()=>{
      if(details.account==="" && details.isConnected===false)
      {
        navigate("/");
      }
      return ()=>{
        console.log("byeee");
      }
    },[])
 useEffect(()=>{
    const func=async()=>{
      setisloading(true)
        const elec= await details.instance.methods.getElection(id.slice(1)).call({
            from : details.account
        });
      setelection(elec)
      const candidates=elec.candidatesids;
        console.log(candidates);
        var res=[]
        for(let i of candidates)
        {
            const cand= await details.instance.methods.getCandidate(i).call({
              from : details.account
          });
            res.push(cand);
        }
      setcandidates(res);
      setisloading(false)
    }
    func();
    return ()=>{
        console.log("");
    }
 },[flag])
 const start=async()=>{
  try{
    setisloading(true)
    const status=await details.instance.methods.startVoting(election.id).send({
      from:details.account,gas: 1000000
    })
    console.log(status);
    setflag(!flag)
    alert("Voting started successfully!")
    setisloading(false)
  }
  catch(err)
  {
    setisloading(false)
    alert("Some error occured")
    console.log(err.message);
  }
 }
 const end=async()=>{
  try{
    console.log("Hello");
    setisloading(true)
    const status=await details.instance.methods.endElection(election.id).send({
      from:details.account,gas: 1000000
    })
    setflag(!flag)
    alert("Election ended successfully!")
    setisloading(false)
    console.log(status);
  }
  catch(err)
  {
    setisloading(false)
    alert("Some error occured")
    console.log(err.message);
  }
 }
 const givevote=async()=>{
  try{
    if(!vote)
    {
      alert("Please select a candidate")
    }
    console.log("Hello");
    setisloading(true)
    const status=await details.instance.methods.vote(details.account,vote,election.id).send({
      from:details.account,gas: 1000000
    })
    console.log(status);
    setisloading(false)
    alert("Voting casted successfully")
    navigate("/")
  }
  catch(err)
  {
    setisloading(false)
    console.log(err.message);
    alert("You can vote only once")
  }
 }
  return (
    <div className='electiondetailspage'>
      {isloading && <Spin size='large' className='spinner'/> }
      <div className='electiondetails'>
        <div className='elecdet'>
        <div>
        <p className='eleclabel'>ElectionID</p>
        <p className='elecval'>{election.id}</p>
        </div>
        <div>
          <p className='eleclabel'>Election Purpose</p>
        <p className='elecval'>{election.purpose}</p>
        </div>
        </div>
        <div>
          <p className='eleclabel'>Election Status</p>
          <p className='elecval'>{statusmap[election.status]}</p>
        </div>
      </div>
        <p className='eleclabel'>Total Election Votes</p>
        <p className='elecval'>{election.totalVotes}</p>
        <h3 className='eleclabel'>Candidates</h3>
        <div className='candidates'> 
        {candidates.length>0 ? candidates.map((candidate,ind)=>{
          return(
            <div key={ind} className='candidate'>
            {!details.isadmin && <input type="radio" name="candidate" id={candidate.id} className="radiobtn" onChange={(e)=>{setvote(e.target.id)}} required/>}
            <div className='candidatedetails'>
              <p className='candlabel'>CandidateName: <span className='candval'>{candidate.name}</span></p>
              <p className='candlabel'>CandidateID: <span className='candval'>{candidate.id}</span> </p>
              <p className='candlabel'>CandidateSlogan: <span className='candval'>{candidate.slogan}</span></p>
              <p className='candlabel'>VoteCount: <span className='candval'>{candidate.voteCount}</span></p>
            </div>
          </div>
          )
        }):(<p>No candidates yet! You need to add atleast two candidates to start the election.</p>)}
        </div>
        {(details.isadmin && election.status!="3" && candidates.length>0)?(<div className='btndiv'>
          {election.status==="1" && <button onClick={()=>{start()}} className='startbtn' disabled={isloading}>Start Election</button>}
        <button onClick={()=>{end()}} className='endbtn' disabled={isloading}>End Election</button>
        </div> 
       ):(!details.isadmin && <div className='btndiv'>
        <button onClick={()=>{givevote()}} disabled={isloading} className='votebtn'>Vote</button>
       </div>)}
       
    </div>
  )
}

export default Electiondetails