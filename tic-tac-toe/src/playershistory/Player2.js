import './Player2.css';


export default function Player2({player_name2,player_id2,players}){
    console.log('entered player2');

    function PlayerStatus(player){
        if(player.match_status==='DRAW') return 'DRAW';
        else if(player.winner===player_id2) return 'WON';
        return 'LOST';
    }

    return(
        <div className='player2-status'>
            <div id="player2-header">
        <p style={{textTransform:'capitalize'}}>Match History Of {player_name2} </p>
            </div>
            <div id="player2-status">
        <table>
        <thead>
            <th>MATCH</th>
            <th>OPPONENT</th>
            <th>MATCH STATUS</th>
        </thead>
        <tbody>
        { players.map((player,id)=>(
            <tr key={id}>
                <td>{player.id}</td>
                <td>{player.player_name}</td>
                <td>{PlayerStatus(player)}</td>
            </tr>
        ))}
        </tbody>
        </table>
            </div>
    </div>
    );
}