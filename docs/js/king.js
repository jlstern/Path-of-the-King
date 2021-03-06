// Table of Contents
// 01 - Images and variables
// 02 - Player object, abilities, and level up
// 03 - Enemy object and encounter logic
// 03 - Battle sequence
// 05 - Map and overworld movement
// 06 - Load screen and initialize

////////////////////////////////////////////////////////
// 01 - Images and variables
////////////////////////////////////////////////////////
// IMAGES
	// Player
	var playerIcon = new Image(100, 200);
	playerIcon.src = "images/arrows.png";
	var playerImg = new Image(1600, 1200);
	playerImg.src = "images/char_strips/king_strip.png";

	// Enemies
	var placeholderImg = new Image (1000, 600);
	var goblinImg = new Image(1000, 600);
	goblinImg.src = "images/char_strips/goblin_strip.png";
	var birdImg = new Image(1000, 800);
	birdImg.src = "images/char_strips/bird_strip.png";
	var vikingImg = new Image(1000, 1000);
	vikingImg.src = "images/char_strips/viking_strip.png";

	// FX
	var burstImg = new Image(1200, 200);
	burstImg.src = "images/fx/burst_strip.png";

	// Background
	var hallwayPanel = new Image(150, 400);
	hallwayPanel.src = "images/background/castlewall.png";
	var lowerPanel = new Image(3300, 833);
	lowerPanel.src = "images/background/lower_half.png";

// VARIABLES
	// Battle
	var enemyTeam = [];
	var turnOrder = [];
	var currentTurn = 0;
	var actEnemy = 0;
	var target = 0;
	var ability = {
		dmg: 0,
		type: "",
		cost: 0,
		bonus: 0,
		fx: 0
	}
	displayDmg = 0;
	var expPool = 0;
	var enemyDmg = 0;
	var flinchOK = true; // checks to make sure flinch animation is complete
	var fxOK = true; // checks to make sure FX animation is complete

	// Level up
	var redLv = 0;
	var bluLv = 0;
	var yelLv = 0;
	var orgLv = 0;
	var purLv = 0;
	var greLv = 0;

	// Overworld and movement
	var room = 0;
	var movementOn = true;
	var transitionCount = 0;
	var keyState = {};

	// Set interval variables
	var animatePlayer
	var animateEnemy = [,,,];
	var animateFX
	var fxFrame = 0;

////////////////////////////////////////////////////////
// 02 - Player object, abilities, and level up
////////////////////////////////////////////////////////
// Player object
var player = {
	name: "King",
	type: "player",
	// stats
	hpCurr: 25,
	hpTotal: 25 + Math.floor(redLv*5 + purLv*2.5 + bluLv*5 + greLv*7.5 + yelLv*10 + orgLv*7.5),
	mpCurr: 10,
	mpTotal: 10 + Math.floor(redLv*2 + purLv*4 + bluLv*6 + greLv*8 + yelLv*6 + orgLv*4),
	mpRegen: 1 + Math.floor(redLv*0.5 + purLv*0.75 + bluLv*1 + greLv*0.75 + yelLv*0.5 + orgLv*0.25),
	wepDef: Math.floor(redLv*7.5 + purLv*5 + bluLv*2.5 + greLv*5 + yelLv*7.5 + orgLv*10),
	magDef: Math.floor(redLv*2.5 + purLv*5 + bluLv*7.5 + greLv*10 + yelLv*7.5 + orgLv*5),
	wepMod: 0,
	magMod: 0,
	speed: 2 + Math.floor(redLv*1.5 + purLv*2 + bluLv*1.5 + greLv*1 + yelLv*0.5 + orgLv*1),
	exp: 0,
	level: 1,
	path: 0,
	// for battle animation
	frame: 0,
	step: 0,
	dx: 0,
	dy: 0,
	// overworld and movement
	x: 1,
	y: 1,
	direction: 0,
	step: 0,
	terrain: 0
}

// LIST OF PLAYER ABILITY FUNCTIONS
function playerSlice(){
	console.log("Slice selected")
	ability.dmg = 5;
	ability.type = "weapon";
	ability.cost = 0;
	ability.bonus = nullFunc;
	ability.fx = nullFunc;
	$("#target-box").removeClass("hidden");
}

function playerBurst(){
	console.log("Burst selected");
	if(player.mpCurr < 4){
		return openBattleSubHeader("Not enough magic!", 1000);
	}
	ability.dmg = 8;
	ability.type = "magic";
	ability.cost = 4;
	ability.bonus = nullFunc;
	ability.fx = burstFX
	$("#target-box").removeClass("hidden");
}

function playerHeal(){
	console.log("Heal");
	if(player.mpCurr < 6){
		return openBattleSubHeader("Not enough magic!", 1000);
	}
	player.mpCurr -= 6;
	player.hpCurr += 8;
	if(player.hpCurr > player.hpTotal){
		player.hpCurr = player.hpTotal
	}
	refreshHeroDisplay();
	setTimeout(function(){
		currentTurn++;
		beginTurnRotation();
	}, 400)
};

function playerWildSwing(){
	console.log("Wild Swing selected");
	ability.dmg = Math.floor((Math.random() * 8) + 3);
	if(ability.dmg === 3){
		ability.dmg = 2
	}
	else if(ability.dmg === 8){
		ability.dmg = 10
	}
	ability.type = "weapon";
	ability.cost = 0;
	ability.bonus = nullFunc;
	ability.fx = nullFunc;
	$("#target-box").removeClass("hidden");
}

