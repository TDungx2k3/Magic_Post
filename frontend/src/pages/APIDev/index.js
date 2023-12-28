import clsx from "clsx";
import style from "./APIDev.module.scss";

function APIDev() {
    return (
        <div className={clsx(style.container)}>
            <header>
                <h1>Introducing the technologies</h1>
            </header>

            <div className={clsx(style.info)}>
                <h2>Frontend Framework: React.js</h2>
                <p>
                ReactJS is an open source JavaScript library designed by Facebook to create engaging, fast, and efficient web applications with minimal coding. The core purpose of ReactJS is not only to make the website smooth but also fast, highly scalable and simple.
                </p>
                <p>
                Its power comes from its focus on individual ingredients. Therefore, instead of working on the entire web application, ReactJS allows a developer to break down complex user interfaces into simpler components.
                </p>
            </div>

            <div className={clsx(style.info)}>
                <h2>Backend Framework: Node.js with Express</h2>
                <p>
                NodeJS is a platform built on “V8 Javascript engine” written in c++ and Javascript. This platform was developed by Ryan Lienhart Dahl in 2009.
                </p>
                <p>
                Node.js was born when early JavaScript developers expanded it from something you could just run in the browser to something you could run on your machine as a standalone application.
                </p>
            </div>

            <div className={clsx(style.info)}>
                <h2>Database: MySQL</h2>
                <p>
                MySQL is an open source relational database management system (RDBMS) designed to store, retrieve, and manage data in applications and information systems. It uses the SQL query language to interact with databases and provides high performance, stability, and security, making it a popular choice for enterprise, web applications. and software projects.
                </p>
            </div>
        </div>
    )
}

export default APIDev;
