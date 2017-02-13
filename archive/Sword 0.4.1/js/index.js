// THINGS TO FIX
// fix table of contents

/////////////////////////////////
// Table of Contents

/////////////////////////////////

/////////////////////////////////
// 001 - Setup Selectors       //
/////////////////////////////////
// Hero
var heroNameHUD = document.querySelectorAll(".heroName");
var hpCurrentHUD = document.querySelectorAll(".hpCurrent");
var hpTotalHUD = document.querySelectorAll(".hpTotal");
var mpCurrentHUD = document.querySelectorAll(".mpCurrent");
var mpTotalHUD = document.querySelectorAll(".mpTotal");
var heroPathHUD = document.querySelectorAll(".heroPath")
var speedHUD = document.querySelectorAll(".speed");
var wepDefHUD = document.querySelectorAll(".wepDef");
var magDefHUD = document.querySelectorAll(".magDef");
var statusHUD = document.querySelectorAll(".status");
var levelHUD = document.querySelectorAll(".level");
var expToLvllHUD = document.querySelectorAll(".expToLvl");
var heroCanvas = document.querySelectorAll(".heroCanvas");

// Enemies
var enemyNameHUD = document.querySelectorAll(".enemyName");
var enemyHPCurrentHUD = document.querySelectorAll(".enemyHPCurrent");
var enemyHPTotalHUD = document.querySelectorAll(".enemyHPTotal");
var enemySpeedHUD = document.querySelectorAll(".enemySpeed");
var enemyWepDefHUD = document.querySelectorAll(".enemyWepDef");
var enemyMagDefHUD = document.querySelectorAll(".enemyMagDef");
var enemyStatusHUD = document.querySelectorAll(".enemyStatus");
var enemyTarget = document.querySelectorAll(".enemyTarget");
var enemyCanvas = document.querySelectorAll(".enemyCanvas");

// Interface
var loadCanvas = document.querySelector("#loadCanvas");
var backgroundCanvas = document.querySelector("#background");
var statCanvas = document.querySelector("#statCanvas");
var popCanvas = document.querySelectorAll(".popCanvas");
var expCanvas = document.querySelector("#expCanvas");
var healCanvas = document.querySelector("#healCanvas");
var popUp = document.querySelectorAll(".popUp");
var fxCanvas = document.querySelector("#fxCanvas");
var abilityBlock = document.querySelectorAll(".abilityBlock");
var abilityDescrip = document.querySelectorAll(".abilityDescrip");
var pathChoice = document.querySelectorAll(".pathChoice");
var popUpPathName = document.querySelector("#popUpPathName");

/////////////////////////////////
// 002 - Setup Images          //
/////////////////////////////////
// HERO FRAME SETUP
var heroFrame = new Image(2400, 200);
heroFrame.src = "images/player/player_strip_2.png";

// ABILITY Icon SETUP
var abilityIcons = [];
for(i = 0; i < 34; i++){
	abilityIcons.push(new Image(70, 70));
}
abilityIcons[0].src = "images/icons/advance.png";
abilityIcons[1].src = "images/icons/slice.png";
abilityIcons[2].src = "images/icons/burst.png";
abilityIcons[3].src = "images/icons/heal.png";

// ENEMY FRAME SETUP
var enemyFrame = [];
for(i = 0; i < 3; i++){
	enemyFrame.push(new Image(2400, 200));
}
enemyFrame[0].src = "images/placeholder/placeholder_strip.png";
enemyFrame[1].src = "images/goblin/goblin_strip.png";
enemyFrame[2].src = "images/bird/bird_strip.png";

// MAGIC FX SETUP
var burstFX = new Image(1200, 200);
burstFX.src = "images/effects/burst_strip.png";

// BACKGROUND/HUD SETUP
var backgroundFrame = new Image(150, 400);
var statBoxImage = new Image(258, 73);
statBoxImage.src = "images/other/hero_stat_banner.png";