function playerMagicGust(){
	console.log("Magic Gust selected");
	if(player.mpCurr < 5){
		return openBattleSubHeader("Not enough magic!", 1000);
	}
	player.mpCurr -= 5;
	ability.cost = 0;
	ability.dmg = 4;
	ability.type = "magic";
	target = "all";
	ability.bonus = nullFunc;
	for(i = 0; i < enemyTeam.length; i++){
		if(enemyTeam[i].hpCurr > 0){
			calculateDamage(i);
		}
	}
	playerCastSpell(nullFunc);
}

// SETUP ABILITIES
function setIconImages(){
	$(".ability-slice").attr("src", "images/icons/slice.png");
	$(".ability-burst").attr("src", "images/icons/burst.png");
	$(".ability-heal").attr("src", "images/icons/heal.png");
	$(".ability-wild-swing").attr("src", "images/icons/slice.png");
	$(".ability-magic-gust").attr("src", "images/icons/burst.png");
	$(".ability-everlasting").attr("src", "images/icons/heal.png");
}

function turnOnAbilityButtons(){
	$(".ability-slice").on("click", playerSlice);
	$(".ability-burst").on("click", playerBurst);
	$(".ability-heal").on("click", playerHeal);
	$(".ability-wild-swing").on("click", playerWildSwing);
	$(".ability-magic-gust").on("click", playerMagicGust);
}

function turnOffAbilityButtons(){
	$(".ability-slice").off("click", playerSlice);
	$(".ability-burst").off("click", playerBurst);
	$(".ability-heal").off("click", playerHeal);
	$(".ability-wild-swing").off("click", playerWildSwing);
	$(".ability-magic-gust").off("click", playerMagicGust);
}

// LEVEL UP SEQUENCE
masterPathList = [
{
	index: 0,
	name: "Path of the Novice",
	lv: 1,
	nextPath: [1, 2, 3]
},
{
	index: 1,
	name: "Path of the Fox",
	type: "red",
	lv: 2,
	nextPath: [1, 2, 3],
	className: "ability-wild-swing"
},
{
	index: 2,
	name: "Path of the Wind",
	type: "blue",
	lv: 2,
	nextPath: [1, 2, 3],
	className: "ability-magic-gust"
},
{
	index: 3,
	name: "Path of Stone",
	type: "yellow",
	lv: 2,
	nextPath: [1, 2, 3],
	className: "ability-everlasting"
},
]

function increaseStats(){
	if(masterPathList[player.path].type === "red"){
		redLv++;
	}
	else if(masterPathList[player.path].type === "blue"){
		bluLv++;
	}
	else if(masterPathList[player.path].type === "green"){
		greLv++;
	}
	else if(masterPathList[player.path].type === "orange"){
		orgLv++;
	}
	else if(masterPathList[player.path].type === "yellow"){
		yelLv++;
	}
	else if(masterPathList[player.path].type === "purple"){
		purLv++;
	}
}


////////////////////////////////////////////////////////
// 03 - Enemy object and encounter logic
////////////////////////////////////////////////////////
// Enemy object
var encounterMasterList = [
	[1, 0, 0, 0],
	[2, 2, 0, 0],
	[1, 1, 0, 0]
]

var enemy = [
	{
		index: 0,
		type: "placeholder",
		name: "placeholder",
		image: placeholderImg,
		hpCurr: 0,
		hpTotal: 0,
		wepDef: 0,
		magDef: 0,
		wepMod: 0,
		magMod: 0,
		speed: 0,
		exp: 0,
		// attack logic
		attackChance: [],
		attackFunc: [],
		// for placement in battle
		position: 0,
		frame: 0,
		dx: 0, 
		dy: 0,
	},
	{
		index: 1,
		type: "enemy",
		name: "Goblin",
		image: goblinImg,
		hpCurr: 10,
		hpTotal: 10,
		wepDef: 0,
		magDef: 0,
		wepMod: 0,
		magMod: 0,
		speed: 2,
		exp: 2,
		// attack logic
		attackChance: [35, 65],
		attackFunc: [enemySqueal, enemyAxeSwing],
		// for placement in battle
		position: 0,
		frame: 0,
		dx: 0, 
		dy: 0,
	},
	{
		index: 2,
		type: "enemy",
		name: "Bird",
		image: birdImg,
		hpCurr: 5,
		hpTotal: 5,
		wepDef: 0,
		magDef: 30,
		wepMod: 0,
		magMod: 0,
		speed: 3,
		exp: 2,
		// attack logic
		attackChance: [100],
		attackFunc: [enemyPeck],
		// for placement in battle
		position: 0,
		frame: 0,
		dx: 0, 
		dy: 0,
	},
	{
		index: 3,
		type: "enemy",
		name: "Viking",
		image: vikingImg,
		hpCurr: 15,
		hpTotal: 15,
		wepDef: 50,
		magDef: -20,
		wepMod: 0,
		magMod: 0,
		speed: 1,
		exp: 3,
		// attack logic
		attackChance: [30, 70],
		attackFunc: [enemyDefend, enemySwordSwing],
		// for placement in battle
		position: 0,
		frame: 0,
		dx: 0, 
		dy: 0,
	}
];

////////////////////////////////////////////////////////
// 05 - Battle sequence
////////////////////////////////////////////////////////
function openBattlefield(){
	$("#world-map").addClass("hidden");
	$("#battlefield").removeClass("hidden");
}

