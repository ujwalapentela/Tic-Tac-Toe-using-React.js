import './Player1.css';


export default function Player1({player_name1,player_id1,players}){
    console.log('entered player1');

    function PlayerStatus(player){
        if(player.match_status==='DRAW') return 'DRAW';
        else if(player.winner===player_id1) return 'WON';
        return 'LOST';
    }

    return(
        <div className='player1-status'>
            <div id="player1-header">
        <p style={{textTransform:'capitalize'}}>Match History Of {player_name1}</p>
            </div>
            <div id="player1-status">
        <table>
        <thead>
            <tr>
            <th>MATCH</th>
            <th>OPPONENT</th>
            <th>MATCH STATUS</th>
            </tr>
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