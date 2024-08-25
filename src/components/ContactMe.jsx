import React from 'react';
import '../css/Contact.css';
import { data } from './sidepanelData';
import { MyForm } from '../components/MyForm';
import { Link } from 'react-router-dom';

export function ContactMe() {

    return (
        <section className='ContactMe-Section'>
            <MyForm/>
              <ul className="social-link-Contact">
                    {data.socialData.map((element, index) => (
                        element.link ? (
                            <a href={element.link} className="hover-effect" target="_blank" rel="noopener noreferrer">
                                <li key={index}>

                                    <img src={element.icon_big} />

                                </li>
                            </a>
                        ) : null
                    ))}
                </ul>
            <p className='gradient-text Contact-Me'>Want to know more about me, tell me about your project or just to 
                say hello? <a>Drop me a line</a> and I'll get back as soon as possible.</p>
                <hr />
                <div className='contact-info'>
                    <div className='contact'>
                        <h5>Location</h5>
                        <p>{data.aboutMe.personalInfo.location}</p>
                    </div>
                    <div className='contact'>
                        <h5>Phone</h5>
                        <p>{data.aboutMe.personalInfo.phone}</p>
                    </div>
                    <div className='contact'>
                        <h5>Email</h5>
                        <p>{data.aboutMe.personalInfo.email}</p>
                    </div>
                </div>
        </section>
    );
}