/////////////////////////////////
// 003 - Setup Event Listeners //
/////////////////////////////////
function turnOnMovementButton(){
	document.querySelector("#buttonAdvance").addEventListener("click", advance);
}
function turnOffMovementButton(){
	document.querySelector("#buttonAdvance").removeEventListener("click", advance);
}
function turnOnAttackButtons(){
	document.querySelector("#buttonSlice").addEventListener("click", playerSlice);
	document.querySelector("#buttonBurst").addEventListener("click", playerBurst);
	document.querySelector("#buttonHeal").addEventListener("click", playerHeal);
}
function turnOffAttackButtons(){
	document.querySelector("#buttonSlice").removeEventListener("click", playerSlice);
	document.querySelector("#buttonBurst").removeEventListener("click", playerBurst);
	document.querySelector("#buttonHeal").removeEventListener("click", playerHeal);
}
// Hover over effects for ability icons
for(i = 0; i < abilityBlock.length; i++){
	abilityBlock[i].addEventListener("mouseover", function(){
		for(i = 0; i < abilityBlock.length; i++){
			if(abilityBlock[i] === this){
				abilityDescrip[i].classList.remove("hidden"); 
			}
		}
	});
	abilityBlock[i].addEventListener("mouseout", function(){
		for(i = 0; i < abilityBlock.length; i++){
			if(abilityBlock[i] === this){
				abilityDescrip[i].classList.add("hidden"); 
			}
		}
	});
}
for(i = 0; i < pathChoice.length; i++){
	pathChoice[i].addEventListener("mouseover", function(){
		for(i = 0; i < abilityIcons.length; i++){
			if(abilityIcons[i].src === this.src){
				abilityDescrip[i].classList.remove("hidden");
				popUpPathName.innerHTML = pathList[i].name;
			}
		}
	});
	pathChoice[i].addEventListener("mouseout", function(){
		for(i = 0; i < abilityIcons.length; i++){
			if(abilityIcons[i].src === this.src){
				abilityDescrip[i].classList.add("hidden");
				popUpPathName.innerHTML = "";
			}
		}
	});
	pathChoice[i].addEventListener("click", function(){
		for(i = 0; i < abilityIcons.length; i++){
			if(abilityIcons[i].src === this.src){
				return selectNewPath(i); 
			}
		}
	});
}

/////////////////////////////////
// 004 - Advance               //
/////////////////////////////////
var stepsWalked = 0;
var distanceToEncounter = 700;
var backgroundRefresh = 0;
var advanceHero
function advance(){
	turnOffMovementButton();
	setStatBox();
	clearInterval(idleHero);
	var f = 4;
	advanceHero = setInterval(function(){
		heroGetFrame(f, 0);
		setBackground(backgroundRefresh);
		stepsWalked += 1;
		distanceToEncounter -= 1;
		if(stepsWalked % 20 === 0){
			f += 1;
		}
		if(f > 7){
			f = 4;
		}
		backgroundRefresh += 1;
		if(backgroundRefresh % 150 === 0){
			backgroundRefresh = 0;
		}
		if(distanceToEncounter === 0){
			clearInterval(advanceHero);
			beginEncounter();
		}
	}, 15);
}

/////////////////////////////////
// 005 - Hero variables & functions  //
/////////////////////////////////
var hero = {
	name: "Hero",
	type: "hero",
	hpCurrent: 25,
	hpTotal: 25,
	mpCurrent: 10,
	mpTotal: 10,
	mpRegen: 1,
	speed: 2,
	wepDef: 0,
	magDef: 0,
	exp: 0,
	level: 1,
	path: 0,
}

// key: ["Name", damage, mpcost, type]
function playerSlice(){
	playerAttack("Slice", 3, 0, "physical");
}

function playerBurst(){
	imgFX = burstFX;
	playerAttack("Burst", 5, 3, "magic");
}

function playerHeal(){
	if(hero.mpCurrent - 6 < 0){
		alert("Not enough magic!");
	} else{
		hero.mpCurrent -= 6;
		if(hero.hpCurrent + 10 > hero.hpTotal){
			var healValue = hero.hpTotal - hero.hpCurrent;
			hero.hpCurrent = hero.hpTotal;
		} else{
			hero.hpCurrent += 10;
			var healValue = 10;
		}
		refreshHeroDisplay();
		healAlert(healValue);
		console.log("Player healed 10 hp");
		currentTurn += 1;
		beginTurnRotation();
	}
}

function refreshHeroDisplay(){
	heroNameHUD[0].innerHTML = hero.name;
	hpCurrentHUD[0].innerHTML = hero.hpCurrent;
	hpTotalHUD[0].innerHTML = hero.hpTotal;	
	mpCurrentHUD[0].innerHTML = hero.mpCurrent;
	mpTotalHUD[0].innerHTML = hero.mpTotal;
	heroPathHUD[0].innerHTML = pathList[hero.path].name;
	speedHUD[0].innerHTML = hero.speed;
	wepDefHUD[0].innerHTML = hero.wepDef;
	magDefHUD[0].innerHTML = hero.magDef;
	levelHUD[0].innerHTML = hero.level;
	expToLvllHUD[0].innerHTML = expToLevelCalculate();
}

