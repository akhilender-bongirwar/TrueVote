import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Input,Spin,Tabs } from 'antd';
import Context from '../../constant/context';
import "./election.css";
import { NavLink, redirect, useNavigate } from 'react-router-dom';

function Election() {
    const {details,dispatch}=useContext(Context)
    const [elections,setelections]=useState([])
    const [electioncount,setelectioncount]=useState(0)
    const[ongoelec,setongoingelec]=useState([])
    const [isloading,setisloading]=useState(false)
    const statusmap={"1":"Created","2":"Voting","3":"Ended"}
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
            const n= await details.instance?.methods.noOfElections().call();
            console.log(n);
            setelectioncount(n);
            var elec=[];
            var ongoingelec=[];
            for(let i=1;i<=n;i++)
            {
              const {id,purpose,candidatesids,status,totalVotes}= await details.instance.methods.getElection(i).call({
              from : details.account
              });
              console.log({id,purpose,candidatesids,status,totalVotes});
              if(purpose!=="")
              {
                console.log("hello");
                elec.push({id,purpose,candidatesids,status,totalVotes})
                if(status!=="" && status!=="3")
                {
                  ongoingelec.push({id,purpose,candidatesids,status,totalVotes})
                }
              }
            }
            setelections(elec)
            setongoingelec(ongoingelec)
            console.log(elec);
        }
        getelec();
    }
    catch{
        alert("Some error occured");
    }
    return ()=>{
        console.log("");
    }
  },[elections]);

  const onChange=async()=>
  {
    const {id,purpose,candidatesids,status,totalVotes}= await details.instance.methods.getElection(electioncount+1).call({
        from : details.account
      });
      setelectioncount(electioncount+1)
    setelections([...elections,{id,purpose,candidatesids,status,totalVotes}])
    setongoingelec([...ongoelec,{id,purpose,candidatesids,status,totalVotes}])
  }
  console.log("elections",elections,ongoelec);
  const onFinish = async(values)=> {
    try{
        if(!details.isadmin)
        {
            alert("Only admin can create Election!!");
            return;
        }
        setisloading(true)
        for(let i=0;i<ongoelec.length;i++)
        {
          if(ongoelec[i].purpose.toLowerCase()===values.purpose.toLowerCase())
          {
            alert("This election is already created")
            setisloading(false)
            return;
          }
        }
      const result= await details.instance.methods.createElection(values.purpose).send({
        from : details.account,gas:1000000
      });
      await onChange();
      setisloading(false)
      console.log(result);
    //   setelectioncount(electioncount+1)
    }
    catch{
      setisloading(false);
      redirect('/');
      alert("Election Successfully Created");
    }
};
const electionfunc=()=>(
  <div className='electiondiv'>
    {elections && elections.map((election,ind)=>(
        <NavLink to={`/Election/:${election.id}`}>
        <div key={ind} className="election">
        <p className='electionpurpose'><span className='electionid'>{election.id}.</span>{election.purpose}</p>
            <ins>{statusmap[election.status]}</ins>
        </div>
        </NavLink> 
    ))}
    </div>
)

const ongoelecfunc=()=>(
    <div className='electiondiv'>
      {ongoelec && ongoelec.map((election,ind)=>(
          <NavLink to={`/Election/:${election.id}`}>
          <div key={ind} className="election">
              <p className='electionpurpose'><span className='electionid'>{election.id}.</span>{election.purpose}</p>
              <ins>{statusmap[election.status]}</ins>
          </div>
          </NavLink> 
      ))}
      </div>
)
const items = [
  {
    key: '1',
    label: `ALL ELECTIONS`,
    children: electionfunc(),
  },
  {
    key: '2',
    label: `ONGOING ELECTIONS`,
    children: ongoelecfunc(),
  }
];
  return (
    <div className='electionspage'>
      {isloading && <Spin size='large' className='spinner'/> }
      <div className='createelection'>
      <h1>
            Create Election
        </h1>
        <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
         >
        <Form.Item
        label={<span style={{ fontSize: '18px', }}>Purpose</span>}
        name="purpose"
        rules={[{ required: true, message: 'Please enter the purpose of conducting Election!!' }]}
         >
        <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
            Submit
        </Button>
        </Form.Item>
        </Form>
      </div>
        <Tabs defaultActiveKey="1"  tabBarStyle={{display:'flex',justifyContent:"space-between",padding:"10px 0px 10px 20px"}}items={items}/>; 
    </div>
  )
}

export default Election;
