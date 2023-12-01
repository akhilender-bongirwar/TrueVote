import React, { useContext, useEffect, useState } from 'react'
import Context from '../../constant/context'
import {Spin} from "antd"
import "./voter.css"
import { useNavigate } from 'react-router-dom'
function Voters() {
    const {details,dispatch}=useContext(Context)
    const [voters,setvoters]=useState([])
    const [isloading,setisloading]=useState(false);

    const navigate=useNavigate();
  
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
        try{
            const getvoters=async()=>{
                setisloading(true)
                const voterlist= await details.instance?.methods.totalRegisteredVoters().call({
                    from : details.account
                });
                // console.log(voterlist);
                var votersl=[];
                for(let i=0;i<voterlist.length;i++)
                {
                  const voter= await details.instance.methods.getVoterdetails(voterlist[i]).call({
                  from : details.account
                  });
                //   console.log(voter);
                  votersl.push({...voter,address:voterlist[i]})
                }
                setisloading(false)
                setvoters(votersl)
            }
            getvoters();
        }
        catch{
            alert("Some error occured");
        }
        return ()=>{
            console.log("");
        }
    },[])
    const verify=async(address)=>{
        try{
            setisloading(true)
            const authorized=await details.instance.methods.authorize(address).send({
                from:details.account,gas:1000000
            })
            setisloading(false)
            alert("User verified successfully")
            window.location.reload();
        }
        catch(err)
        {
            setisloading(false)
            console.log(err.message);
        }
    }
  return (
    <div className='voterspage'>
        <h1>Voters</h1>
        {isloading && <Spin size='large' className='spinner'/>}
    <div className='voters'>
    {voters && voters.map((voter,ind)=>(
        <div key={ind} className={voter.authorized? "voter greenColor":"voter redColor"}>
            <div className='voterdetails'> 
                <p className='votername'><span className='voterlabel'>VoterName:</span> {voter?.votername[0].toUpperCase()+voter?.votername.slice(1)}</p>
                <p><span className='voterlabel'>VoterAddress:</span> {voter?.address}</p>
                <p><span className='voterlabel'>Status:</span> {voter?.authorized? "Authorized" :"Not Authorized"}</p>
            </div>
            {!voter?.authorized && <button className='verifybtn' onClick={()=>{verify(voter?.address)}} disabled={isloading}>Verify</button>}
        </div>
    ))}
    </div>
    
    </div>
  )
}

export default Voters