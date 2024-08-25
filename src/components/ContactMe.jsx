import React from 'react';
import '../css/Contact.css';
import { data } from './sidepanelData';
import { Link } from 'react-router-dom';

export function ContactMe() {

    return (
        <section className='ContactMe-Section'>

        <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSccwZVcDmcA5ly9_TmWd9jMcBMcDGNbmj5LbhJGc65AuuaNKA/viewform?embedded=true" width="640" height="800" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>


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