function expToLevelCalculate(){
	// to modify for multiple heroes, add in argument for function
	if(hero.level === 1){
		return 5 - hero.exp;
	}
	if(hero.level === 2){
		return 15 - hero.exp;
	}
	if(hero.level === 3){
		return 30 - hero.exp;
	}
	if(hero.level === 4){
		return 50 - hero.exp;
	}
	if(hero.level === 5){
		return "Max level!";
	}
}

var attackName
var attackDamage
var attackMPCost
var attackType
var playerIsAttacking = false;
var imgFX

function playerAttack(name, damage, mpcost, type){
	console.log("Attack selected: " + name)
	attackName = name;
	attackDamage = damage;
	attackMPCost = mpcost;
	attackType = type;
	turnOnTargetButtons();
}

function turnOnTargetButtons(){
	if(enemyTeam[0].hpCurrent > 0){
		enemyTarget[0].addEventListener("click", setTarget0);
	}
	if(enemyTeam.length > 1){
		if(enemyTeam[1].hpCurrent > 0){
			enemyTarget[1].addEventListener("click", setTarget1);
		}
	}
	if(enemyTeam.length > 2){
		if(enemyTeam[2].hpCurrent > 0){
			enemyTarget[2].addEventListener("click", setTarget2);
		}
	}
	if(enemyTeam.length > 3){
		if(enemyTeam[3].hpCurrent > 0){
			enemyTarget[3].addEventListener("click", setTarget3);
		}
	}
}

function turnOffTargetButtons(){
	enemyTarget[0].removeEventListener("click", setTarget0);
	enemyTarget[1].removeEventListener("click", setTarget1);
	enemyTarget[2].removeEventListener("click", setTarget2);
	enemyTarget[3].removeEventListener("click", setTarget3);
}

function setTarget0(){
	playerIsAttacking = true;
	if(attackType === "physical"){
		heroMoveToTarget(140, 0);
	} else if(attackType === "magic"){
		heroAnimateMagic(0);
	}
}
function setTarget1(){
	playerIsAttacking = true;
	if(attackType === "physical"){
		heroMoveToTarget(270, 1);
	} else if(attackType === "magic"){
		heroAnimateMagic(1);
	}
}
function setTarget2(){
	playerIsAttacking = true;
	if(attackType === "physical"){
		heroMoveToTarget(400, 2);
	} else if(attackType === "magic"){
		heroAnimateMagic(2);
	}
}
function setTarget3(){
	playerIsAttacking = true;
	if(attackType === "physical"){
		heroMoveToTarget(530, 3);
	} else if(attackType === "magic"){
		heroAnimateMagic(3);
	}
}

var moveHero // interval for moving hero to target
var heroScreenLocation = 0;
function heroMoveToTarget(targetLocation, targetNum){
	clearInterval(idleHero);
	clearInterval(moveHero);
	var f = 4;
	moveHero = setInterval(function(){
		// if moving forward
		if(heroScreenLocation < targetLocation){
			heroScreenLocation += 1;
			if(heroScreenLocation % 20 === 0){
				f += 1;
				if(f > 7){
					f = 4;
				}
			}
			heroGetFrame(f, heroScreenLocation);
		// if moving backward
		} else if(heroScreenLocation > targetLocation){
			heroScreenLocation -= 1;
			if(heroScreenLocation % 20 === 0){
				f += 1;
				if(f > 7){
					f = 4;
				}
			}
			heroGetFrame(f, heroScreenLocation);
		} else if(heroScreenLocation === targetLocation){
			clearInterval(moveHero);
			if(playerIsAttacking === true){
				heroAnimateWeapon(targetNum)
			} else{
				heroIdleAnimation(heroScreenLocation);
				currentTurn += 1;
				beginTurnRotation();
			}
		}
	}, 15);
}

var attackHero;
function heroAnimateWeapon(targetNum){
	var f = 8;
	var fStep = 0;
	attackHero = setInterval(function(){
		heroGetFrame(f, heroScreenLocation);
		fStep += 1;
		if(fStep < 4){
			f += 1;
		} else if(fStep === 4){
			executeAttack(targetNum);
			f = 8;
		} else if(fStep > 4){
			clearInterval(attackHero);
			heroMoveToTarget(0, 0);
		}
	}, 300);		
}

var animateMagic
function heroAnimateMagic(targetNum){
	f = 0;
	var ctx = fxCanvas.getContext("2d");
	animateMagic = setInterval(function(){
		ctx.clearRect(0, 0, 800, 350);
		ctx.drawImage(imgFX, f * 200, 0, 200, 200, 180 + targetNum * 130, 150, 200, 200);
		f += 1;
		if(f > 6){
			clearInterval(animateMagic)
			executeAttack(targetNum);
			currentTurn += 1;
			beginTurnRotation()
		}
	}, 200);
}



