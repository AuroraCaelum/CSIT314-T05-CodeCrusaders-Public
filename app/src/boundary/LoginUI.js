import logo from './../logo.svg';
import './LoginUI.css';

function LoginUI() {
    return (
        <div className="LoginUI">
            <header className="LoginUI-header">
                <img src={logo} className="LoginUI-logo" alt="logo" />
                <p>
                    Edit <code>src/boundary/LoginUI.js</code> and save to reload.
                </p>
                <a
                    className="LoginUI-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default LoginUI;
