import './PlayersCombined.css';


export default function PlayersCombined({players}){
    console.log('entered players');
    
    return(
        <div className='players-combined-status'>
            <div id="players-combined-header">
            <p>Previous Matches</p>
            </div>
            <div id="players-combined-status">
        <table>
        <thead>
            <tr>
            <th>MATCH</th>
            <th>WINNER</th>
            </tr>
        </thead>
        <tbody>
        { players.map((player,id)=>(
            <tr key={id}>
                <td>{player.id}</td>
                <td>{player.match_status==='DRAW'?'DRAW':player.player_name}</td>
            </tr>
        ))}
        </tbody>
        </table>
        </div>
    </div>
    );
}