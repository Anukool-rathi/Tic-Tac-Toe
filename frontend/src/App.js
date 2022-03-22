import JoinRoom from "./components/JoinRoom";

function App(){
    const AppContainerStyle = {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1em"
    }

    const WelcomeTextStyle = {
        margin: "0",
        color: "#8e44ad"
    }

    const MainContainerStyle = {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
    return (
        <div className="AppContainer" style={AppContainerStyle}>
            <h1 className="WelcomeText" style={WelcomeTextStyle}>Welcome to Tic-Tac-Toe</h1>
            <div className="MainContainer" style={MainContainerStyle}>
                <JoinRoom />
            </div>
        </div>
    )
}

export default App;