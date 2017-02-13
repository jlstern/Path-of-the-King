// Constant Variables
var hero = {} // hero object
var level = 0 //hero level
var enemy = [{}] // enemy master list of objects


// Changing Variables
var hero = {} // complete list of hero stats
var enemyTeam = [] // set enemy team for every encounter
var turnOrder = [] // add enemy team + player to create turn order

// Animation Variables
var heroAnimate = []
var enemyAnimate = []
var magicAnimate = ""

// Canvas Variables
var heroCanvas = ""
var enemyCanvas = []



////// scratch pad //////

var hero = {
	level: 1 + lv.red + lv.pur + lv.blu + lv.gre + lv.yel + lv.org,
	currentPath: 0,
	hpCurrent: 20,
	hpTotal: Math.floor(20 + (lv.red*5 + lv.pur*2.5 + lv.blu*5 + lv.gre*7.5 + lv.yel*10 + lv.org*7.5)),
	magCurrent: 10,
	magTotal: Math.floor(10 + (lv.red*2 + lv.pur*4 + lv.blu*6 + lv.gre*8 + lv.yel*6 + lv.org*4)),
	wepAtk: heroMod.wepAtk,
	wepDef: Math.floor(heroMod.wepDef + (lv.red*7.5 + lv.pur*5 + lv.blu*2.5 + lv.gre*5 + lv.yel*7.5 + lv.org*10)),
	magAtk: heroMod.magAtk,
	magDef: Math.floor(heroMod.magDef + (lv.red*2.5 + lv.pur*5 + lv.blu*7.5 + lv.gre*10 + lv.yel*7.5 + lv.org*5)),
	speed: Math.floor(2 + heroMod.speed + (lv.red*1.5 + lv.pur*2 + lv.blu*1.5 + lv.gre*1 + lv.yel*0.5 + lv.org*1)),
	magRegen: Math.floor(1 + (lv.red*2.5 + lv.pur*5 + lv.blu*7.5 + lv.gre*10 + lv.yel*7.5 + lv.org*5)),
	skill: [1, 2, 3, 4, 0, 0, 0, 0],
	animate: "",
	x: 0,
	y: 0
}

var lv = {
	red: 0,
	pur: 0,
	blu: 0,
	gre: 0,
	yel: 0,
	org: 0
}

var heroMod = {
	wepAtk: 0,
	wepDef: 0,
	magAtk: 0,
	magDef: 0,
	speed: 0
}