function beginEncounter(encounterNum){
	// set up enemy team
	for(i = 0; i < 4; i++){
		enemyTeam[i] = Object.assign({}, enemy[encounterMasterList[encounterNum][i]]);
		enemyTeam[i].position = i;
	}
	// set up turn order
	var turnOrderPrelim = [player]
	for(i = 0; i < enemyTeam.length; i++){
		turnOrderPrelim.push(enemyTeam[i])
	}
	while(turnOrderPrelim.length > 0){
		var highest = turnOrderPrelim[0].speed;
		var highestIndex = 0
		for(i = 0; i < turnOrderPrelim.length; i++){
			if(turnOrderPrelim[i].speed > highest){
				highestIndex = i;
				highest = turnOrderPrelim[i].speed;
			}
		}
		turnOrder.push(turnOrderPrelim[highestIndex]);
		turnOrderPrelim.splice(highestIndex, 1);
	}
	currentTurn = 0;
	refreshHeroDisplay();
	drawAllIdleEnemies();
	drawIdlePlayerSheathed();
	drawTransition(openBattlefield, playerDrawSword);
}

function openBattleHeader(insertString, duration){
	$("#battle-header").text(insertString);
	var width = $("#battle-header").css("width");
	var numWidth = Number(width.slice(0, -2));
	$("#battle-header").animate({
		left: (400-numWidth/2)+"px",
		opacity: "1",
	}, function(){
		setTimeout(function(){
			var width = $("#battle-header").css("width");
			var numWidth = Number(width.slice(0, -2));
			$("#battle-header").animate({
				left: (800-numWidth)+"px",
				opacity: "0",
			}).animate({
				left: "0"
			})
		}, duration);
	});
}

function openBattleSubHeader(insertString, duration){
	$("#battle-sub-header").text(insertString);
	var width = $("#battle-sub-header").css("width");
	var numWidth = Number(width.slice(0, -2));
	$("#battle-sub-header").animate({
		left: (400-numWidth/2)+"px",
		opacity: "1",
	}, function(){
		setTimeout(function(){
			var width = $("#battle-sub-header").css("width");
			var numWidth = Number(width.slice(0, -2));
			$("#battle-sub-header").animate({
				left: (800-numWidth)+"px",
				opacity: "0",
			}).animate({
				left: "0"
			})
		}, duration);
	});
}

function drawIdlePlayerSheathed(){
	clearInterval(animatePlayer);
	var ctx = $("#player-ani-canvas")[0].getContext("2d");
	player.frame = 0
	animatePlayer = setInterval(function(){
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(playerImg, player.frame*200, 0, 200, 200, player.dx, 150, 200, 200);
		player.frame++;
		if(player.frame > 1){
			player.frame = 0;
		}
	}, 400);
}

function playerDrawSword(){
	openBattleHeader("BEGIN BATTLE!", 1300);
	clearInterval(animatePlayer);
	var ctx = $("#player-ani-canvas")[0].getContext("2d");
	player.frame = 0
	animatePlayer = setInterval(function(){
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(playerImg, player.frame*200, 800, 200, 200, player.dx, 150, 200, 200);
		player.frame++;
		if(player.frame >= 8){
			drawIdlePlayer();
			beginTurnRotation();
		}
	}, 100);
}

function playerSheathSword(endFunc){
	clearInterval(animatePlayer);
	var ctx = $("#player-ani-canvas")[0].getContext("2d");
	player.frame = 0
	animatePlayer = setInterval(function(){
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(playerImg, player.frame*200, 1000, 200, 200, player.dx, 150, 200, 200);
		player.frame++;
		if(player.frame >= 4){
			drawIdlePlayerSheathed();
			endFunc();
		}
	}, 200);
}

function drawIdlePlayer(){
	clearInterval(animatePlayer);
	var ctx = $("#player-ani-canvas")[0].getContext("2d");
	player.frame = 0
	animatePlayer = setInterval(function(){
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(playerImg, player.frame*200, 200, 200, 200, player.dx, 150, 200, 200);
		player.frame++;
		if(player.frame > 1){
			player.frame = 0;
		}
	}, 400);
}

function drawAllIdleEnemies(){
	for(i = 0; i < enemyTeam.length; i++){
		if(enemyTeam[i].index > 0){
			drawIdleEnemy(i);
		}
	}
}

function drawIdleEnemy(index){
	clearInterval(animateEnemy[index]);
	var ctx = $(".enemy-ani-canvas")[index].getContext("2d");
	enemyTeam[index].frame = Math.floor(Math.random()*4);
	animateEnemy[index] = setInterval(function(){
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(enemyTeam[index].image, enemyTeam[index].frame*200, 0, 200, 200, 205+index*130, 150, 200, 200);
		enemyTeam[index].frame++;
		if(enemyTeam[index].frame > 3){
			enemyTeam[index].frame = 0;
		}
	}, 200);
}

function beginTurnRotation(){
	setTimeout(function(){
		// makes sure all aniamtions are complete
		if(flinchOK === false || fxOK === false){
			return beginTurnRotation();
		}
		console.log("Begin turn " + currentTurn)
		// reset current turn to zero
		if(currentTurn >= turnOrder.length){
			currentTurn = 0;
		}
		// check if all enemies dead
		var enemiesRemaining = 0;
		for(i = 0; i < enemyTeam.length; i++){
			if(enemyTeam[i].hpCurr > 0){
				enemiesRemaining++;
			}
		}
		// console.log("Enemies remaining: " + enemiesRemaining);
		if(enemiesRemaining === 0){
			return playerSheathSword(endEncounter);
		}
		// return player or enemy turns
		else if(turnOrder[currentTurn].type === "player"){
			return playerTurn();
		}
		else if(turnOrder[currentTurn].type === "enemy" && turnOrder[currentTurn].hpCurr > 0){
			return enemyTurn(turnOrder[currentTurn].position);
		}
		else{
			currentTurn++;
			beginTurnRotation();
		}
	}, 100);
}

