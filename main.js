"use strict";

document.getElementById('version').innerText = "0.1.3"
// (9+X) ^ 2 / 100 * log10(9+X)

let gameData;
let initialGameData = {
  activeTab: "hearth",
  golems: {
      total: 0,
      working: 0,
      type: {
        clay: {
          amount: 0,
          working: 0,
          unlocked: false,
          efficiency: 1,
          upkeepMultiplier: 1
        },
        wood: {
          amount: 0,
          working: 0,
          unlocked: false,
          efficiency: 1,
          upkeepMultiplier: 1
        },
        stone: {
          amount: 0,
          working: 0,
          unlocked: false,
          efficiency: 1,
          upkeepMultiplier: 1
        }
      }
  },
  buildings: {
      manaTower: {
        level: 0,
        unlocked: false
      },
      manaWell: {
        level: 0,
        unlocked: false
      },
      clayStorage: {
        level: 0,
        unlocked: false
      },
      clayDeposits: {
        level: 0,
        unlocked: false
      },
      woodShed: {
        level: 0,
        unlocked: false
      },
      lumberjacksHut: {
        level: 0,
        unlocked: false
      },
      stoneyard: {
        level: 0,
        unlocked: false
      },
      stoneQuarry: {
        level: 0,
        unlocked: false
      },
      library: {
        level: 0,
        unlocked: false
      }
    },
  resources: {
    research: {
      workers: {
        clay: 0,
        wood: 0,
        stone: 0
      },
      workersTotal: 0,
      workersMax: 0,
      production: 0,
      usage: 0,
      unlocked: false
    },
    mana: {
      amount: 10,
      max: 10,
      workers: {
        clay: 0,
        wood: 0,
        stone: 0
      },
      workersTotal: 0,
      workersMax: 0,
      production: 1.25,
      usage: 0,
      unlocked: false
    },
    clay: {
      amount: 0,
      max: 5,
      workers: {
        clay: 0,
        wood: 0,
        stone: 0
      },
      workersTotal: 0,
      workersMax: 0,
      production: 0,
      usage: 0,
      unlocked: true
    },
    wood: {
      amount: 0,
      max: 0,
      workers: {
        clay: 0,
        wood: 0,
        stone: 0
      },
      workersTotal: 0,
      workersMax: 0,
      production: 0,
      usage: 0,
      unlocked: false
    },
    stone: {
      amount: 0,
      max: 0,
      workers: {
        clay: 0,
        wood: 0,
        stone: 0
      },
      workersTotal: 0,
      workersMax: 0,
      production: 0,
      usage: 0,
      unlocked: false
    }
  },
  currentResearch: "none",
  research: {
    golemWood: {
      unlocked: false,
      costsPaid: false,
      completed: false,
      points: 0
    },
    mining1: {
      unlocked: false,
      costsPaid: false,
      completed: false,
      points: 0
    },
    golemClayExpertise: {
      unlocked: false,
      costsPaid: false,
      completed: false,
      points: 0
    },
    geology: {
      unlocked: false,
      costsPaid: false,
      completed: false,
      points: 0
    }
  }
}

const production = {
  research: {
    resourceId: "research",
    displayName: "research",
    workers: "researchers",
    prodBuilding: "library",
    grade: "common",
    desc: "n/a",
    toughness: 50,
    manaCost: 0
  },
  mana: {
    resourceId: "mana",
    displayName: "mana",
    workers: "n/a",
    prodBuilding: "manaWell",
    grade: "common",
    desc: "Mana is the magical energy used to power, control, cast, and more...",
    toughness: "n/a",
    manaCost: 0
  },
  clay: {
    resourceId: "clay",
    displayName: "clay",
    workers: "clay diggers",
    prodBuilding: "clayDeposits",
    grade: "common",
    desc: "Clay is the one of the most primitive materials. It is easy to shape, but not very durable.",
    toughness: 1,
    manaCost: 1
  },
  wood: {
    resourceId: "wood",
    displayName: "greatwood",
    workers: "lumberjacks",
    prodBuilding: "lumberjacksHut",
    grade: "common",
    desc: "Wood is easy to gather, easy to work with, relatively durable, but prone to fire.",
    toughness: 2,
    manaCost: 5
  },
  stone: {
    resourceId: "stone",
    displayName: "stone",
    workers: "stone miners",
    prodBuilding: "stoneQuarry",
    grade: "common",
    desc: "Stone may be hard to gather or work with, but it's also tough to break.",
    toughness: 4,
    manaCost: 10
  }
}

const golems = {
  clay: {
    type: "clay",
    displayName: "clay golem",
    desc: "Clay golems are easy to make and dexterous, but also very fragile.",
    upkeep: 0.5,
    power: 1
  },
  wood: {
    type: "wood",
    displayName: "wood golem",
    desc: "Wood golems are well balanced between their toughness, strength, and ease of control.",
    upkeep: 1.25,
    power: 3
  },
  stone: {
    type: "stone",
    displayName: "stone golem",
    desc: "Stone golems are tough and sturdy, but very slow.",
    upkeep: 2.25,
    power: 5.75
  }
}

