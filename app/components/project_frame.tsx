import Iframe from 'react-iframe'
import 'app/styles/projectFrame.css'

export default function ProjectFrame(){
    return (
    <div className="project-container">
        <Iframe 
            // url={url != "" ? url : 'https://dotbigbang.com/game'}
            url='https://dotbigbang.com/game/53a1410aa45d4e45927b2dc0d9f05e85/blitz-attack-1.1'
            width="100%"
            height="100%"
        />
    </div>
    )
}