function playerTurn(){
	console.log("Player turn");
	openBattleSubHeader("~ Player Turn ~", 1800);
	player.mpCurr += player.mpRegen;
	if(player.mpCurr > player.mpTotal){
		player.mpCurr = player.mpTotal
	}
	// Everlasting
	if($(".locked-ability").hasClass("ability-everlasting")){
		player.hpCurr = Math.floor(player.hpCurr*1.2);
		if(player.hpCurr > player.hpTotal){
			player.hpCurr = player.hpTotal
		}
	}
	refreshHeroDisplay();
	turnOnAbilityButtons();
}

// TARGETTING MECHANICS
for(i = 0; i < 4; i++){
	$("#target" + i).on("click", function(){
		if(enemyTeam[$(this).index()].hpCurr > 0){
			turnOffAbilityButtons();
			$("#target-box").addClass("hidden");
			target = $(this).index();
			calculateDamage(target);
			if(ability.type === "weapon"){
				playerUseSword(ability.fx);
			}
			else if(ability.type === "magic"){
				playerCastSpell(ability.fx);
			}
		}
	});
}

// CALCULATE DAMAGE
function calculateDamage(ind){
	player.mpCurr -= ability.cost;
	if(ability.type === "weapon"){
		displayDmg = ability.dmg-Math.ceil(ability.dmg*(enemyTeam[ind].wepDef/100))
	}
	else if(ability.type === "magic"){
		displayDmg = ability.dmg-Math.ceil(ability.dmg*(enemyTeam[ind].magDef/100));
	}
	enemyTeam[ind].hpCurr -= displayDmg;
	if(enemyTeam[ind].hpCurr <= 0){
		expPool += enemyTeam[ind].exp;
	}
}

// REFRESH PLAYER DISPLAY
function refreshHeroDisplay(){
	// refresh stat bars
	$("#current-hp").text(player.hpCurr);
	$("#total-hp").text(player.hpTotal);
	$("#current-mp").text(player.mpCurr);
	$("#total-mp").text(player.mpTotal);
	$("#hp-bar").animate({
		width: (player.hpCurr/player.hpTotal)*100+"px"
	}, function(){
		if(player.hpCurr/player.hpTotal < 0.25){
			$("#hp-bar").css("background-color", "red");
		}
		else if(player.hpCurr/player.hpTotal < 0.5){
			$("#hp-bar").css("background-color", "yellow");
		}
	});
	$("#mp-bar").animate({
		width: (player.mpCurr/player.mpTotal)*100+"px"
	});
	// refresh main info panel
	
}

// FLOAT DAMAGE
function floatPlayerDamage(){
	$("#player-float").text("-" + displayDmg).
	css({"opacity": "1", "top": "140px"}).
	animate({
		top: "10px",
		opacity: "0"
	}, 1200);
}

function floatEnemyDamage(num){
	$("#float" + num).text("-" + displayDmg).
	css({"opacity": "1", "top": "140px"}).
	animate({
		top: "10px",
		opacity: "0"
	}, 1200);
}

// VISUAL EFFECTS
function nullFunc(){}

function burstFX(){
	var ctx = $("#fx-canvas")[0].getContext("2d");
	fxFrame = 0;
	animateFX = setInterval(function(){
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(burstImg, fxFrame*200, 0, 200, 200, 220+target*130, 150, 200, 200);
		fxFrame++;
		if(fxFrame > 5){
			ctx.clearRect(0, 0, 800, 600);
			clearInterval(animateFX);
		}
	}, 200);
}

// ATTACK ANIMATIONS
function playerUseSword(swordFX){
	clearInterval(animatePlayer);
	player.frame = 2;
	player.dx = 0;
	var ctx = $("#player-ani-canvas")[0].getContext("2d");
	animatePlayer = setInterval(function(){
		// walk up
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(playerImg, player.frame*200, 200, 200, 200, player.dx, 150, 200, 200);
		player.frame++;
		if(player.frame > 4){
			player.frame = 2;
		}
		player.dx += 65;
		if(player.dx >= 130+target*130){
			clearInterval(animatePlayer);
			player.step = 0;
			player.frame = 0;
			animatePlayer = setInterval(function(){
				// stab and withdraw
				ctx.clearRect(0, 0, 800, 600);
				ctx.drawImage(playerImg, player.frame*200, 400, 200, 200, player.dx, 150, 200, 200);
				if(player.step === 0){
					player.frame++;
				}
				else if(player.step === 1){
					refreshHeroDisplay();
					swordFX();
					enemyFlinch(target);
				}
				else if(player.step > 5 && player.step < 6){
					player.frame--;
				}
				else if(player.step >= 3){
					clearInterval(animatePlayer)
					player.frame = 0;
					animatePlayer = setInterval(function(){
						// walk away
						ctx.clearRect(0, 0, 800, 600);
						ctx.drawImage(playerImg, 400+player.frame*200, 200, 200, 200, player.dx, 150, 200, 200);
						player.frame++;
						if(player.frame > 2){
							player.frame = 0;
						}
						if(player.dx < 0){
							player.dx = 0;
							clearInterval(animatePlayer);
							drawIdlePlayer();
							currentTurn++;
							beginTurnRotation();
						}
						player.dx -= 26;
					}, 100);
				}
				player.step++;
			}, 175);
		}
	}, 150);
}

