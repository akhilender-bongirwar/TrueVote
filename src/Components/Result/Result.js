import React, { useContext, useEffect, useState } from 'react'
import Context from '../../constant/context';
import { Modal, Spin } from "antd";
import "./result.css"
import { useNavigate } from 'react-router-dom';

function Result(){
    const {details,dispatch}=useContext(Context);
    const [elections,setelections]=useState([]);
    const [result,setresult]=useState([]);
    const [isModalOpen,setisModalopen]=useState(false)
    const [isloading,setisloading]=useState(false)

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
            const getelec=async()=>{
                setisloading(true)
                const n= await details?.instance?.methods.noOfElections().call();
                console.log(n);
                var elec=[];
                for(let i=1;i<=n;i++)
                {
                   const {id,purpose,candidatesids,status,totalVotes}= await details?.instance?.methods.getElection(i).call({
                    from : details.account
                   });
                    console.log({id,purpose,candidatesids,status,totalVotes});
                    if(status==="3"){
                    elec.push({id,purpose,candidatesids,status,totalVotes})
                    }
                }
                setisloading(false);
                setelections(elec)
                console.log(elec);
            }
            getelec();
            console.log(elections);
        }
        catch(err){
            alert(err.message)
            // alert("Some error occured");
        }
        return ()=>{
            console.log("");
        }
      },[])
      const ondelete=async(ind)=>{
        try{
          setisloading(true)
          const cand= await details.instance.methods.deleteElection(ind).send({
            from : details.account, gas:1000000
        });
        setisloading(false)
        alert("Election deleted successfully!")
        window.location.reload()
        }
        catch(err)
        {
          setisloading(false)
          alert("Some error occured!")
        }

      }
      const onSubmit=async(ind)=>{
        setisloading(true)
        const candidates=elections[ind]?.candidatesids;
        var res=[]
        for(let i of candidates)
        {
            const cand= await details.instance.methods.getCandidate(i).call({
                from : details.account
            });
            res.push([cand.voteCount,cand]);
        }
        setisloading(false)
        res.sort()
        res.reverse()
        // console.log(res);
        const maxvote=res[0][0]
        var resu=[]
        for(let[vote,cand] of res)
        {
            if(vote===maxvote)
            {
                console.log(vote,cand);
                resu.push(cand)                
            }
        }
        // console.log(resu);
        setresult(resu);
        setisModalopen(true)
    }
  return (
    <div className='resultpage'>
       
         <Modal 
         open={isModalOpen}
          destroyOnClose={true}
          closable={true}
          onCancel={() => setisModalopen(false)}
          footer={null}
          className='resultmodal'>
            <div className='resmodaldiv'>
            <h2 className='resb'>Result</h2>
         {result?.length>1&& <p>There is a <b>DRAW</b> between the following candidates with each getting {result[0]?.voteCount} votes.</p>}  
            <div>
            {result?.length>1 ?result.map((cand,ind)=>(
                <p className="resb" key={ind}>{cand.id} {cand.name}</p>
            )):
            (result?.length===1 && 
                    <p>The winner is <b className='resb'>{result[0]?.name}</b> with votes <b className='resb'>{result[0]?.voteCount}</b></p>
            )}
            </div>
         </div>   
      </Modal>
        <h1>Results</h1>
        {isloading && <Spin size='large' className='spinner'/>}
        <div className='elecdiv'>
        {elections.length>0? elections.map((election,ind)=>(
            <div key={ind} className='elecresult'>
                <div>
                <p><b>ElectionID:</b> {election?.id}</p>
                <p><b>ElectionPurpose:</b> {election?.purpose}</p>
                <p><b>ElectionStatus:</b> {election?.status}</p>
                <p><b>TotalVotes:</b> {election?.totalVotes}</p>
                </div>  
                <div className='btndivv'>
                <button onClick={()=>{onSubmit(ind)}} className="resultbtn" disabled={isloading}>Result</button>
                {details.isadmin && <button onClick={()=>{ondelete(election.id)}} className="resultbtn" disabled={isloading}>DeleteElection</button>}
                </div>
            </div>
        )):( <p className='noelection'>No results yet!</p>)}
        </div>
        
          
    </div>
  )
}

export default Result