const buildings = {
  manaTower: {
    buildingId: "manaTower",
    displayName: "mana tower",
    type: "storage",
    resource: "mana",
    desc: "This tower is built around a mysterious crystal, which arcane properties let it store magical energy called mana."
  },
  manaWell: {
    buildingId: "manaWell",
    displayName: "mana well",
    type: "production",
    resource: "mana",
    desc: "This building is actually a large mystical device somewhat resembling an orrery or a telescope. It concentrates energy from the stars and converts it to mana."
  },
  clayStorage: {
    buildingId: "clayStorage",
    displayName: "clay storage",
    type: "storage",
    resource: "clay",
    desc: "This building is used to store clay. Upgrade it to increase the maximum amount of clay you can store."
  },
  clayDeposits: {
    buildingId: "clayDeposits",
    displayName: "clay deposits",
    type: "production",
    resource: "clay",
    desc: "This building allows your golems to dig clay. Upgrade it to increase maximum amount of diggers and increase their efficiency by 5%."
  },
  woodShed: {
    buildingId: "woodShed",
    displayName: "wood shed",
    type: "storage",
    resource: "wood",
    desc: "This building is used to store wood. Upgrade it to increase its capacity."
  },
  lumberjacksHut: {
    buildingId: "lumberjacksHut",
    displayName: "lumberjacks hut",
    type: "production",
    resource: "wood",
    desc: "This building allows you to hire lumberjacks. Upgrade it to increase maximum amount of lumberjacks and increase their efficiency by 5%."
  },
  stoneyard: {
    buildingId: "stoneyard",
    displayName: "stoneyard",
    type: "storage",
    resource: "stone",
    desc: "This building is used to store stone. Upgrade it to increase its capacity."
  },
  stoneQuarry: {
    buildingId: "stoneQuarry",
    displayName: "stone quarry",
    type: "production",
    resource: "stone",
    desc: "This building lets your golems mine stone. Upgrading it will increase its capacity and add a 5% bonus to your workers."
  },
  library: {
    buildingId: "library",
    displayName: "library",
    type: "other",
    resource: "research",
    desc: "This building allows you to research new technologies. You can upgrade it to increase its capacity as well increase your researchers' efficiency by 5%."
  }
}

const research = {
  golemWood: {
    researchId: "golemWood",
    displayName: "wood golems",
    description: "It seems that one of the types of trees growing around here is harder and grows bigger than other trees. I'm pretty sure that it has magical properties too. Perhaps some research on its structure will let me make golems out of it?",
    completedDesc: "Just as I thought, this type of wood has something magical in it. The golems made out of this material are going to be harder to control, but I'm sure that will pay off.",
    requiredResearch: 5,
    requiredResources: {
      'mana': 50,
      'wood': 50
    }
  },
  mining1: {
    researchId: "mining1",
    displayName: "mining",
    description: "My golems could gather more kinds of resources. I'm sure this research would help further with my expansion.",
    completedDesc: "I have designed a quarry, in which golems will be able to mine stone.",
    requiredResearch: 15,
    requiredResources: {
      'clay': 75,
      'wood': 75
    }
  },
  golemClayExpertise: {
    researchId: "golemClayExpertise",
    displayName: "clay golems expertise",
    description: "I've got so many clay golems, but they are so weak... I have an idea how to make them more effective, though.",
    completedDesc: "The research was succesful - As expected, I've discovered a way to make clay golems be more productive, but also now they will be using less mana!",
    requiredResearch: 30,
    requiredResources: {
      'mana': 100,
      'clay': 500
    }
  },
  geology: {
    researchId: "geology",
    displayName: "geology",
    description: "I'm pretty sure I could teach the golems to find and mine various minerals.",
    completedDesc: "The golems can now recognize minerals such as coal.",
    requiredResearch: 50,
    requiredResources: {
      'mana': 150,
      'stone': 250
    }
  }
}

// *** UTILITY ***
//number formatter
function nFormatter(num, digits) {
  if (num < 1){
    return parseFloat(num.toFixed(2));
  }
  else {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }
}