function executeAttack(target){
	if(hero.mpCurrent - attackMPCost < 0){
		return alert("Not enough magic!");
	}
	turnOffAttackButtons();
	turnOffTargetButtons();
	console.log("Player used " + attackName + " on " + enemyTeam[target].name);
	hero.mpCurrent -= attackMPCost;
	refreshHeroDisplay();
	var initEnemyHP = enemyTeam[target].hpCurrent;
	// animate
	if(attackType === "physical"){
		if(enemyTeam[target].hpCurrent - Math.floor(attackDamage * ((100 - enemyTeam[target].wepDef) / 100)) < 0){
			enemyTeam[target].hpCurrent = 0;
		} else{
			enemyTeam[target].hpCurrent -= Math.floor(attackDamage * ((100 - enemyTeam[target].wepDef) / 100));
		}
	}
	else if(attackType === "magic"){
		if(enemyTeam[target].hpCurrent - Math.floor(attackDamage * ((100 - enemyTeam[target].magDef) / 100)) < 0){
			enemyTeam[target].hpCurrent = 0;
		} else{
			enemyTeam[target].hpCurrent -= Math.floor(attackDamage * ((100 - enemyTeam[target].magDef) / 100));
		}
	}
	else{
		return alert("error! -- attack has no type")
	}
	// refreshEnemyDisplay();
	console.log(attackName + " did " + (initEnemyHP - enemyTeam[target].hpCurrent) + " damage");
	popAlert(initEnemyHP - enemyTeam[target].hpCurrent, target, 1);
	if(enemyTeam[target].hpCurrent === 0){
		console.log(enemyTeam[target].name + " has been killed!");
		enemyTarget[target].src = "";
		expGain(enemyTeam[target].exp);
		expAlert(enemyTeam[target].exp);
	}
	playerIsAttacking = false;
}

/////////////////////////////////
// 006 - Level Up System       //
/////////////////////////////////
var initLevel;
function expGain(value){
	hero.exp += value;
	if(hero.exp >= 5 && hero.level <= 1){
		hero.level = 2;
	}
	if(hero.exp >= 15 && hero.level <= 2){
		hero.level = 3;
	}
	if(hero.exp >= 30 && hero.level <= 3){
		hero.level = 4;
	}
	if(hero.exp >= 50 && hero.level <= 4){
		hero.level = 5;
	}
	refreshHeroDisplay();
	console.log("Player gains " + value + " exp")
}

var pathSelection = [0, 0, 0];
function levelUp(){
	for(i = 0; i < pathChoice.length; i++){
		pathSelection[i] = pathList[hero.path].nextPaths[i];
		pathChoice[i].src = abilityIcons[pathSelection[i]].src;
	}
	for(i = 0; i < popUp.length; i++){
		popUp[i].classList.remove("hidden");
	}
}

function selectNewPath(newPath){
	hero.path = newPath;
	hero.hpTotal += pathList[newPath].hpGain;
	hero.hpCurrent += pathList[newPath].hpGain;
	hero.mpTotal += pathList[newPath].magGain;
	hero.mpCurrent += pathList[newPath].magGain;
	hero.wepDef += pathList[newPath].wepDefGain;
	hero.magDef += pathList[newPath].magDefGain;
	hero.speed += pathList[newPath].speedGain;
	hero.mpRegen += pathList[newPath].mpRegenGain;
	initLevel = hero.level
	for(i = 0; i < popUp.length; i++){
		popUp[i].classList.add("hidden");
	}
	refreshHeroDisplay();
	beginTurnRotation();
}

var pathList = [
	{
		index: 0,
		level: 1,
		name: "Path of the Novice",
		nextPaths: [1, 2, 3]
	},
	{
		index: 1,
		level: 2,
		name: "Path of the Fox",
		skillName: "Quick Slice",
		skillDescrip: "",
		hpGain: 0,
		magGain: 0,
		wepDefGain: 0,
		magDefGain: 0,
		speedGain: 0,
		mpRegenGain: 0,
		nextPaths: [4, 5, 9]
	}
];

