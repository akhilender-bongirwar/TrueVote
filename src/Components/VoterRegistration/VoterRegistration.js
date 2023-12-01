import React, { useContext, useEffect, useState } from 'react'
import { Button,Form, Input,Modal, Spin} from 'antd';
import Context from '../../constant/context';
import "./votereg.css"
import { useNavigate } from 'react-router-dom';

function VoterRegistration() {
    const {details,dispatch}=useContext(Context)
    const [isModalOpen,setisModalOpen]=useState(false);
    const [isloading,setisloading]=useState(false);
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
            if(details.isadmin)
            {
                alert("Admin cannot register a voter!!");
                return;
            }
            setisloading(true)
          const result= await details.instance.methods.addVoter(details.account,values.votername).send({
            from : details.account,gas:1000000
          });
          setisloading(false)
          dispatch({
            type:"register"
          })
          setisModalOpen(true);
          form.resetFields();
          console.log(result);
        }
        catch{
            alert("You can register only once!");
        }
    };
    const onCancel=()=>{
      setisModalOpen(false)
      navigate("/")
    }
  return (
    <div className='voterregpage'>
        {isloading && <Spin size='large' className='spinner'/>}
         <Modal 
         open={isModalOpen}
          destroyOnClose={true}
          closable={true}
          onCancel={() => onCancel()}
          footer={null}
          className='resultmodal'>
            <p>You are registered as voter successfully.</p>
              <p className='resb'>You can vote once the admin verifies your request.</p>   
      </Modal>
       <div className='voterregimg'>
        <img src="/images/photo7.jpg" alt="" />
      </div>
      <div className='voterregdiv'>
      <h1>VoterRegistration</h1>
        <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
         >
        <Form.Item
        label="VoterName"
        name="votername"
        rules={[{ required: true, message: 'Please enter the votername.' }]}
        className='formlabel'
         >
        <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" disabled={isloading}>
            Submit
        </Button>
        </Form.Item>
        </Form>
      </div>
       
    </div>

  )
}

export default VoterRegistration