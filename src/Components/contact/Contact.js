import React, { useState } from 'react'
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [contectData, setContactData] = useState({
        name: '',
        message: '',
        email: ""
    })


    const sendEmail = () => {
        emailjs.send(process.env.REACT_APP_API_EMAILJS_SERVICE_ID, process.env.REACT_APP_API_EMAILJS_TEMPLATE_ID, contectData, process.env.REACT_APP_API_EMAILJS_PUBLIC_KEY)
            .then((response) => {
                console.log('SUCCESS!', response);
            }, (err) => {
                console.log('FAILED...', err);
            });
    }


    return (
        <div className='border border-red-500'>
            <h1 className=''>
                Contact
            </h1>
            <div className='flex flex-col '>
                <div>
                    <label>
                        <span>Your Name</span>
                        <input type='text' value={contectData.name} onChange={(e) => setContactData({ ...contectData, name: e.target.value })} />
                    </label>
                    <label>
                        <span>Your Email</span>
                        <input type='email' value={contectData.name} onChange={(e) => setContactData({ ...contectData, email: e.target.value })} />
                    </label>
                </div>
                <label>
                    <span>Message</span>
                    <textarea value={contectData.message} onChange={(e) => setContactData({ ...contectData, message: e.target.value })} cols="30" rows='10' className='resize-none' ></textarea>
                </label>
                <button onClick={() => sendEmail()}>Send </button>
            </div>



        </div>
    )
}

export default Contact