/////////////////////////////////
// 007 - Enemy variables & functions //
/////////////////////////////////
var enemy = [
	{
		index: 0,
		name: "placeholder",
		type: "enemy",
		hpCurrent: 0,
		hpTotal: 0,
		speed: 0,
		wepDef: 0,
		magDef: 0,
		attackChance: [],
		attackFunc: [],
		exp: 0,
		location: 0
	},
	{
	index: 1,
	name: "Goblin",
	type: "enemy",
	hpCurrent: 6,
	hpTotal: 6,
	speed: 1,
	wepDef: 0,
	magDef: 0,
	attackChance: [20, 100],
	attackFunc: [enemySqueal, enemyAxeSwing],
	exp: 5,
	location: 0,
	},
	{
	index: 2,
	name: "Bird",
	type: "enemy",
	hpCurrent: 3,
	hpTotal: 3,
	speed: 4,
	wepDef: 50,
	magDef: 0,
	attackChance: [20, 45, 100],
	attackFunc: [enemyFlyAway, enemyPeck, enemyFlap],
	exp: 5,
	location: 0,
	}
];

var enemyAttackName;
var enemyAttackDamage;
var enemyAttackType;
var enemyIsAttacking = false;
var enemyXAdjust = [0, 0, 0, 0];
var enemyYAdjust = [0, 0, 0, 0];


function enemySqueal(){
	enemyAttackName = "Squeal";
	enemyAttackDamage = 2;
	enemyAttackType = "physical";
	enemyIsAttacking = true;
	enemyMoveToTarget(turnOrder[currentTurn].location, 40);
}

function enemyAxeSwing(){
	enemyAttackName = "Axe Swing";
	enemyAttackDamage = 4;
	enemyAttackType = "physical";
	enemyIsAttacking = true;
	enemyMoveToTarget(turnOrder[currentTurn].location, 40);
}

// To access active enemy: turnOrder[currentTurn].location
var enemyFlight;
function enemyFlyAway(){
	var f = 4;
	var enemyNum = turnOrder[currentTurn].location;
	clearInterval(idleEnemy[enemyNum]);
	enemyFlight = setInterval(function(){
		enemyYAdjust[enemyNum] -= 1;
		enemyXAdjust[enemyNum] += 1;
		if(enemyYAdjust[enemyNum] % 20 === 0){
			f += 1;
			if(f > 7){
				f = 4;
			}
		}
		enemyGetFrame(enemyNum, f)
		if(enemyYAdjust[enemyNum] === -300){
			clearInterval(enemyFlight);
			enemyTeam[enemyNum].hpCurrent = 0;
			console.log("Enemy flew away!");
			currentTurn += 1;
			beginTurnRotation();
		}
	}, 15);
}

function enemyPeck(){
	enemyAttackName = "Peck";
	enemyAttackDamage = 4;
	enemyAttackType = "physical";
	enemyIsAttacking = true;
	enemyMoveToTarget(turnOrder[currentTurn].location, 40);
}

function enemyFlap(){
	enemyAttackName = "Flap";
	enemyAttackDamage = 3;
	enemyAttackType = "physical";
	enemyIsAttacking = true;
	enemyMoveToTarget(turnOrder[currentTurn].location, 40);
}


/////////////////////////////////
// 008 - Enemy attack sequence //
/////////////////////////////////

function randomNumber(){
	return Math.ceil(Math.random() * 100)
}

function enemyTurn(enemyID, userLocation){ // index of var enemy
	if(enemyTeam[userLocation].hpCurrent != 0){
		console.log(enemy[enemyID].name + "'s turn");
		var random = randomNumber();
		for(i = 0; i < enemy[enemyID].attackChance.length; i++){
			if(random <= enemy[enemyID].attackChance[i]){
				// return enemyAttack(enemy[enemyID].attackList[i], enemy[enemyID].attackDamage[i], enemy[enemyID].attackType[i], userLocation);
				return enemy[enemyID].attackFunc[i]();
			}
		}
	} else{
		console.log(enemy[enemyID].name + " is dead and passes turn");
		currentTurn += 1;
		beginTurnRotation();
	}
}

var moveEnemy;
function enemyMoveToTarget(enemyNum, targetLocation){
	clearInterval(idleEnemy[enemyNum]);
	clearInterval(moveEnemy);
	var f = 4;
	moveEnemy = setInterval(function(){
		// if moving right
		if(180 + enemyNum * 130 + distanceToEncounter - enemyXAdjust[enemyNum] < targetLocation){
			enemyXAdjust[enemyNum] -= 1;
			if(enemyXAdjust[enemyNum] % 20 === 0){
				enemyXAdjust
				f += 1;
				if(f > 7){
					f = 4;
				}
			}
			enemyGetFrame(enemyNum, f);
		// if moving left
		} else if(180 + enemyNum * 130 - enemyXAdjust[enemyNum] > targetLocation){
			enemyXAdjust[enemyNum] += 1;
			if(enemyXAdjust[enemyNum] % 20 === 0){
				f += 1;
				if(f > 7){
					f = 4;
				}
			}
			enemyGetFrame(enemyNum, f);
		} else if(180 + enemyNum * 130 - enemyXAdjust[enemyNum] === targetLocation){
			clearInterval(moveEnemy);
			if(enemyIsAttacking === true){
				enemyAnimateWeapon(enemyNum);
			} else{
				enemyIdleAnimation(enemyNum);
				currentTurn += 1;
				beginTurnRotation();
			}
		}
	}, 15);
}

