import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppOwn from './AppOwn';
import ExitPage from "./ExitPage";
import EntryPage from "./EntryPage";
import Leaderboard from "./Leaderboard";

function App(){
    return(
        <>
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<EntryPage/>}/>
                <Route path="/game" element={<AppOwn/>}/>
                <Route path="/exit" element={<ExitPage/>}/>
                <Route path="/leaderboard" element={<Leaderboard/>}/>
            </Routes>
        </BrowserRouter>
        </>
    );
}

export default App;