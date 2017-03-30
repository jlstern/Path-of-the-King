// Variables
var movementOn = true;
var room = 0;
var player = {
	x: 0,
	y: 0,
	exactX: 0,
	exactY: 0
}

var map = [
	[ // room 0
		[1, 1, 1, 1, 4, 1, 0, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 2, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	]
]
// 0 = trapdoor
// 1 = walkable floor
// 2 = ladder
// 3 = wall
// 4 = door

// Interval Variables
var animatePlayerIcon;

function drawBackground(){
	// tiles are 40px by 40px
	var ctx = $("#towerCanvas")[0].getContext("2d");
	for(var x = 0; x < 20; x++){
		for(var y = 0; y < 15; y++){
			var tile = map[room][y][x];
			if(tile === 0 || 1){
				ctx.fillStyle = "rgb(160, 194, 251)";
				ctx.fillRect(x*40, y*40, 40, 40);
			}
			if(tile != 0){
				ctx.moveTo(x*40, (y*40)+40);
				ctx.lineTo((x*40)+40, (y*40)+40);
				ctx.stroke();
			}
			if(tile === 2){
				ctx.fillStyle = "yellow";
				ctx.fillRect((x*40)+5, y*40, 30, 40);
			}
			if(tile === 3){
				ctx.fillStyle = "gray";
				ctx.fillRect(x*40, y*40, 40, 40);
			}
		}
	}
}

	var currX = player.x
	var currY = player.y


function movePlayer(x, y){
	movementOn = false;
	player.x += x;
	player.y += y;
	var interval = 0;
	var ctx = $("#playerCanvas")[0].getContext("2d");
	ctx.fillStyle = "red";
	animatePlayerIcon = setInterval(function(){
		interval += 1;
		player.exactX += x/10;
		player.exactY += y/10;
		ctx.clearRect(0, 0, 800, 600);
		ctx.fillRect((player.exactX*40)+5, (player.exactY*40)+5, 30, 34)
		if(interval >= 10){
			clearInterval(animatePlayerIcon);
			player.exactX = player.x;
			player.exactY = player.y;
			checkTerrain();
		}
	}, 20);
	
	
	// checkTerrain(function(){
	// 	movementOn = true;
	// });
}

function checkTerrain(){
	if(map[room][player.y][player.x] === 0){
		movePlayer(0, 1)
	} else {
		movementOn = true;
	}
}


// ++++++++++++++++++++++

var keyState = {};

$(window).keydown(function(event){
	if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
		event.preventDefault();
	}
	keyState[event.keyCode || event.which] = true;
});

$(window).keyup(function(event){
	keyState[event.keyCode || event.which] = false;
});

function checkKeyPress(){
	if(movementOn === true){
		if (keyState[37] || keyState[65]){
			// Move Left
			if(player.x-1 >= 0 && map[room][player.y][player.x-1] != 3){
				movePlayer(-1, 0);
			}
		}    
		else if (keyState[39] || keyState[68]){
			// Move Right
			if(player.x+1 < map[room][0].length && map[room][player.y][player.x+1] != 3){
				movePlayer(1, 0);
			}
		}
		else if (keyState[38] || keyState[87]){
			// Move Up
			if(map[room][player.y][player.x] === 2){
				movePlayer(0, -1);
			}
			// Go through door
			else if(map[room][player.y][player.x] === 4){
				console.log("Enter Door");
			}
		}
		else if (keyState[40] || keyState[83]){
			// Move Down
			if(map[room][player.y+1][player.x] === 2)
			movePlayer(0, 1);
		}
	}
	setTimeout(checkKeyPress, 10);
}


drawBackground();
checkKeyPress();
movePlayer(0, 0);