//calculate percentage
function percentify(val1, val2){
  return Intl.NumberFormat("en-GB", { style: "percent", 
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(val1 / val2);
}

// *** UI ***
//navigation
function topnavMenu() {
  var x = document.getElementById("topMenu");
  if (x.className === "topnav") {
    x.classList.add("responsive");
  } else {
    x.classList.remove("responsive");
  }
};

// When the user scrolls the page, execute updateNav
window.onscroll = function() {updateNav()};

// Get the navbar
var navbar = document.getElementById("topMenu");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function updateNav() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

// Get the modal
var modal = document.getElementById("golemsModal");

// Get the button that opens the modal
var createGolemBtn = document.getElementById("createGolemBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
createGolemBtn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//tabs
function tab(tab) {
  document.getElementById("hearth").style.display = "none"
  document.getElementById("buildings").style.display = "none"
  document.getElementById("workers").style.display = "none"
  document.getElementById("research").style.display = "none"
  document.getElementById("tavern").style.display = "none"
  document.getElementById("explore").style.display = "none"
  document.getElementById("workshop").style.display = "none"
  document.getElementById("options").style.display = "none"
  document.getElementById(tab).style.display = "flex"
}
tab("hearth");

//game log alerts
function gameLog(message) {
  let element = document.createElement("div");
  element.classList.add("message");
  element.innerHTML = `<p>${message}</p>`;
  document.getElementById("gameLogContent").firstChild.prepend(element);
}

// *** GAME CORE ***

//execute these upon loading the page
resourceGen();
buildingsGen();
golemsGen();
golemsInfoGen();
workerGen();
researchGen();
reset(true);
checkUnlocks();

//hard reset
function reset(confirmReset) {
  confirmReset = confirmReset ?? confirm("Are you sure you want to reset your progress?");
  if (!confirmReset) {return;}
  gameData = JSON.parse(JSON.stringify(initialGameData));

//hide hearth buttons
  document.getElementById('createGolemBtn').style.display = "none";

  Object.values(production).forEach(p =>{
    document.getElementById(p.resourceId + "Res").style.display = "none";
    document.getElementById(p.resourceId + "Worker").style.display = "none";
  })

  Object.values(buildings).forEach(b =>{
    document.getElementById(b.buildingId + "Building").style.display = "none";
  })

  Object.values(golems).forEach(g =>{
    document.getElementById(g.type + "Golem").style.display = "none";
  })
  

  document.getElementById('tabBuildings').style.display = "none";
  document.getElementById('tabWorkers').style.display = "none";
  document.getElementById('tabResearch').style.display = "none";
  document.getElementById('tabTavern').style.display = "none";
  document.getElementById('tabExplore').style.display = "none";
  document.getElementById('tabWorkshop').style.display = "none";
  

  document.getElementById('gameLogContent').innerHTML = "<span></span>";

  //unlocked by default:
  document.getElementById('manaRes').style.display = "";
  document.getElementById('clayRes').style.display = "";

  tab(gameData.activeTab);
}

//load data
let savegame = JSON.parse(localStorage.getItem("gameSave"))
if (savegame !== null) {
  gameData = savegame;
  updateAll();
}

//save loop
let saveLoop = window.setInterval(function(){
  localStorage.setItem("gameSave", JSON.stringify(gameData))
}, 5000)

//update all data
function updateAll(){

  //resourcebar updates
  Object.values(production).forEach(p =>{
  if (p.resourceId != "research"){
    if (gameData.resources[p.resourceId].amount > gameData.resources[p.resourceId].max){gameData.resources[p.resourceId].amount = gameData.resources[p.resourceId].max}
    let prod = nFormatter((gameData.resources[p.resourceId].production - gameData.resources[p.resourceId].usage), 2);
    let amt = nFormatter(gameData.resources[p.resourceId].amount, 2);
    let max = nFormatter(gameData.resources[p.resourceId].max, 2);
    if (prod > 0){document.getElementById(`${p.resourceId}Prod`).innerHTML = `<span style="color:lime;">+` + prod + "/s</span>";}
    else if (prod == 0){document.getElementById(`${p.resourceId}Prod`).innerHTML = "";}
    else if (prod*-60 >= amt){document.getElementById(`${p.resourceId}Prod`).innerHTML = `<span style="color: red;">` + prod + "/s</span>";}
    else if (prod*-3600 >= amt){document.getElementById(`${p.resourceId}Prod`).innerHTML = `<span style="color: orange;">` + prod + "/s</span>";}
    else if (prod < 0){document.getElementById(`${p.resourceId}Prod`).innerHTML = `<span style="color: yellow;">` + prod + "/s</span>";}
    document.getElementById(`${p.resourceId}Amt`).innerHTML = amt;
    document.getElementById(`${p.resourceId}Max`).innerHTML = "/" + max;
  }
  })

  //buildings
  Object.values(buildings).forEach(b =>{
    document.getElementById(b.buildingId + "Name").innerHTML = `<h3>${b.displayName} <span style="font-family: 'Titillium Web', sans-serif; font-size: 20px;">(level ${gameData.buildings[b.buildingId].level})</span></h3>`;
    document.getElementById(b.buildingId + "Costs").innerHTML = "";
    Object.values(getUpgradeCost(b.buildingId, gameData.buildings[b.buildingId].level + 1)).forEach(r =>{
      let element = document.createElement("span");
      if (r.amount > gameData.resources[r.resource].amount) {element.classList.add("red");}
      element.innerHTML = `<div class="item-bg"><img src="img/${r.resource}.png"></img></div> ` + production[r.resource].displayName + ": "+ r.amount + "<br>";
      document.getElementById(b.buildingId + "Costs").appendChild(element);
    })
    if (hasResources(getUpgradeCost(b.buildingId))){
      document.getElementById(b.buildingId + "Btn").classList.remove("deactivated");
    }
    else{
      document.getElementById(b.buildingId + "Btn").classList.add("deactivated");
    }
  })

  //golem creation menu
  Object.values(golems).forEach(g =>{
    document.getElementById(g.type + "GolemAmt").innerHTML = gameData.golems.type[g.type].amount;
    document.getElementById(g.type + "GolemCosts").innerHTML = "";  
    Object.values(getGolemCost(g.type)).forEach(r =>{
      let element = document.createElement("span");
      if (r.amount > gameData.resources[r.resource].amount) {element.classList.add("red");}
      element.innerHTML = `<div class="item-bg"><img src="img/${r.resource}.png"></img></div> ` + production[r.resource].displayName + ": "+ r.amount + "<br>";
      document.getElementById(g.type + "GolemCosts").appendChild(element);
    })
    if (hasResources(getGolemCost(g.type))){
      document.getElementById(g.type + "GolemBtn").classList.remove("deactivated");
    }
    else{
      document.getElementById(g.type + "GolemBtn").classList.add("deactivated");
    }
  })

  //golem management
  document.getElementById("golemsTotal").innerHTML = nFormatter(gameData.golems.total, 0);
  Object.values(golems).forEach(g =>{
    if (gameData.golems.type[g.type].amount > gameData.golems.type[g.type].working){
      document.getElementById(g.type + "GolemInfo").innerHTML = gameData.golems.type[g.type].amount + "<i style='font-size: 16px;'> ("+ (gameData.golems.type[g.type].amount - gameData.golems.type[g.type].working) +" without a job)</i>"
    }
    else{
      document.getElementById(g.type + "GolemInfo").innerHTML = gameData.golems.type[g.type].amount
    }
  })

  Object.values(production).forEach(p =>{
    Object.values(golems).forEach(g =>{
      if (p.resourceId != "mana"){
        document.getElementById(g.type + "Golem_" + p.resourceId + "Workers").innerHTML = gameData.resources[p.resourceId].workers[g.type];
        document.getElementById(p.resourceId + "WorkersMax").innerHTML = "(" + gameData.resources[p.resourceId].workersTotal + "/" + gameData.resources[p.resourceId].workersMax + ")";
      }
    })
  })
  
  //calculate production per second
  Object.values(production).forEach(p =>{
    let golemPower = 0;
    if (p.resourceId != "mana"){
      Object.values(golems).forEach(g => {
        golemPower += gameData.resources[p.resourceId].workers[g.type] * gameData.golems.type[g.type].efficiency * g.power;
      })
      gameData.resources[p.resourceId].production = golemPower * (0.95 + 0.05 * gameData.buildings[p.prodBuilding].level) / p.toughness;
    }
  })
  
  //calculate golem mana upkeep total
  gameData.resources.mana.usage = 0;
  Object.values(golems).forEach(g =>{
    gameData.resources.mana.usage += g.upkeep * gameData.golems.type[g.type].working * gameData.golems.type[g.type].upkeepMultiplier;
  })

  //research
  Object.values(research).forEach(r =>{
    //hide the research if it has been completed, and show the completed version
    if (gameData.research[r.researchId].completed == true){
      document.getElementById(r.researchId + "Available").style.display = "none";
      document.getElementById(r.researchId + "Completed").style.display = ""; 
    }
    //show research points progress and update progressbar
    document.getElementById(r.researchId + "ProgAmt").innerHTML = "Current research: <img src='img/research.png'></img> " + nFormatter(gameData.research[r.researchId].points, 2) + " / " + nFormatter(research[r.researchId].requiredResearch, 2) + " (" + percentify(gameData.research[r.researchId].points, research[r.researchId].requiredResearch) + ")";
    document.getElementById(r.researchId + "ProgBar").style.width = percentify(gameData.research[r.researchId].points, research[r.researchId].requiredResearch); 

    //print out required resources
    document.getElementById(r.researchId + "Costs").innerHTML = "Required resources: <br>"; 
    for (const [res, amount] of Object.entries(research[r.researchId].requiredResources)) {
      let element = document.createElement("span");
      if (`${amount}` > gameData.resources[`${res}`].amount) {element.classList.add("red");}
      element.innerHTML = `<div class="item-bg"><img src="img/${res}.png"></img></div> ` + production[`${res}`].displayName + ": "+ nFormatter(`${amount}`) + "<br>";
      document.getElementById(r.researchId + "Costs").appendChild(element);
    }
    //hide required resources if you've already started the research, and show progress
    if (gameData.research[r.researchId].costsPaid == true) {
      document.getElementById(r.researchId + "Costs").style.display = "none";
      document.getElementById(r.researchId + "Prog").style.display = "";
    }
    else{
      document.getElementById(r.researchId + "Costs").style.display = "";
      document.getElementById(r.researchId + "Prog").style.display = "none";
    }
    //lock the research button if you don't have the resources, unless you've already started the research
    if (gameData.currentResearch != r.researchId && gameData.research[r.researchId].points == 0){
      document.getElementById(`${r.researchId}ResearchBtn`).classList.remove("deactivated");
      for (const [res, amount] of Object.entries(research[r.researchId].requiredResources)) {
        if (`${amount}` > gameData.resources[`${res}`].amount){ 
          document.getElementById(`${r.researchId}ResearchBtn`).classList.add("deactivated");
        }
      }
    }
  
  })

  checkUnlocks();
}


// *** HEARTH BUTTONS ***

//conjure clay
function gatherClay(){
  if (gameData.resources.mana.amount >= 1 && gameData.resources.clay.amount < gameData.resources.clay.max){
    gameData.resources.mana.amount -= 1;
    gameData.resources.clay.amount++;
    updateAll();
  }
}

// *** DYNAMIC GENERATION ***

function resourceGen() {
  Object.values(production).forEach(p =>{
    let element = document.createElement("tr");
    element.id = p.resourceId + "Res";
    element.classList.add("res");
    element.innerHTML = `<td class='name'><div class="item-bg"><img src="img/${p.resourceId}.png"></img></div> ${p.displayName}:</td>
    <td id='${p.resourceId}Prod' class='prod'></td>
    <td id='${p.resourceId}Amt' class='amt'></td>
    <td id='${p.resourceId}Max' class='max'></td>`
    element.classList.add("res");
    document.getElementById("resourceBarContents").appendChild(element);
    document.getElementById(p.resourceId + "Res").style.display = "none";
  })
}

function buildingsGen() {
  Object.values(buildings).forEach(b =>{
    let element = document.createElement("div");
    element.classList.add("building", "box", "flow-column");
    element.id = b.buildingId + "Building";
    element.buildingType = b.buildingId;
    element.innerHTML = `<h3 id="${b.buildingId}Name" style="font-size:24px;">${b.displayName} - level 0</h3>
    <div>
    <div class="btn buildingBtn" id="${b.buildingId}Btn">Upgrade</div>
    <p class="desc">${b.desc}</p>
    <div class="listCosts" id="${b.buildingId}Costs"></div>
    </div>`;
    document.getElementById("buildingsList").appendChild(element);

    document.getElementById(b.buildingId + "Building").style.display = "none";
  })
  document.addEventListener("click", event => {
    let target = event.target.closest(".buildingBtn");
    if (target) {
      upgradeBuilding(target.parentNode.parentNode.buildingType);
    }
  })
}

function golemsGen() {
  Object.values(golems).forEach(g =>{
    let element = document.createElement("div");
    element.classList.add("golem", "box", "flow-column", g.type + "Golem");
    element.style.display = "none";
    element.id = g.type + "Golem";
    element.golemType = g.type;
    element.innerHTML = `
    <h3>${g.displayName}</h3>
    <div><div class="btn golemBtn" id="${g.type}GolemBtn">Create</div>
    <p class="desc">${g.desc}</p>
    <p>Amount owned: <span id="${g.type}GolemAmt"></span></p>
    <p>Mana upkeep cost: <b>${g.upkeep}</b>/s</p>
    <div class="listCosts" id="${g.type}GolemCosts"></div>
    </div>`
    document.getElementById("listGolems").appendChild(element);
    document.getElementById(g.type + "Golem").style.display = "none";
  })
  document.addEventListener("click", event => {
    let target = event.target.closest(".golemBtn");
    if (target) {
      createGolem(target.parentNode.parentNode.golemType);
    }
  })
}

function golemsInfoGen(){
  Object.values(golems).forEach(g =>{
    let element = document.createElement("p");
    element.classList.add(g.type + "Golem");
    element.style.display = "none";
    element.innerHTML = `${g.displayName}s: <span id="${g.type}GolemInfo"></span>`
    document.getElementById("golemsInfo").appendChild(element);
  }
)}

////worker buttons gen
function workerGen() {
  Object.values(production).forEach(p =>{
    let element = document.createElement("div");
    element.classList.add("worker");
    element.style.display = "none";
    element.resource = p.resourceId;
    element.id = p.resourceId + "Worker";
    element.innerHTML = `<h3>${p.workers} <span style="font-family: 'Titillium Web', sans-serif; font-size: 20px;" id="${p.resourceId}WorkersMax">(0/0)</span></h3>`
    document.getElementById("workerList").appendChild(element);

    Object.values(golems).forEach(g =>{
      let element = document.createElement("tr");
      element.classList.add(`${g.type}Golem`, "golemWorker");
      element.style.display = "none";
      element.innerHTML = `<td>${g.displayName}s:</td> 
      <td class="center"><img class="clickable" src="img/-.png" onclick="hire('${p.resourceId}', '${g.type}', -1)"></img></td>
      <td class="center" id="${g.type}Golem_${p.resourceId}Workers">0</td>
      <td class="center"><img class="clickable" src="img/+.png" onclick="hire('${p.resourceId}', '${g.type}', 1)"></img></td>`
      document.getElementById(`${p.resourceId}Worker`).appendChild(element);
    })
  })
}

//research gen
function researchGen(){
  //available
  Object.values(research).forEach(r =>{
    let element = document.createElement("div");
    element.id = r.researchId + "Available";
    element.innerHTML = `<h3>${r.displayName}</h3>
    <div id='${r.researchId}ResearchBtn' class="btn btnResearch" onclick="chooseResearch('${r.researchId}')">Research</div>
    <p class="desc">${r.description}</p>
    <div id="${r.researchId}Prog"><p id="${r.researchId}ProgAmt">Current progress: </p>
    <div class="progress"><div class="bar" id="${r.researchId}ProgBar"></div>
    </div></div>
    <span id="${r.researchId}Costs" class="listCosts">Required resources:</span>
    <hr>`
    element.style.display = "none";
    document.getElementById("researchAvailable").appendChild(element);
  })
  //completed
  Object.values(research).reverse().forEach(r =>{
    let element = document.createElement("div");
    element.innerHTML = `<h3>${r.displayName}</h3>
    <p class="desc">${r.completedDesc}</p>
    <hr>`
    element.id = r.researchId + "Completed";
    element.style.display = "none";
    document.getElementById("researchCompleted").appendChild(element);
  })
}


// *** RESOURCE PRODUCTION LOOP ***
let productionLoop = window.setInterval(function(){
  
  Object.values(production).forEach(p =>{
    if (p.resourceId != "research"){
    let resource = gameData.resources[p.resourceId]
    resource.amount += resource.production/10;
    resource.amount -= resource.usage/10;
    if (resource.amount > resource.max){resource.amount = resource.max}
  }})

  //research
  if (gameData.currentResearch != "none"){
    gameData.research[gameData.currentResearch].points += gameData.resources.research.production/10;
    //research completion
    if (gameData.research[gameData.currentResearch].points >= research[gameData.currentResearch].requiredResearch){
      gameData.research[gameData.currentResearch].points == research[gameData.currentResearch].requiredResearch;
      completeResearch(gameData.currentResearch);
    }
  }

  updateAll();
}, 100)

function hire(job, type, amt){
  if (amt > 0 && gameData.golems.type[type].amount >= gameData.golems.type[type].working + amt
    && gameData.resources[job].workersTotal + amt <= gameData.resources[job].workersMax){
    gameData.golems.type[type].working += amt;
    gameData.golems.working += amt;
    gameData.resources[job].workers[type] += amt;
    gameData.resources[job].workersTotal += amt;
  }
  if (amt < 0 && gameData.golems.type[type].working + amt >= 0 && gameData.resources[job].workersTotal + amt >= 0){
    gameData.golems.type[type].working += amt;
    gameData.golems.working += amt;
    gameData.resources[job].workers[type] += amt;
    gameData.resources[job].workersTotal += amt;
  }
  updateAll();
}

// *** UNLOCKS ***
function unlockResource(resource){
  gameData.resources[resource].unlocked = true;
  document.getElementById(resource + "Res").style.display = "";
}

function unlockBuilding(building){
  if (gameData.buildings[building].unlocked == false){
    gameLog("Unlocked new building: " + buildings[building].displayName + "!");
  }
  gameData.buildings[building].unlocked = true;
  document.getElementById(building + "Building").style.display = "";
}

function unlockTab(tabName){
  document.getElementById(tabName).style.display = "";
}

function unlockBtn(btnName){
  document.getElementById(btnName).style.display = "";
}

function unlockWorker(workerName){
  document.getElementById(workerName + "Worker").style.display = "";
}

function unlockGolem(golemType){
  document.querySelectorAll(`.${golemType}Golem`).forEach(function(el) {
    el.style.display = '';
 });
 for (let element of document.getElementsByClassName(`.${golemType}Golem`)){
  element.style.display="none";
}
  if (gameData.golems.type[golemType].unlocked == false){
    gameLog("Unlocked new golem type: " + golemType + "!");
    gameData.golems.type[golemType].unlocked = true;
  }
}

function unlockResearch(researchId){
  if (gameData.research[researchId].completed == false){
    document.getElementById(researchId + "Available").style.display = "";
    gameData.research[researchId].unlocked = true;
  }
}

function checkUnlocks(){
  if (gameData.resources.clay.amount >= 5 || gameData.buildings.clayStorage.unlocked == true){
    unlockBuilding("clayStorage");
    unlockTab("tabBuildings");
  }
  if (gameData.buildings.clayStorage.level >= 1){
    unlockBtn("createGolemBtn");
    unlockGolem("clay");
  }
  if (gameData.golems.type.clay.amount >= 1){
    unlockBuilding("clayDeposits");
  }
  if (gameData.buildings.clayDeposits.level >= 1){
    unlockBuilding("manaTower");
  }
  if (gameData.buildings.manaTower.level >= 1){
    unlockBuilding("manaWell");
  }
  if (gameData.buildings.clayDeposits.level >= 1){
    unlockWorker("clay");
    unlockTab("tabWorkers")
  }
  if (gameData.buildings.manaWell.level >= 1){
    unlockBuilding("woodShed");
  }
  if (gameData.buildings.woodShed.level >= 1){
    unlockResource("wood");
    unlockBuilding("lumberjacksHut");
  }
  if (gameData.buildings.lumberjacksHut.level >= 1){
    unlockWorker("wood");
    unlockBuilding("library");
  }
  if (gameData.buildings.library.level >= 1){
    unlockTab("tabResearch");
    unlockWorker("research");
    unlockResearch("golemWood");
  }
  if (gameData.research.golemWood.completed == true){
    unlockGolem("wood");
  }
  if (gameData.buildings.clayStorage.level >= 6 || gameData.buildings.woodShed.level >= 3){
    unlockResearch("mining1");
  }
  if (gameData.research.mining1.completed == true){
    unlockBuilding("stoneyard");
  }
  if (gameData.buildings.stoneyard.level >= 1){
    unlockBuilding("stoneQuarry");
    unlockResource("stone")
  }
  if (gameData.buildings.stoneQuarry.level >= 1){
    unlockWorker("stone");
  }
  if (gameData.golems.type.clay.amount >= 10){
    unlockResearch("golemClayExpertise");
  }
  if (gameData.buildings.stoneQuarry.level >= 3){
    unlockResearch("geology");
  }
}

// *** UPGRADES ***

function hasResource(resource) {
  return gameData.resources[resource.resource].amount >= resource.amount;
}

function payResource(resource) {
  return gameData.resources[resource.resource].amount -= resource.amount;
}

function payResources(resources) {
  for (const resource of resources){
    payResource(resource);
  }
}

function hasResources(resources){
  for (const resource of resources){
    if (!hasResource(resource)){
      return false;
    }
  }
  return true;
}

function payIfPossible(resources){
  if (hasResources(resources)){
    payResources(resources);
    return true;
  }
  return false;
}

function createGolem(type){
  if (golems[type].upkeep + gameData.resources.mana.production > gameData.resources.mana.usage){
    if (payIfPossible(getGolemCost(type))){
      gameData.golems.type[type].amount++;
      gameData.golems.total++;
    }
  }
}

function getGolemCost(type){
  let amount = gameData.golems.type[type].amount + 1;

  const resources = [];
  switch (type) {
    case 'clay':
      resources.push({'resource': 'mana', 'amount': Math.ceil(5 * Math.pow(amount, 1.43))});
      resources.push({'resource': 'clay', 'amount': Math.ceil(10 * Math.pow(amount, 1.73))});
    break;
    case 'wood':
      resources.push({'resource': 'mana', 'amount': Math.ceil(20 * Math.pow(amount, 1.43))});
      resources.push({'resource': 'wood', 'amount': Math.ceil(15 * Math.pow(amount, 1.73))});
    break;
    case 'stone':
      resources.push({'resource': 'mana', 'amount': Math.ceil(50 * Math.pow(amount, 1.43))});
      resources.push({'resource': 'stone', 'amount': Math.ceil(20 * Math.pow(amount, 1.73))});
    break;
  }
  return resources;
}

function getUpgradeCost(building){
  let level = gameData.buildings[building].level + 1;

  const resources = [];
    switch (building) {
      //storage
      case 'manaTower':
        {resources.push({'resource': 'clay', 'amount': 
          20 + Math.ceil(10 * Math.pow(level, 1.83))
      })}
        if (level > 2){resources.push({'resource': 'wood', 'amount': 
          15 + Math.ceil(10 * Math.pow(level-2, 1.78))
      })}
        if (level > 5){resources.push({'resource': 'stone', 'amount': 
          10 + Math.ceil(10 * Math.pow(level-5, 1.73))
      })}
      break;
      case 'clayStorage':
        {resources.push({'resource': 'clay', 'amount': 
          5 + Math.ceil(10 * (Math.pow(level, 1.43) - Math.pow(level, 0.75)))
      })}
        if (level > 3){resources.push({'resource': 'wood', 'amount': 
          5 + Math.ceil(10 * (Math.pow(level-3, 1.43) - Math.pow(level-3, 0.75)))
      })}
        if (level > 6){resources.push({'resource': 'stone', 'amount': 
          5 + Math.ceil(10 * (Math.pow(level-6, 1.43) - Math.pow(level-6, 0.75)))
      })}
      break;
      case 'woodShed':
        {resources.push({'resource': 'clay', 'amount': 
          30 + Math.ceil(10 * (Math.pow(level, 1.43) - Math.pow(level, 0.75)))
      })}
        if (level > 1){resources.push({'resource': 'wood', 'amount': 
          10 + Math.ceil(10 * (Math.pow(level-1, 1.43) - Math.pow(level-1, 0.75)))
      })}
        if (level > 4){resources.push({'resource': 'stone', 'amount': 
          5 + Math.ceil(10 * (Math.pow(level-4, 1.43) - Math.pow(level-4, 0.75)))
      })}
      break;
      case 'stoneyard':
        {resources.push({'resource': 'clay', 'amount': 
          45 + Math.ceil(10 * (Math.pow(level, 1.43) - Math.pow(level, 0.75)))
      })}
        {resources.push({'resource': 'wood', 'amount': 
          30 + Math.ceil(10 * (Math.pow(level, 1.43) - Math.pow(level, 0.75)))
      })}
        if (level > 1){resources.push({'resource': 'stone', 'amount': 
          10 + Math.ceil(10 * (Math.pow(level-1, 1.43) - Math.pow(level-1, 0.75)))
      })}
      break;

      //production
      case 'manaWell':
        {resources.push({'resource': 'clay', 'amount': 
          25 + Math.ceil(10 * Math.pow(level, 1.93))
      })}
        if (level > 2){resources.push({'resource': 'wood', 'amount': 
          20 + Math.ceil(10 * Math.pow(level-2, 1.88))
      })}
        if (level > 5){resources.push({'resource': 'stone', 'amount': 
          15 + Math.ceil(10 * Math.pow(level-5, 1.73))
      })}
      break;
      case 'clayDeposits':
        {resources.push({'resource': 'clay', 'amount': 
          5 + Math.ceil(10 * Math.pow(level, 1.73))
      })}
        if (level > 3){resources.push({'resource': 'wood', 'amount': 
          5 + Math.ceil(10 * Math.pow(level-3, 1.68))
      })}
        if (level > 6){resources.push({'resource': 'stone', 'amount': 
          5 + Math.ceil(10 * Math.pow(level-6, 1.63))
      })}
      break;
      case 'lumberjacksHut':
        {resources.push({'resource': 'clay', 'amount': 
          35 + Math.ceil(10 * Math.pow(level, 1.73))
      })}
        if (level > 1){resources.push({'resource': 'wood', 'amount': 
          35 + Math.ceil(10 * Math.pow(level-2, 1.68))
      })}
        if (level > 4){resources.push({'resource': 'stone', 'amount': 
          35 + Math.ceil(10 * Math.pow(level-5, 1.63))
      })}
      break;
      case 'stoneQuarry':
        {resources.push({'resource': 'clay', 'amount': 
          50 + Math.ceil(10 * Math.pow(level, 1.73))
      })}
        {resources.push({'resource': 'wood', 'amount': 
          40 + Math.ceil(10 * Math.pow(level, 1.68))
      })}
        if (level > 1){resources.push({'resource': 'stone', 'amount': 
          30 + Math.ceil(10 * Math.pow(level-1, 1.63))
      })}
      break;

      //special
      case 'library':
        {resources.push({'resource': 'clay', 'amount': 
          40 + Math.ceil(10 * Math.pow(level, 1.93))
      })}
        {resources.push({'resource': 'wood', 'amount': 
          35 + Math.ceil(10 * Math.pow(level, 1.88))
      })}
        if (level > 3){resources.push({'resource': 'stone', 'amount': 
          35 + Math.ceil(10 * Math.pow(level-2, 1.83))
      })}
      break;

    }
  return resources;
}


function upgradeBuilding(building){
  if (payIfPossible (getUpgradeCost(building))){
    gameData.buildings[building].level ++;
    let level = gameData.buildings[building].level;
    switch (building) {
      case 'clayStorage':
        gameData.resources.clay.max = 10 + 10 * Math.round(Math.pow(level, 1.43));
      break;
      case 'clayDeposits':
        gameData.resources.clay.workersMax = Math.round(Math.pow(level, 1.23))
      break;
      case 'manaTower':
        gameData.resources.mana.max = 10 + 10 * Math.ceil(Math.pow(level, 1.23));
      break;
      case 'manaWell':
        gameData.resources.mana.production = 1 + Math.round(Math.pow(level, 1.23));
      break;
      case 'woodShed':
        gameData.resources.wood.max =  10 * Math.ceil(Math.pow(level, 1.43));
      break;
      case 'lumberjacksHut':
        gameData.resources.wood.workersMax = Math.round(Math.pow(level, 1.23))
      break;
      case 'stoneyard':
        gameData.resources.stone.max =  10 * Math.ceil(Math.pow(level, 1.43));
      break;
      case 'stoneQuarry':
        gameData.resources.stone.workersMax = Math.round(Math.pow(level, 1.23))
      break;
      case 'library':
        gameData.resources.research.workersMax = Math.floor(Math.pow(level, 1.16))
      break;
  }
  updateAll();
  }
}

// *** RESEARCH ***
//choose active research
function chooseResearch(researchId){
  //take the payments only when you haven't started it before
  if (gameData.research[researchId].costsPaid == false){
    for (const [res, amount] of Object.entries(research[researchId].requiredResources)) {
      console.log(`${res}, ${amount}`);
      gameData.resources[`${res}`].amount -= `${amount}`;
      console.log(`${res}, ${amount}`);
    }
    gameData.research[researchId].costsPaid = true;
  }
  gameData.currentResearch = researchId;
}

function completeResearch(researchId){
  gameLog("Research completed!");
  gameData.research[researchId].completed = true;
  gameData.currentResearch = "none";

  switch(researchId) {
    case 'golemClayExpertise':
      gameData.golems.type.clay.efficiency += 0.1;
      gameData.golems.type.clay.upkeepMultiplier -= 0.1;
    break;
  }
}