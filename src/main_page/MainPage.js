import { useNavigate  } from 'react-router-dom'
import './StartBtn.css';
import './../common_item/Background.css'
import './Title.css'

function MainPage() {
    const navigate = useNavigate();

    function handleClick(){
        navigate('/connect_page');
    }
    return (
        <div className="main-image">
            <button className="button-53" onClick={handleClick} role="button">Let's start</button>
            <h1 className="title-53">NO CODE NFT COLLECTION<br/>GENERATOR ON BTFS</h1>
        </div>
    );
}

export default MainPage;