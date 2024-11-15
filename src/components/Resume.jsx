import React from 'react';
import '../css/Resume.css';
import { data } from './sidepanelData';
import { Table } from './table';
import { ToolIcon } from './toolIcon';
import { Link } from 'react-router-dom';

export function Resume() {

    const tableRowEdu = [
        {
            title: "Software Engineering",
            subTitle: (
                <>
                    At <a href="https://uskudar.edu.tr/" target="_blank" rel="noopener noreferrer">Uskudar University</a>
                </>
            ),
            description: "Bachelor's degree program focused on software development and systems design.",
            yearRange: "2020-2024"
        },
        {
            title: "Flutter & Dart",
            subTitle: (
                <>
                    Course by <a href="https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps" target="_blank" rel="noopener noreferrer">Academind</a>
                </>
            ),
            description: "Learned to build cross-platform mobile apps using Flutter and Dart.",
            yearRange: "-"
        },
        {
            title: "Machine Learning (AI)",
            subTitle: (
                <>
                    Course by <a href="https://www.udemy.com/course/machinelearning/" target="_blank" rel="noopener noreferrer">SuperDataScience</a>
                </>
            ),
            description: "Studied machine learning algorithms and AI models.",
            yearRange: "-"
        },
        {
            title: "Asp.NET MVC",
            subTitle: (
                <>
                    Course by <a href="https://www.udemy.com/course/complete-aspnet-core-21-course/" target="_blank" rel="noopener noreferrer">Bhrugen Patel</a>
                </>
            ),
            description: "Learned to develop web applications using ASP.NET MVC.",
            yearRange: "-"
        },
    ];
    const tableRowExp = [
        {
            title: "Software Engineer (Intern)",
            subTitle: (
                <>
                    At <strong>ZOOM Property</strong>
                </>
            ),
            description: "Led the full development lifecycle of the web application and CRM system, focusing on functionality and user experience.",
            yearRange: (
                <>
                    CRM System + Web App <br />AUG-NOV 2023
                </>
            ),
        },
        {
            title: "Software Engineer (Freelance)",
            subTitle: (
                <>
                    To <strong>ZOOM Dental</strong>
                </>
            ),
            description: "Developed a fully responsive website tailored to the client’s needs, enhancing online presence.",
            yearRange: (
                <>
                    Website <br />JAN 2024
                </>
            ),
        },
        {
            title: "UI/UX Designer (Freelance)",
            subTitle: (
                <>
                    To <strong>Reson8</strong>
                </>
            ),
            description: "Crafted user-centric web designs that significantly improved usability and aesthetics.",
            yearRange: (
                <>
                    Web Design <br />May 2024
                </>
            ),
        }
    ];
    const tools = [
        { title: "Flutter", picture: data.Images.flutter2 },
        { title: "Google Cloud", picture: data.Images.Google_cloud2 },
        { title: "Dart", picture: data.Images.dart2 },    
        { title: "React", picture: data.Images.react2 },
        { title: "Node.js", picture: data.Images.nodejs },
        { title: "ASP.NET", picture: data.Images.aspnet2 },
        { title: "Firebase", picture: data.Images.firebase2 },
        { title: "MongoDB", picture: data.Images.mongodb },
        { title: "Python", picture: data.Images.python2 },
        { title: "ChatGPT", picture: data.Images.chatgpt },
        { title: "Figma", picture: data.Images.figma2 },
    ];

    return (
        <section id="resume" className='resume' >
            <div className="section-tag ">
                <img src={data.Images.star} alt="Star" />
                <p>Resume!</p>
            </div>
            <div className='resume-content'>
                <h2 className='catchy-phrase gradient-text'>Education and practical experience</h2>
                <p className='resume-description'>Code what you intend to create—or, to put it simply—never let the logic you write behave in a way that doesn't match what you designed it to do.</p>
                <div className='tables'>
                    <div>
                        <h3 className='table-title'>My Education:</h3>
                        <div className='table'>
                            {tableRowEdu.map((row, index) => (
                                <Table
                                    key={index}
                                    title={row.title}
                                    subTitle={row.subTitle}
                                    description={row.description}
                                    yearRange={row.yearRange}
                                />
                            ))}
                        <hr />

                        </div>

                    </div>

                    <div>
                        <h3 className='table-title'>Work Experince:</h3>
                        <div className='table'>
                            {tableRowExp.map((row, index) => (
                                <Table
                                    key={index}
                                    title={row.title}
                                    subTitle={row.subTitle}
                                    description={row.description}
                                    yearRange={row.yearRange}
                                />
                            ))}
                        <hr />

                        </div>

                    </div>
                </div>

                <div>
                    <h3 className='table-title'>Favorite Tools:</h3>

                    <div className="toolList">
                        {tools.map((tool, index) => (
                            <ToolIcon
                                key={index}
                                title={tool.title}
                                techStack={tool.picture}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
