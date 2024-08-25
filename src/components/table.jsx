import React from 'react';
import '../css/table.css';
import { Link } from 'react-router-dom';

export function Table({ title, subTitle, description, yearRange }) {
    return (

        <div className="table-row">
            <hr />
            <div className='row'>
                <span className='col-20'>{yearRange}</span>
                <div className='col-40'>
                    <h4>{title}</h4>
                    <p >{subTitle}</p>
                </div>
                <p className='col-40 description'>{description}</p>
            </div>
        </div>
    );
}
