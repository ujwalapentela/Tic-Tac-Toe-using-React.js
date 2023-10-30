const express = require('express')
const mysql = require('mysql');
const cors = require('cors');

const app =express();

app.use(cors());
app.use(express.json());

// Create connection
const db=mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database: 'tic_tac_toe_database'
});

// Connect
db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('mysql connected');
}
)


// Create DB
app.get('/createdb',(req,res)=>{
    let sql='CREATE DATABASE tic_tac_toe_database';
    db.query(sql,(err,result)=> {
        if(err) throw err;
        console.log(result);
        res.send('Database created ...');
    });
});

// Create table 
app.get('/createtable',(req,res)=>{
    let sql = 'CREATE TABLE matches(id int AUTO_INCREMENT, match_status VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('Table created ...');
    });
});


// // Insert player-1
app.post('/addplayer',(req,res)=>{
    const player_name = req.body.player_name;
       db.query('INSERT INTO players (player_name) VALUES(?)',[player_name],
        (err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('Inserted a record');
       });
    });

// SELECT records

app.get('/getmatches',(req,res)=>{
    let sql='SELECT * FROM matches';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});


// GET Player names
app.get('/getplayers',(req,res)=>{
    let sql='SELECT player_name,player_id from players';
    db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
})

app.get('/getplayersinfo',(req,res)=>{
    let sql='SELECT player_name,matches_played,matches_won,matches_lost,matches_draw,matches_won*2+matches_draw as score from players order by score DESC,player_name';
    let query=db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});

// get combined information of matches between player1 and player2
app.post('/getcombinedmatchinfo',(req,res)=>{
    let players=req.body;
    let sql=`
    SELECT id,match_status,winner,player_name FROM ( SELECT matches.id,matches.match_status,matches.winner,players.player_name FROM matches INNER JOIN players ON matches.player_id1=players.player_id WHERE matches.winner=matches.player_id1 AND matches.player_id1 IN (${players.p_id1},${players.p_id2}) and matches.player_id2 IN (${players.p_id1},${players.p_id2}) UNION SELECT matches.id,matches.match_status,matches.winner,players.player_name FROM matches INNER JOIN players ON matches.player_id2=players.player_id WHERE matches.winner=matches.player_id2 AND matches.player_id1 IN (${players.p_id1},${players.p_id2}) and matches.player_id2 IN (${players.p_id1},${players.p_id2}) UNION select matches.id,matches.match_status,matches.winner,players.player_name FROM matches INNER JOIN players ON matches.player_id1=players.player_id where matches.match_status='DRAW' AND matches.winner is NULL AND matches.player_id1 IN (${players.p_id1},${players.p_id2}) and matches.player_id2 IN (${players.p_id1},${players.p_id2})) results ORDER BY id`;
    let query=db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});

// get all matches information of player1
app.post('/getplayer1info',(req,res)=>{
    let players=req.body;
    let sql=`SELECT id,match_status,winner,player_name FROM (SELECT matches.id,matches.match_status,matches.winner,players.player_name FROM matches INNER JOIN players ON matches.player_id2=players.player_id WHERE matches.match_status IN ('WIN','DRAW') AND matches.player_id1=${players.p_id1} UNION SELECT matches.id,matches.match_status,matches.winner,players.player_name FROM matches INNER JOIN players ON matches.player_id1=players.player_id WHERE matches.player_id2=${players.p_id1} AND matches.match_status IN ('WIN','DRAW')) results ORDER BY id;`
    let query=db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});

// get all matches information of player2
app.post('/getplayer2info',(req,res)=>{
    let players=req.body;
    let sql=`SELECT id,match_status,winner,player_name FROM (SELECT matches.id,matches.match_status,matches.winner,players.player_name FROM matches INNER JOIN players ON matches.player_id2=players.player_id WHERE matches.match_status IN ('WIN','DRAW') AND matches.player_id1=${players.p_id2} UNION SELECT matches.id,matches.match_status,matches.winner,players.player_name FROM matches INNER JOIN players ON matches.player_id1=players.player_id WHERE matches.player_id2=${players.p_id2} AND matches.match_status IN ('WIN','DRAW')) results ORDER BY id`;
    let query=db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});




// // UPDATE record 
// app.get('/updatematches/:id',(req,res)=>{
//     let status='WIN';
//     let sql=`UPDATE matches SET match_status="${status}" WHERE id=${req.params.id}`;
//     let query=db.query(sql,(err,result)=>{
//         if(err) throw err;
//         console.log(result);
//         res.send('Player updated');
//     });
// });

app.post('/updateplayerswin',(req,res)=>{
    let player_id=req.body;
    let sql = `UPDATE players SET matches_played=matches_played+1,matches_won=matches_won+1 where player_id=${player_id.id}`;
    let query = db.query(sql,(err,result)=>{
        if(err) return err;
        console.log(result);
        res.send(result);
    });
});

app.post('/updateplayerslose',(req,res)=>{
    let player_id=req.body;
    let sql = `UPDATE players SET matches_played=matches_played+1,matches_lost=matches_lost+1 where player_id=${player_id.id}`;
    let query = db.query(sql,(err,result)=>{
        if(err) return err;
        console.log(result);
        res.send(result);
    });
});

app.post('/updateplayersdraw',(req,res)=>{
    let player_ids=req.body;
    let sql = `UPDATE players SET matches_played=matches_played+1,matches_draw=matches_draw+1 where player_id IN (${player_ids.id1},${player_ids.id2})`;
    let query = db.query(sql,(err,result)=>{
        if(err) return err;
        console.log(result);
        res.send(result);
    });
});

app.post('/updatematches',(req,res)=>{
    console.log(req.body);
    let player_ids=req.body;
    let sql=`INSERT INTO matches(match_status,player_id1,player_id2,start_time) values('started',${player_ids.player1},${player_ids.player2},sysdate())`;
    let query3=db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result.insertId);
        res.send(result);
    });
    });

app.post('/updatematchesfinal',(req,res)=>{
    let stats=req.body;
    let sql=`UPDATE matches SET match_status='${stats.status}',winner=${stats.winner},end_time=sysdate() WHERE id=${stats.m_id}`;
    let query3=db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
    });


// DELETE record
app.get('/deletematches/:id',(req,res)=>{
    let sql=`DELETE FROM matches WHERE id=${req.params.id}`;
    let query=db.query(sql,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send('Player deleted');
    });
});


app.listen('5000',()=>{
    console.log('Server started on port 5000')
});