function playerCastSpell(spellFX){
	clearInterval(animatePlayer);
	player.frame = 0;
	var ctx = $("#player-ani-canvas")[0].getContext("2d");
	animatePlayer = setInterval(function(){
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(playerImg, player.frame*200, 600, 200, 200, player.dx, 150, 200, 200);
		if(player.frame === 4){
			refreshHeroDisplay();
			spellFX();
		}
		else if(player.frame > 4){
			if(target === "all"){
				for(i = 0; i < enemyTeam.length; i++){
					if(enemyTeam[i].hpCurr > 0){
						enemyFlinch(i);
					}
				}
			}
			else {
				enemyFlinch(target);
			}
			drawIdlePlayer();
			currentTurn++;
			beginTurnRotation();
		}
		player.frame++;
	}, 200);
}

function enemyFlinch(ind){
	flinchOK = false;
	clearInterval(animateEnemy[ind]);
	var ctx = $(".enemy-ani-canvas")[ind].getContext("2d");
	ctx.clearRect(0, 0, 800, 600);
	ctx.drawImage(enemyTeam[ind].image, 800, 0, 200, 200, 200+ind*130, 150, 200, 200);
	floatEnemyDamage(ind);
	setTimeout(function(){
		if(enemyTeam[ind].hpCurr <= 0){
			clearInterval(animateEnemy[ind]);
			enemyTeam[ind].frame = 10;
			animateEnemy[ind] = setInterval(function(){
				enemyTeam[ind].frame--;
				ctx.globalAlpha = enemyTeam[ind].frame/10;
				ctx.clearRect(0, 0, 800, 600);
				ctx.drawImage(enemyTeam[ind].image, 800, 0, 200, 200, 200+ind*130, 150, 200, 200);
				if(enemyTeam[ind].frame <= 0){
					clearInterval(animateEnemy[ind]);
					ctx.globalAlpha = 1;
					flinchOK = true;
				}
			}, 60);
		}
		else{
			drawIdleEnemy(ind);
			flinchOK = true;
		}
	}, 350);
}

// ENEMY TURN MECHANICS
function enemyTurn(num){
	console.log("Enemy turn");
	actEnemy = num;
	var randomNum = Math.floor(Math.random()*101);
	if(randomNum === 0){
		return enemyTurn(num);
	}
	for(i = 0; i < enemyTeam[num].attackChance.length; i++){
		var baseChance = 0;
		for(a = 0; a < enemyTeam[num].attackChance.length; a++){
			if(a < i){
				baseChance += enemyTeam[num].attackChance[a];
			}
		}
		if(randomNum <= enemyTeam[num].attackChance[i]+baseChance && randomNum > baseChance){
			return enemyTeam[num].attackFunc[i]();
		}
	}
	alert("ERROR: No attack was selected!");
}

// ENEMY ATTACK FUNCTIONS
function enemySqueal(){
	console.log("Squeal");
	enemyDmg = 2
	player.hpCurr -= enemyDmg-Math.ceil(enemyDmg*(player.magDef/100));
	displayDmg = enemyDmg-Math.ceil(enemyDmg*(player.magDef/100));
	enemyCastSpell(nullFunc);
}

function enemyAxeSwing(){
	console.log("Axe Swing");
	enemyDmg = 4
	player.hpCurr -= enemyDmg-Math.ceil(enemyDmg*(player.wepDef/100));
	displayDmg = enemyDmg-Math.ceil(enemyDmg*(player.magDef/100));
	enemyUseWeapon(nullFunc);
}

function enemyPeck(){
	console.log("Peck");
	enemyDmg = 3
	player.hpCurr -= enemyDmg-Math.ceil(enemyDmg*(player.wepDef/100));
	displayDmg = enemyDmg-Math.ceil(enemyDmg*(player.magDef/100));
	enemyUseWeapon(nullFunc);
}

function enemySwordSwing(){
	console.log("Sword Swing");
	enemyDmg = 5
	player.hpCurr -= enemyDmg-Math.ceil(enemyDmg*(player.wepDef/100));
	displayDmg = enemyDmg-Math.ceil(enemyDmg*(player.magDef/100));
	enemyUseWeapon(nullFunc);
}

function enemyDefend(){
	// logic so Viking won't defend at maximum defense
	if(enemyTeam[actEnemy].wepDef >= 100){
		return enemyTurn(currentTurn);
	}
	console.log("Defend");
	enemyTeam[actEnemy].wepDef += 15;
	if(enemyTeam[actEnemy].wepDef > 100){
		enemyTeam[actEnemy].wepDef = 100;
	}
	enemyBuffSelf(nullFunc);
}


