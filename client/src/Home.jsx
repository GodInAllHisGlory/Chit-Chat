import { Outlet, Link } from "react-router-dom";

function Home() {
    return(
        <div>
            <nav>
                <Link to="/chat">Start Random Chat</Link>
            </nav>
            <Outlet />
        </div>
    )
}

export default Home;