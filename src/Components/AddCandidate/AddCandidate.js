import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Input, Spin } from 'antd';
import Context from '../../constant/context';
import "./addcandidate.css";
import { useNavigate } from 'react-router-dom';

function AddCandidate() {
    const {details,dispatch}=useContext(Context)
    const[name,setname]=useState("");
    const[slogan,setslogan]=useState("");
    const[electionid,setelectionid]=useState("");
    const [isloading,setisloading]=useState(false)
    const [disabled,setdisabled]=useState(false)
    const [form] = Form.useForm();
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
    const onFinish = async(values)=> {
        try{
          setisloading(true)
          console.log(name,slogan,electionid);
            if(!details.isadmin)
            {
                alert("Only admin can create candidates!!");
                return;
            }
          const result= await details.instance.methods.addCandidate(name,slogan,electionid).send({
            from : details.account,gas: 1000000
          });
          // console.log(result);
          setisloading(false)
          alert("Candidate Added Successfully")
          form.resetFields();
        }
        catch(err){
          console.log(err);
            alert("Some error Occured.Check your ElectionID!");
          setisloading(false)
        }
    };
  return (
    <div className='addcandidatepage'>
      {isloading && <Spin size='large' className='spinner'/> }
      <div className='addcandidate'>
      <h1>Add Candidate</h1>
        <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        className='formm'
         >
        <Form.Item
        label="Candidate's Name"
        name="name"
        rules={[{ required: true, message: "Please enter the Candidate's Name" }]}
         >
        <Input onChange={(e)=>{setname(e.target.value)}} />
        </Form.Item>
        <Form.Item
        label="Candidate's Slogan"
        name="slogan"
        rules={[{ required: true, message: "Please enter the Candidate's Slogan" }]}
         >
        <Input onChange={(e)=>{setslogan(e.target.value)}}/>
        </Form.Item>

        <Form.Item
        label="ElectionID"
        name="electionID"
        rules={[{ required: true, message: 'Please enter the ElectionID' }]}
         >
        <Input onChange={(e)=>{setelectionid(e.target.value)}}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" disabled={isloading}>
            Submit
        </Button>
        </Form.Item>
        </Form>
      </div>
      <div className='addcandidateimg'>
        <img src="/images/photo8.jpg" alt="" />
      </div>
        
    </div>
  )
}

export default AddCandidate