// ENEMY ATTACK ANIMATIONS
function enemyUseWeapon(weaponFX){
	clearInterval(animateEnemy[actEnemy]);
	enemyTeam[actEnemy].frame = 0;
	enemyTeam[actEnemy].dx = 205+actEnemy*130;
	var ctx = $(".enemy-ani-canvas")[actEnemy].getContext("2d");

	animateEnemy[actEnemy] = setInterval(function(){
		// walk up
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(enemyTeam[actEnemy].image, enemyTeam[actEnemy].frame*200, 200, 200, 200, enemyTeam[actEnemy].dx, 150, 200, 200);
		enemyTeam[actEnemy].frame++
		if(enemyTeam[actEnemy].frame > 3){
			enemyTeam[actEnemy].frame = 0;
		}
		enemyTeam[actEnemy].dx -= 25;
		if(enemyTeam[actEnemy].dx <= 75){
			clearInterval(animateEnemy[actEnemy]);
			var step = 0;
			enemyTeam[actEnemy].frame = 0;
			animateEnemy[actEnemy] = setInterval(function(){
				// swing weapon and withdraw
				ctx.clearRect(0, 0, 800, 600);
				ctx.drawImage(enemyTeam[actEnemy].image, enemyTeam[actEnemy].frame*200, 400, 200, 200, enemyTeam[actEnemy].dx, 150, 200, 200);
				if(step < 3){
					enemyTeam[actEnemy].frame++;
				}
				else if(step === 3){
					weaponFX();
					playerFlinch();
				}
				else if(step === 4){
					enemyTeam[actEnemy].frame = 0;
				}
				else if(step === 8){
					clearInterval(animateEnemy[actEnemy]);
					enemyTeam[actEnemy].frame = 0;
					animateEnemy[actEnemy] = setInterval(function(){
						// walk away
						ctx.clearRect(0, 0, 800, 600);
						ctx.drawImage(enemyTeam[actEnemy].image, enemyTeam[actEnemy].frame*200, 200, 200, 200, enemyTeam[actEnemy].dx, 150, 200, 200);
						enemyTeam[actEnemy].frame++;
						if(enemyTeam[actEnemy].frame > 3){
							enemyTeam[actEnemy].frame = 0;
						}
						if(enemyTeam[actEnemy].dx >= 205+actEnemy*130){
							enemyTeam[actEnemy].dx = 205+actEnemy*130;
							clearInterval(animateEnemy[actEnemy]);
							drawIdleEnemy(actEnemy);
							currentTurn++;
							beginTurnRotation();
						}
						enemyTeam[actEnemy].dx += 25;
					}, 80);
				}
				step++;
			}, 100);
		}
	}, 120);
}

function enemyCastSpell(spellFX){
	clearInterval(animateEnemy[actEnemy]);
	enemyTeam[actEnemy].frame = 0;
	var ctx = $(".enemy-ani-canvas")[actEnemy].getContext("2d");
	animateEnemy[actEnemy] = setInterval(function(){
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(enemyTeam[actEnemy].image, enemyTeam[actEnemy].frame*200, 600, 200, 200, 205+actEnemy*130, 150, 200, 200)
		if(enemyTeam[actEnemy].frame === 2){
			spellFX();
		}
		else if(enemyTeam[actEnemy].frame > 2){
			playerFlinch();
			drawIdleEnemy(actEnemy);
			currentTurn++;
			beginTurnRotation();
		}
		enemyTeam[actEnemy].frame++;
	}, 200);
}

function enemyBuffSelf(buffFX){
	clearInterval(animateEnemy[actEnemy]);
	enemyTeam[actEnemy].frame = 0;
	var ctx = $(".enemy-ani-canvas")[actEnemy].getContext("2d");
	animateEnemy[actEnemy] = setInterval(function(){
		ctx.clearRect(0, 0, 800, 600);
		ctx.drawImage(enemyTeam[actEnemy].image, enemyTeam[actEnemy].frame*200, 800, 200, 200, 205+actEnemy*130, 150, 200, 200)
		enemyTeam[actEnemy].frame++;
		if(enemyTeam[actEnemy].frame === 3){
			buffFX();
		}
		else if(enemyTeam[actEnemy].frame > 3){
			drawIdleEnemy(actEnemy);
			currentTurn++;
			beginTurnRotation();
		}
	}, 150);
}

function playerFlinch(){
	flinchOK = false;
	clearInterval(animatePlayer);
	var ctx = $("#player-ani-canvas")[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 600);
	ctx.drawImage(playerImg, 1000, 200, 200, 200, player.dx, 150, 200, 200);
	if(player.hpCurr < 0){
		player.hpCurr = 0;
	}
	refreshHeroDisplay();
	floatPlayerDamage();
	setTimeout(function(){
		if(player.hpCurr <= 0){
			player.frame = 10;
			animatePlayer = setInterval(function(){
				player.frame--;
				ctx.globalAlpha = player.frame/10;
				ctx.clearRect(0, 0, 800, 600);
				ctx.drawImage(playerImg, 1000, 200, 200, 200, player.dx, 150, 200, 200);
				if(player.frame <= 0){
					clearInterval(animatePlayer);
					alert("GAME OVER!");
				}
			}, 60);
		}
		else{
			drawIdlePlayer();
		flinchOK = true;
		}
	}, 30);
}


// END ENCOUNTER
function endEncounter(){
	// Refresh turn order
	turnOrder = [];
	// Grant exp to player
	player.exp += expPool;
	expPool = 0;
	if(player.exp >= 75 && player.level === 4){
		return openLevelUpWindow();
	}
	else if(player.exp >= 35 && player.level === 3){
		return openLevelUpWindow();
	}
	else if(player.exp >= 15 && player.level === 2){
		return openLevelUpWindow();
	}
	else if(player.exp >= 5 && player.level === 1){
		return openLevelUpWindow();
	}
	else{
		setTimeout(function(){
			openBattleSubHeader("Click anywhere to continue...", 2500);
			$("#game-screen").on("click", openWorldMap);
		}, 50);
	}
}

// LEVEL UP
$("#choice1").on("click", function(){
	levelUp(0)
});
$("#choice2").on("click", function(){
	levelUp(1)
});
$("#choice3").on("click", function(){
	levelUp(2)
});

function openLevelUpWindow(){
	for(i = 0; i < 3; i++){
		var p = masterPathList[player.path].nextPath[i];
		$("#choice"+(i+1)).addClass(masterPathList[p].className);
	}
	setIconImages();
	$("#level-up-panel").removeClass("hidden");
}

function levelUp(newPathChoice){
	$("#level-up-panel").addClass("hidden");
	for(i = 0; i < 3; i++){
		$("#choice"+(i+1)).removeClass();
	}
	player.path = masterPathList[player.path].nextPath[newPathChoice];
	increaseStats();
	var locked = $(".locked-ability");
	$(locked[player.level-1]).addClass(
		masterPathList[player.path].className
	).removeClass(
		"hidden"
	);
	setIconImages();
	player.level = masterPathList[player.path].lv;
	endEncounter();
}

