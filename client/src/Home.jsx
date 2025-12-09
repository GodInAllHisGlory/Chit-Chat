import { Outlet, Link } from "react-router-dom";

function Home() {
    return(
        <div>
            <nav>
                <Link to={{
                    pathname:"/chat",
                    state: "kingkitkat"
                    }}
                    >Start Random Chat</Link>
            </nav>
            <Outlet />
        </div>
    )
}

export default Home;