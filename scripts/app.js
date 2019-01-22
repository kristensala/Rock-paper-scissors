var hand = {
    rock: 1,
    paper: 2,
    scissors: 3
};

var playerScore = 0;
var computerScore = 0;
var numOfTieGames = 0;
var winner;
var computerHand; // hand in string
var playerHand; // hand in string
var result = [];
var nameEntered;
var computerMove;
var gameTime = 0;
var myInterval;
var array = [];
var name = "";
var date = "";

function reset() {
    // panen timeri kinni
    enableAndDisableButtons(true);
    writeStatsToFile();
    playerScore = 0;
    computerScore = 0;
    result = [];
    $(".playerScore").html(playerScore);
    $(".computerScore").html(computerScore);
    //filterByString();
    $(".resultTable").empty();
    document.getElementById("playerName").value = "";
    document.getElementById("startBtn").disabled = false;
    document.getElementById("resetBtn").disabled = true;
}

function startGame() {
    if ($("#playerName").val() == "") {
        alert("Please enter a name!");
    } else {
        alert("Pick a hand!")
        // siin alustan timeri

        document.getElementById("startBtn").disabled = true;
        enableAndDisableButtons(false);
        document.getElementById("resetBtn").disabled = false;
    }
}

function image(thisImg, divId) {
    var img = document.createElement("IMG");
    img.src = "images/"+thisImg;
    document.getElementById(divId).appendChild(img);
    img.style.height = "150px";
    img.style.width = "150px";
    if (divId == 'imageDiv') {
        img.style.marginTop = "60px";
    } else if(divId =='computerImageDiv') {
        img.style.marginTop = "100px";
    }
    //img.style.marginTop = "100px";
}

function enableAndDisableButtons(trueOrFalse) {
    document.getElementById("btnRock").disabled = trueOrFalse;
    document.getElementById("btnPaper").disabled = trueOrFalse;
    document.getElementById("btnScissors").disabled = trueOrFalse;
}

//with player move the game starts - also game logic function
function play(x) {

  var playerMove = x;
  console.log(playerMove);

    enableAndDisableButtons(true);
    //execPy();

    nameEntered = $("#playerName").val().trim();

    //var computerMove = Math.floor((Math.random() * 3) + 1);
    $.get('../cgi-bin/prax3/generateHand.py', function(data){
       computerMove = data
    });

    if (x == hand.rock){
        image("rock.png", 'imageDiv');
    } else if (x == hand.paper) {
        image("paper.jpg", 'imageDiv');
    } else if (x == hand.scissors) {
        image("scissors.png", 'imageDiv');
    }

    if (computerMove == hand.rock){
        image("rock.png", 'computerImageDiv');
    } else if (computerMove == hand.paper) {
        image("paper.jpg", 'computerImageDiv');
    } else if (computerMove == hand.scissors) {
        image("scissors.png", 'computerImageDiv');
    }

    //getWinner(computerMove, playerMove);

  /*  $.get('../cgi-bin/prax3/getWinner.py?computer='+computerMove+'&player='+playerMove).done(function(response) {
      console.log(response);
    });*/

    // game logic
    if (x == computerMove) {
        winner = "Tie";
        if (x == 1){
            playerHand = "Rock";
        } else if (x == 2) {
            playerHand ="Paper";
        } else if (x == 3){
            playerHand = "Scissors";
        }

        if (computerMove == 1) {
            computerHand = "Rock";
        } else if (computerMove == 2) {
            computerHand ="Paper";
        } else if (computerMove == 3){
            computerHand = "Scissors";
        }

        whoWon("Tie game!");
    }

    //player hand.rock
    if (x == hand.rock) {
        playerHand = "Rock";
        if(computerMove == hand.paper) {
            winner = "Computer";
            computerHand = "Paper";
            whoWon("Computer")
        } else if (computerMove == hand.scissors) {
            winner = "Player"
            computerHand = "Scissors";
            whoWon("Player");
        }
    }
    //player hand.paper
    if (x == hand.paper) {
        playerHand = "Paper";
        if (computerMove == hand.rock) {
            winner = "Player"
            computerHand = "Rock";
            whoWon("Player");
        } else if (computerMove == hand.scissors) {
            winner = "Computer";
            computerHand = "Scissors";
            whoWon("Computer");
        }
    }
    //player hand.scissors
    if (x == hand.scissors) {
        playerHand = "Scissors";
        if (computerMove == hand.rock) {
            winner = "Computer";
            computerHand = "Rock";
            whoWon("Computer");
        } else if (computerMove == hand.paper) {
            winner = "Player"
            computerHand = "Paper";
            whoWon("Player");
        }
    }

    $('#imageDiv').fadeOut(1000, function(){
        enableAndDisableButtons(false);
        $(this).empty().show();
    })

    $('#computerImageDiv').fadeOut(1000, function(){
        enableAndDisableButtons(false);
        $(this).empty().show();
    })

}

function score(who) {
    if (who == "Player") {
        playerScore++;
        $(".playerScore").html(playerScore);
    } else if (who == "Computer") {
        computerScore++;
        $(".computerScore").html(computerScore);
    } else {
        numOfTieGames++;
    }
}

function whoWon(who){
    saveResult();
    showLastResults();
    score(who);
}

function saveResult() {
    var stats = [];
    stats[0] = playerHand;
    stats[1] = winner;
    stats[2] = computerHand;
    result.unshift(stats);
}

function showLastResults() {
    var table = "<table><tr><th>Player hand</th><th>Winner</th><th>Computer hand</th></tr>";
    for (var i = 0; i<result.length; i++){
        table += "<tr>";
        for (var j = 0; j<result[i].length; j++) {
            table += "<td>" + result[i][j] + "</td>"
        }
        table += "</tr>"
    }
    table += "</table>";
    $(".resultTable").html(table);

}

function writeStatsToFile() {
    $.get('../cgi-bin/prax3/saveStats.py', {
        nameOfPlayer: nameEntered,
        playerWins: playerScore,
        computerWins: computerScore
    });
};

function readScores() {

    name = $('#personSearch').val();
    date = $('#date').val();

    if (name.length > 0 && date.length == 0) {
        $.get('../cgi-bin/prax3/readStats.py?searchName='+name).done(function (response) {
            $('#gameResults').empty();
            $('#gameResults').html(response);
        });
    } else if (name.length == 0 && date.length > 0) {
        $.get('../cgi-bin/prax3/readStats.py?searchDate='+date).done(function (response) {
            $('#gameResults').empty();
            $('#gameResults').html(response);
        });
    } else if (name.length > 0 && date.length > 0) {
        $.get('../cgi-bin/prax3/readStats.py?searchName='+name+'&searchDate='+date).done(function (response) {
            $('#gameResults').empty();
            $('#gameResults').html(response);
        });
    } else {
        $.get('../cgi-bin/prax3/readStats.py').done(function (response) {
            $('#gameResults').empty();
            $('#gameResults').html(response);
        });
    }
}

/* TODO: loen pythonis lihtsalt read ja js converdin arrayks


/*TODO: write stats to html function - date / player name / player score /
opponent name / opponent score / winner - kuvan neid bootstrapi moodulis
*/