var attackEnemy;
function enemyAnimateWeapon(enemyNum){
	var f = 8;
	var fStep = 0;
	attackEnemy = setInterval(function(){
		enemyGetFrame(enemyNum, f);
		fStep += 1;
		if(fStep < 4){
			f += 1;
		} else if(fStep === 4){
			enemyAttack();
			f = 8;
		} else if(fStep > 4){
			clearInterval(attackEnemy);
			enemyMoveToTarget(enemyNum, 180 + enemyNum * 130);
		}
	}, 300);
}

function enemyAttack(){
	console.log(turnOrder[currentTurn].name + " used " + enemyAttackName);
	var initHeroHP = hero.hpCurrent;
	if(enemyAttackType === "physical"){
		if(hero.hpCurrent - Math.floor(enemyAttackDamage * ((100 - hero.wepDef) / 100)) < 0){
			hero.hpCurrent = 0;
		}
		else{
			hero.hpCurrent -= Math.floor(enemyAttackDamage * ((100 - hero.wepDef) / 100));
		}
	}
	else if(enemyAttackType === "magic"){
		if(hero.hpCurrent - Math.floor(enemyAttackDamage * ((100 - hero.magDef) / 100)) < 0){
			hero.hpCurrent = 0;
		}
		else{
			hero.hpCurrent -= Math.floor(enemyAttackDamage * ((100 - hero.magDef) / 100));
		}
	}
	refreshHeroDisplay();
	console.log(enemyAttackName + " did " + (initHeroHP - hero.hpCurrent) + " damage");
	popAlert(initHeroHP - hero.hpCurrent, 0, 0)
	if(hero.hpCurrent <= 0){
		console.log("GAME OVER!");
	}
	enemyIsAttacking = false;
}

/////////////////////////////////
// 009 -  Encounter setup      //
/////////////////////////////////
var encounterNumber = 0;
var encounterMasterList = [
	[1, 2, 0, 0],
	[1, 1, 1, 0],
];

var enemyTeam = [];
function setEnemyTeam(){
	enemyTeam = [
		Object.assign({}, enemy[encounterMasterList[encounterNumber][0]]),
		Object.assign({}, enemy[encounterMasterList[encounterNumber][1]]),
		Object.assign({}, enemy[encounterMasterList[encounterNumber][2]]),
		Object.assign({}, enemy[encounterMasterList[encounterNumber][3]])
	];
	for(i = 0; i < enemyTeam.length; i++){
		enemyTeam[i].location = i;
		enemyNameHUD[i].innerHTML = enemyTeam[i].name;
		enemyHPCurrentHUD[i].innerHTML = enemyHPTotalHUD[i].innerHTML = enemyTeam[i].hpCurrent;
		enemySpeedHUD[i].innerHTML = enemyTeam[i].speed;
		enemyWepDefHUD[i].innerHTML = enemyTeam[i].wepDef;
		enemyMagDefHUD[i].innerHTML = enemyTeam[i].magDef;
		enemyIdleAnimation(i);
	}
	setTurnOrder();
}

function refreshEnemyDisplay(){
	for(i = 0; i < enemyTeam.length; i++){
		enemyHPCurrentHUD[i].innerHTML = enemyTeam[i].hpCurrent;
		enemySpeedHUD[i].innerHTML = enemyTeam[i].speed;
		enemyWepDefHUD[i].innerHTML = enemyTeam[i].wepDef;
		enemyMagDefHUD[i].innerHTML = enemyTeam[i].magDef;
	}
}

/////////////////////////////////
// 010 - Begin encounter       //
/////////////////////////////////
function beginEncounter(){
	console.log("Begin encounter!");
	heroIdleAnimation(heroScreenLocation);
	beginTurnRotation();
}

var turnOrderPrelim = [];
var turnOrder = [];

