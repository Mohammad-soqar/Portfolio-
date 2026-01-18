import '../css/toolIcon.css';
import { Link } from 'react-router-dom';

export function ToolIcon({ title, techStack }) {
    return (

        <div className="toolIcon">
                <img src={techStack} alt={title}  />
                <p>{title}</p>
            </div>
    );
}