function openWorldMap(){
	$("#game-screen").off("click", openWorldMap);
	var ctx = $("#transition-canvas")[0].getContext("2d");
	ctx.globalAlpha = 0;
	ctx.fillStyle = "black";
	transitionCount = 0;
	$("#transition-canvas").removeClass("hidden");
	var transition = setInterval(function(){
		transitionCount++;
		ctx.globalAlpha = transitionCount/10;
		ctx.clearRect(0, 0, 800, 600);
		ctx.fillRect(0, 0, 800, 600);
		if(transitionCount === 10){
			clearInterval(transition);
			$("#battlefield").addClass("hidden");
			$("#world-map").removeClass("hidden");
			transition = setInterval(function(){
				transitionCount--;
				ctx.globalAlpha = transitionCount/10;
				ctx.clearRect(0, 0, 800, 600);
				ctx.fillRect(0, 0, 800, 600);
				if(transitionCount === 0){
					clearInterval(transition);
					$("#transition-canvas").addClass("hidden");
					movementOn = true;
				}
			}, 50);
		}
	}, 50);
}

////////////////////////////////////////////////////////
// 05 - Map and overworld movement
////////////////////////////////////////////////////////
// var oldMap = [
// 	[ // room 0
// 		[0, "E00", 1, 0, 0, 0, 1, 0, 0, "D01A", 1, 0, 0, 0, 0, 1],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
// 		[1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
// 		[1, "E00", 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
// 		[0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
// 		[0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0],
// 		[0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
// 		[1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
// 		[1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
// 		[0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
// 		[0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
// 	],
// 	[ // room 1
// 		[0, 0, 0, 0, 0, 0, 0, 0],
// 		[0, 0, 1, 0, 0, 2, 0, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 0],
// 		[0, 0, 0, 0, 0, 0, 0, 0],
// 		[0, 0, 1, 0, 0, 1, 0, 0],
// 		["D00A", 0, 0, 1, 1, 0, 0, 0]
// 	]
// ];