function setTurnOrder(){
	turnOrderPrelim = [hero];
	turnOrder = [];
	for(i = 0; i < enemyTeam.length; i++){
		turnOrderPrelim.push(enemyTeam[i])
	}
	while(turnOrderPrelim.length > 0){
		var highest = turnOrderPrelim[0].speed;
		var highestIndex = 0;
		for(i = 1; i < turnOrderPrelim.length; i++){
			if(turnOrderPrelim[i].speed > highest){
				highestIndex = i;
				highest = turnOrderPrelim[i].speed;
			}
		}
		turnOrder.push(turnOrderPrelim[highestIndex]);
		turnOrderPrelim.splice(highestIndex, 1);
	}
}

var encounterActive = false;
var currentTurn = 0;

function beginTurnRotation(){
	if(hero.level > initLevel){
		console.log("Player grew to level " + hero.level);
		return levelUp();
	}
	if(checkIfAllEnemiesDead() === 0){
		encounterActive = false;
		console.log("End of encounter");
		for(i = 0; i < enemyTeam.length; i++){
			clearInterval(idleEnemy[i]);
		}
		enemyXAdjust = [0, 0, 0, 0];
		enemyYAdjust = [0, 0, 0, 0];
		idleEnemy = [,,,];
		currentTurn = 0;
		encounterNumber += 1;
		distanceToEncounter = 200;
		setEnemyTeam();
		turnOnMovementButton();
		return console.log("Encounter complete!");
	}
	encounterActive = true;
	if(currentTurn < turnOrder.length){
		if(turnOrder[currentTurn].type === "hero"){
			return playerTurn();
		} else{
			return enemyTurn(turnOrder[currentTurn].index, turnOrder[currentTurn].location);
		}
	}
	if(encounterActive === true){
		console.log("End of turn cycle")
		currentTurn = 0;
		beginTurnRotation();
	}
}

// Set turn types
function playerTurn(){
	if(hero.mpCurrent + hero.mpRegen > hero.mpTotal){
		hero.mpCurrent = hero.mpTotal;
	} else{
		hero.mpCurrent += hero.mpRegen;
	}
	initLevel = hero.level
	refreshHeroDisplay();
	console.log("Player regenerated " + hero.mpRegen + " magic")
	console.log("Player's turn");
	turnOnAttackButtons();
}

function checkIfAllEnemiesDead(){
	var heartbeat = 0;
	for(i = 0; i < enemyTeam.length; i++){
		if(enemyTeam[i].hpCurrent > 0){
			heartbeat += 1;
		}
	}
	return heartbeat
}

/////////////////////////////////
// 011 - Setup images and animate //
/////////////////////////////////
var idleHero
function heroIdleAnimation(location){
	clearInterval(advanceHero);
	var f = 0;
	idleHero = setInterval(function(){
		heroGetFrame(f, location);
		f += 1;
		if(f > 3){
			f = 0;
		}
	}, 300); 
}

function heroGetFrame(frame, location){
	var ctx = heroCanvas[0].getContext("2d");
	ctx.clearRect(0, 0, 800, 350);
// dragImage(img, sourcex, sourcey, sourcewidth, sourceheight, destx, desty, destwidth, destheight)
	ctx.drawImage(heroFrame, frame * 200, 0, 200, 200, location, 150, 200, 200)
}



var idleEnemy = [,,,];
function enemyIdleAnimation(enemyNum){
	var f = 0;
	var fInterval = 0;
	idleEnemy[enemyNum] = setInterval(function(){
		enemyGetFrame(enemyNum, f);
		fInterval += 1;
		if(fInterval % 20 === 0){
			f += 1;
		}
		if(f > 3){
		f = 0;
		}
	}, 15); 
}

function enemyGetFrame(enemyNum, frame){
	var ctx = enemyCanvas[enemyNum].getContext("2d");
	ctx.clearRect(0, 0, 800, 350);
// dragImage(img, sourcex, sourcey, sourcewidth, sourceheight, destx, desty, destwidth, destheight)
	if(enemyTeam[enemyNum].hpCurrent > 0){
		ctx.drawImage(enemyFrame[enemyTeam[enemyNum].index], frame * 200, 0, 200, 200, 180 + enemyNum * 130 + distanceToEncounter - enemyXAdjust[enemyNum], 150 + enemyYAdjust[enemyNum], 200, 200);
	}
}

// Set background
backgroundFrame.src = "images/background/castlewall.png";
function setBackground(f){
	var ctx = backgroundCanvas.getContext("2d");
	ctx.clearRect(0, 0, 800, 400);
	for(i = 0; i < 7; i++){
		ctx.drawImage(backgroundFrame, 0, 0, 150, 400, i * 150 - f, 0, 150, 400);
	}
}

