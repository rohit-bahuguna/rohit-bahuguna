import React, { useState } from 'react'
import emailjs from '@emailjs/browser';
import contactSVG from '../../Images/contact.svg'
import { initialErrors, validateContact } from '../../utils/contactValidation';
import toast, { Toaster } from 'react-hot-toast';
const Contact = () => {
    const [contectData, setContactData] = useState({
        name: '',
        message: '',
        email: ""
    })
    const [error, setError] = useState(initialErrors)
    const [loading, setLoading] = useState(false)

    const sendEmail = () => {

        const { success, newErrors } = validateContact(contectData)
        if (success) {
            setLoading(true)
            emailjs.send(process.env.REACT_APP_API_EMAILJS_SERVICE_ID, process.env.REACT_APP_API_EMAILJS_TEMPLATE_ID, contectData, process.env.REACT_APP_API_EMAILJS_PUBLIC_KEY)
                .then((response) => {

                    toast.success('Message sent Successfully')
                    setLoading(false)
                    setContactData({
                        name: '',
                        message: '',
                        email: ""
                    })
                }, (err) => {
                    toast.success('Message sent Successfully')
                    setLoading(false)
                });

        } else {
            setError({ ...error, ...newErrors })
        }

    }

    const getContactData = (e) => {
        setError(initialErrors)
        setContactData({ ...contectData, [e.target.name]: e.target.value })
    }


    return (
        <div className='sm:mx-10 mx-2 mb-3 ' id='contact'>
            <Toaster
                position='top center'
            />
            <h1 className='text-[8vw] sm:text-4xl text font-semibold text-center uppercase'>
                Contact
            </h1>
            <div className='flex items-center justify-evenly w-full gap-10'>
                <div className='lg:w-[50%] md:w-[90%] w-screen flex gap-5  flex-col '>
                    <div className='flex sm:flex-row flex-col justify-between gap-5 w-full items-center'>
                        <label className='flex flex-col sm:w-1/2 w-full  h-24 '>
                            <span className='text-indigo-700 text-xl mb-1'>Your Name <span className='text-red-500'>*</span></span>
                            <input
                                type='text'
                                name='name'
                                className='border border-gray-500 px-2 py-2 rounded outline-indigo-700 text-lg '
                                placeholder='Enter Your Name'
                                value={contectData.name} onChange={getContactData} />
                            {error.nameError.status && <span className='text-red-500'>{error.nameError.error}</span>}
                        </label>
                        <label className="flex flex-col sm:w-1/2 w-full h-24 ">
                            <span className='text-indigo-700 text-xl mb-1'>Your Email <span className='text-red-500'>*</span></span>
                            <input type='email'
                                name='email'
                                className='border border-gray-500 px-2 py-2 rounded outline-indigo-700 text-lg '
                                placeholder='Enter Your Email' value={contectData.email} onChange={getContactData} />
                            {error.emailError.status && <span className='text-red-500'>{error.emailError.error}</span>}
                        </label>
                    </div>
                    <label className='flex flex-col self-center w-full '>
                        <span className='text-indigo-700 text-xl mb-1'>Message <span className='text-red-500'>*</span></span>
                        <textarea name='message' value={contectData.message} onChange={getContactData} rows='7' className='resize-none border border-gray-500 px-3 py-2 rounded-xl  outline-indigo-700 text-lg' ></textarea>
                        {error.messageError.status && <span className='text-red-500'>{error.messageError.error}</span>}
                    </label>
                    <button onClick={() => sendEmail()}
                        className='text-indigo-700 border-indigo-700 border  py-2 hover:bg-indigo-200 text-lg rounded-full disabled:bg-gray-200'
                        disabled={loading}
                    >
                        {loading ? "Sending Your Message" : "Send"}
                    </button>
                </div>
                <img src={contactSVG} className='w-[30%] hidden lg:block ' />

            </div>

        </div>
    )
}

export default Contact