var map = [
	[  // room 0
		[1, 1, 1, 1, 1, "D03Q", 1, "D03N", 1, "D01P", 1, "D03O", 1, 1, "D01T", 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
		[1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, "D02D"],
		[1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
		[1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, "D02C"],
		[1, 0, 0, "E00", 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, "E01", 0, 0, "E02", 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 1, "D01E", 1, 1, "D01R", 1, "D01A", 1, 1, 1, 1, 1, "D01B", 1, 1]
	],
	[  // room 1
		[1, 1, "D00E", 1, 1, "D00R", 1, "D00A", 1, 1, 1, 1, 1, "D00B", 1, 1],
		[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, "D03G"],
		[1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
		[1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, "D03H"],
		[1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		["D03J", 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, "D00P", 1, 1, 1, 1, "D00T", 1]
	],
	[ // room 2
		[1, 1, 1, 1, 1, 1, 1, 1, "D03S", 1, 1, 1, 1, 1, 1, 1],
		["D00D", 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
		[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
		["D00C", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
		[1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1],
		[1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
		[1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1],
		[1, 1, "D03M", 1, "D03L", 1, 1, 1, "D03K", 1, 1, "D03I", 1, 1, "D03F", 1]
	],
	[ // room 3
		[1, 1, 1, 1, "D00O", 1, "D02L", 1, "D02M", 1, 1, "D02I", 1, 1, "D02F", 1],
		[1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		["D01G", 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, "D01J"],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		["D01H", 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 2, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
		[1, "D00Q", 1, 1, 1, "D00N", 1, 1, "D02S", 1, 1, 1, "D02K", 1, 1, 1]
	]
];


function unitSize(){
	if(800/map[room][0].length === 600/map[room].length){
		return 600/map[room].length;
	}
	else{
		return console.log("Units are not square!");
	}
}

function drawMap(){
	var ctx = $("#map-canvas")[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 600);
	for(row = 0; row < map[room].length; row++){
		for(col = 0; col < map[room][row].length; col ++){
			if(map[room][row][col] === 1){
				ctx.fillStyle = "black";
				ctx.fillRect(col*unitSize(), row*unitSize(), unitSize(), unitSize());
			}
			else if(map[room][row][col] === 2){
				ctx.fillStyle = "cornflowerblue";
				ctx.fillRect(col*unitSize(), row*unitSize(), unitSize(), unitSize());
			}
			else if(typeof(map[room][row][col]) === "string"){
				if(map[room][row][col].charAt(0) === "D"){
					ctx.fillStyle = "brown";
					ctx.fillRect(col*unitSize(), row*unitSize(), unitSize(), unitSize());
				}
			}
		}
	}
}

function drawPlayerIcon(){
	var ctx = $("#player-canvas")[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 600);
	ctx.fillStyle = "red";
	ctx.drawImage(playerIcon, player.step*50, player.direction*50, 50, 50, player.x*unitSize(), player.y*unitSize(), unitSize(), unitSize());
}

function hidePlayerIcon(){
	var ctx = $("#player-canvas")[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 600);
}

function drawTransition(midFunc, endFunc){
	movementOn = false;
	$("#transition-canvas").removeClass("hidden");
	var ctx = $("#transition-canvas")[0].getContext("2d");
	ctx.fillStyle = "cornflowerblue";
	transitionCount = 0;
	ctx.globalAlpha = 1;
	var transition = setInterval(function(){
		transitionCount++;
		ctx.beginPath();
		ctx.moveTo(400, 300);
		ctx.arc(400, 300, 500, 0, transitionCount*0.1*Math.PI);
		ctx.lineTo(400, 300);
		ctx.fill();
		if(transitionCount === 23){
			clearInterval(transition)
			transitionCount = 10;
			midFunc();
			transition = setInterval(function(){
				transitionCount -= 1;
				ctx.clearRect(0, 0, 800, 600);
				ctx.globalAlpha = transitionCount/10;
				ctx.fillRect(0, 0, 800, 600);
				if(transitionCount <= 0){
					clearInterval(transition);
					ctx.globalAlpha = 1;
					transitionCount = 0;
					$("#transition-canvas").addClass("hidden");
					setTimeout(function(){
						endFunc();
					}, 50)
				}
			}, 50);
		}
	}, 50);
}

function movePlayer(xAxis, yAxis){
	if(player.y + yAxis < map[room].length && player.y + yAxis >= 0){
		if(map[room][player.y + yAxis][player.x + xAxis] === 0 ||
			map[room][player.y + yAxis][player.x + xAxis] === 2 ||
			typeof(map[room][player.y + yAxis][player.x + xAxis]) === "string")
		{
			movementOn = false;
			var moveCount = 0;
			var aniPlayerIcon = setInterval(function(){
				moveCount += 1;
				player.x += xAxis/10;
				player.y += yAxis/10;
				if(moveCount > 2 && moveCount < 8){
					player.step = 1;
				}
				else if(moveCount === 10){
					clearInterval(aniPlayerIcon);
					player.x = Math.round(player.x);
					player.y = Math.round(player.y);
					checkPlayerTerrain();
				}
				else{
					player.step = 0;
				}
				drawPlayerIcon()
			}, 20);
		}
	}
}

function checkPlayerTerrain(){
	var terrain = map[room][player.y][player.x];
	// if(terrain === 2){
	// 	drawTransition();
	// }
	if(typeof(terrain) === "string"){
		if(terrain.charAt(0) === "D"){
			openDoor(Number(terrain.charAt(1) + terrain.charAt(2)), terrain.charAt(3))
			console.log(Number(terrain.charAt(1) + terrain.charAt(2)), terrain.charAt(3))
		}
		if(terrain.charAt(0) === "E"){
			beginEncounter(Number(terrain.charAt(1) + terrain.charAt(2)));
			map[room][player.y][player.x] = 0;
		}
	}
	else{
		movementOn = true;
	}
}

function openDoor(newRoom, door){
	movementOn = false;
	for(row = 0; row < map[newRoom].length; row++){
		for(col = 0; col < map[newRoom][row].length; col++){
			if(typeof(map[newRoom][row][col]) === "string"){
				if(map[newRoom][row][col].charAt(0) === "D"){
					if(map[newRoom][row][col].charAt(3) === door){
						var newRow = row;
						var newCol = col;
						// begin transition animation
						$("#transition-canvas").removeClass("hidden");
						var ctx = $("#transition-canvas")[0].getContext("2d");
						ctx.fillStyle = "gray";
						ctx.globalAlpha = 1;
						transitionCount = 0;
						var transition = setInterval(function(){
							ctx.fillRect(0, 0, transitionCount*30, 600);
							transitionCount += 1;
							if((transitionCount - 1)*30 >= 800){
								clearInterval(transition);
								transitionCount = 0;
								room = newRoom;
								drawMap();
								player.x = newCol;
								player.y = newRow;
								drawPlayerIcon();
								transition = setInterval(function(){
									ctx.clearRect(0, 0, transitionCount*30, 600);
									transitionCount += 1;
									if((transitionCount - 1)*30 >= 800){
										clearInterval(transition);
										transitionCount = 0;
										movementOn = true;
									}
								}, 20);
							}
						}, 20);
					}
				}
			}
		}
	}
}

// Movement keys
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
			player.direction = 0;
			movePlayer(-1, 0);
		}    
		else if (keyState[39] || keyState[68]){
			player.direction = 2;
			movePlayer(1, 0);
		}
		else if (keyState[38] || keyState[87]){
			player.direction = 1;
			movePlayer(0, -1);
		}
		else if (keyState[40] || keyState[83]){
			player.direction = 3;
			movePlayer(0, 1);
		}
	}
	setTimeout(checkKeyPress, 10);
}

// Prevent arrow keys from scrolling down
// http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser



////////////////////////////////////////////////////////
// 06 - Load screen and initialize
////////////////////////////////////////////////////////
function nullFunc(){}

function drawLoadScreen(){
	var ctx = $("#load-canvas")[0].getContext("2d");
	ctx.fillStyle = "burlyWood";
	ctx.fillRect(0, 0, 800, 600);
	ctx.font = "42px Arial";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.fillText("PATH OF THE KING", 400, 200);
	ctx.font = "24px Arial";
	ctx.fillText("Click anywhere to begin", 400, 300);
	$("#load-canvas").on("click", function(){
		loadGame();
		ctx.fillText("Loading...", 400, 400);
		setTimeout(function(){
			$("#load-canvas").addClass("hidden");
		}, 100);
	});
}

function drawBackground(){
	var ctx = $("#background-canvas")[0].getContext("2d");
	for(i = 0; i < 6; i++){
		ctx.drawImage(hallwayPanel, 0, 0, 150, 400, i*150, 0, 150, 400);
	}
	ctx.drawImage(lowerPanel, 0, 0, 3333, 833, 0, 400, 800, 200)
}

function loadGame(){
	drawMap();
	drawPlayerIcon();
	drawBackground();
	checkKeyPress();
	setIconImages();
}

// Initialize
drawLoadScreen();