/////////////////////////////////
// 012 - User interface        //
/////////////////////////////////

function setStatBox(){
	var ctx = statCanvas.getContext("2d");
	ctx.drawImage(statBoxImage, 0, 0, 258, 73, 5, 10, 258, 73);
}

// Pop-up alerts
var popAlertAnimate = [];
for(i = 0; i < popCanvas.length; i++){
	var p;
	popAlertAnimate.push(p);
}
// is PlayerAttack = 1 if used by player; = 0 if used by enemy
function popAlert(damage, target, isPlayerAttack){
	var targetMod = target + 1;
	var counter = 100;
	if(isPlayerAttack === 1){
		targetMod = 0;
	}
	clearInterval(popAlertAnimate[targetMod]);
	var ctx = popCanvas[targetMod].getContext("2d");
	ctx.font = "30px Arial";
	ctx.fillStyle = "red";
	popAlertAnimate[targetMod] = setInterval(function(){
		ctx.clearRect(0, 0, 800, 100);
		ctx.globalAlpha = 1 * (counter / 100);
		ctx.fillText("-" + damage + " HP", 65 + isPlayerAttack * 240 + target * 130, counter);
		counter -= 1;
		if(counter === 20){
			ctx.clearRect(0, 0, 800, 100);
			clearInterval(popAlertAnimate[targetMod]);
		}
	}, 15);
}

var expAlertAnimate;
function expAlert(value){
// clearInterval(expAlertAnimate);
	var counter = 100;
	clearInterval(expAlertAnimate);
	var ctx = expCanvas.getContext("2d");
	ctx.font = "30px Arial";
	ctx.fillStyle = "green";
	expAlertAnimate = setInterval(function(){
		ctx.clearRect(0, 0, 800, 100);
		ctx.globalAlpha = 1 * (counter / 100);
		ctx.fillText("+" + value + " exp", 65, counter);
		counter -= 1;
		if(counter === 20){
			ctx.clearRect(0, 0, 800, 100);
			clearInterval(expAlertAnimate);
		}
	}, 15);
}
var healAlertAnimate;
function healAlert(value){
// clearInterval(expAlertAnimate);
	var counter = 100;
	clearInterval(healAlertAnimate);
	var ctx = healCanvas.getContext("2d");
	ctx.font = "30px Arial";
	ctx.fillStyle = "green";
	healAlertAnimate = setInterval(function(){
		ctx.clearRect(0, 0, 800, 100);
		ctx.globalAlpha = 1 * (counter / 100);
		ctx.fillText("+" + value + " HP", 65, counter);
		counter -= 1;
		if(counter === 20){
			ctx.clearRect(0, 0, 800, 100);
			clearInterval(healAlertAnimate);
		}
	}, 15);
}

/////////////////////////////////
// 013 - Load screen           //
/////////////////////////////////
function setLoadScreen(){
	var ctx = loadCanvas.getContext("2d");
	ctx.rect(0, 0, 800, 600);
	ctx.fillStyle = "lightgray";
	ctx.fill();
	ctx.textAlign = "center";
	ctx.strokeStyle = "red";
	ctx.font = "50px Arial";
	ctx.lineWidth = 45;
	ctx.strokeText("SWORD", 400, 250);
	ctx.fillStyle = "black";
	ctx.fillText("SWORD", 400, 250);
	ctx.font = "18px Arial";
	ctx.fillText("a game by Jacob Stern", 400, 290);
	ctx.font = "30px Arial";
	ctx.fillText("Click anywhere to begin", 400, 440);
	loadCanvas.addEventListener("click", loadGame);
}
function loadGame(){
	loadCanvas.removeEventListener("click", loadGame);
	var ctx = loadCanvas.getContext("2d");
	ctx.font = "30px Arial";
	ctx.textAlign = "center"; 
	ctx.fillText("Loading...", 400, 380);
	heroIdleAnimation(heroScreenLocation);
	setEnemyTeam();
	setStatBox();
	setBackground(0);
	refreshHeroDisplay();
	turnOnMovementButton();
	setTimeout(function(){
		loadCanvas.className += "hidden";
	}, 300);	
}

/////////////////////////////////
// 014 - Cheat Codes           //
/////////////////////////////////
function killAllEnemies(){
	for(i = 0; i < enemyTeam.length; i++){
		enemyTeam[i].hpCurrent = 0;
	}
	currentTurn += 1;
	beginTurnRotation();
}

/////////////////////////////////
// 015 - Initialize            //
/////////////////////////////////
setLoadScreen();
