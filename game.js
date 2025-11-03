// ==========================
// Adventure Game
// ==========================

// ==========================
// TASK 1: EXPANDING THE ITEM SYSTEM
// ==========================

// --------------------------
// Item Templates
// --------------------------
const basicSword = { name: "Basic Sword", type: "weapon", value: 5, effect: 10, description: "A simple sword" };
const steelSword = { name: "Steel Sword", type: "weapon", value: 20, effect: 20, description: "A sharp steel sword" };
const woodenShield = { name: "Wooden Shield", type: "armor", value: 8, effect: 5, description: "Reduces damage taken in combat" };
const ironShield = { name: "Iron Shield", type: "armor", value: 25, effect: 15, description: "Provides strong protection" };
const potion = { name: "Healing Potion", type: "potion", value: 10, effect: 20, description: "Restores 20 health" };

// Player Inventory & Stats
let inventory = [basicSword, woodenShield];
let playerHealth = 100;

// --------------------------
// Helper Functions for Item Management
// --------------------------
function getItemsByType(type) {
    return inventory.filter(item => item.type === type);
}

function getBestItem(type) {
    const items = getItemsByType(type);
    if (items.length === 0) return null;
    return items.reduce((best, item) => (item.effect > best.effect ? item : best));
}

function hasGoodEquipment() {
    const weapon = inventory.find(item => item.name === "Steel Sword");
    const armor = getItemsByType("armor").length > 0;
    return weapon && armor;
}

// ==========================
// TASK 2: ENHANCED COMBAT SYSTEM
// ==========================
function handleCombat(isDragon = false) {
    const weapon = getBestItem("weapon");
    const armor = getBestItem("armor");

    if (!weapon || !armor) {
        console.log("You are not equipped properly for this battle!");
        return false;
    }

    const monster = {
        name: isDragon ? "Dragon" : "Goblin",
        health: isDragon ? 50 : 20,
        damage: isDragon ? 20 : 10
    };

    console.log(`\nYou engage the ${monster.name}!`);
    console.log(`Using weapon: ${weapon.name} (Damage: ${weapon.effect})`);
    console.log(`Wearing armor: ${armor.name} (Protection: ${armor.effect})`);

    while (monster.health > 0 && playerHealth > 0) {
        // Player attacks
        monster.health -= weapon.effect;
        console.log(`You hit the ${monster.name}. Remaining health: ${Math.max(monster.health, 0)}`);

        if (monster.health <= 0) break;

        // Monster attacks
        let damageTaken = monster.damage - armor.effect;
        damageTaken = Math.max(damageTaken, 1); // Minimum damage is 1
        playerHealth -= damageTaken;
        console.log(`The ${monster.name} attacks you and deals ${damageTaken} damage. Your health: ${playerHealth}`);
    }

    if (playerHealth <= 0) {
        console.log("\nYou have been defeated. Game Over.");
        return false;
    }

    console.log(`\nYou defeated the ${monster.name}!\n`);
    return true;
}

// ==========================
// TASK 3: GAME INTEGRATION AND VICTORY CONDITIONS
// ==========================

// Shopping System
function buyFromBlacksmith(itemName) {
    const store = [steelSword, ironShield];
    const item = store.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    if (item) {
        inventory.push(item);
        console.log(`You bought ${item.name}!`);
    } else {
        console.log("Item not available.");
    }
}

function buyPotion() {
    inventory.push(potion);
    console.log("You bought a Healing Potion!");
}

// Locations and Movement
let currentLocation = "village";
let gameRunning = true;

function showLocation() {
    console.log("\n====================");
    switch (currentLocation) {
        case "village":
            console.log("You are in the village. Options:\n1) Visit Blacksmith\n2) Visit Market\n3) Go to Forest\n4) Go to Dragon's Lair\n5) View Inventory");
            break;
        case "blacksmith":
            console.log("Blacksmith shop. Options:\n1) Buy Steel Sword\n2) Buy Iron Shield\n3) Return to Village");
            break;
        case "market":
            console.log("Market. Options:\n1) Buy Healing Potion\n2) Return to Village");
            break;
        case "forest":
            console.log("You are in the forest. Options:\n1) Fight Goblin\n2) Return to Village");
            break;
        case "dragonLair":
            console.log("You are at the Dragon's Lair! Options:\n1) Fight Dragon\n2) Return to Village");
            break;
    }
}

function move(choice) {
    switch (currentLocation) {
        case "village":
            if (choice === 1) currentLocation = "blacksmith";
            else if (choice === 2) currentLocation = "market";
            else if (choice === 3) currentLocation = "forest";
            else if (choice === 4) currentLocation = "dragonLair";
            else if (choice === 5) viewInventory();
            else console.log("Invalid choice.");
            break;
        case "blacksmith":
            if (choice === 1) buyFromBlacksmith("Steel Sword");
            else if (choice === 2) buyFromBlacksmith("Iron Shield");
            else if (choice === 3) currentLocation = "village";
            else console.log("Invalid choice.");
            break;
        case "market":
            if (choice === 1) buyPotion();
            else if (choice === 2) currentLocation = "village";
            else console.log("Invalid choice.");
            break;
        case "forest":
            if (choice === 1) handleCombat(false);
            else if (choice === 2) currentLocation = "village";
            else console.log("Invalid choice.");
            break;
        case "dragonLair":
            if (choice === 1) {
                if (hasGoodEquipment()) {
                    if (handleCombat(true)) victory();
                } else {
                    console.log("You are not equipped well enough to fight the dragon!");
                }
            } else if (choice === 2) currentLocation = "village";
            else console.log("Invalid choice.");
            break;
    }
}

function viewInventory() {
    console.log("\nYour Inventory:");
    inventory.forEach((item, index) => console.log(`${index + 1}) ${item.name} (${item.type}) - Effect: ${item.effect}`));
}

// Victory
function victory() {
    console.log("\n🎉 Congratulations! You defeated the Dragon and completed your adventure! 🎉");
    console.log(`Your remaining health: ${playerHealth}`);
    console.log("Thank you for playing!");
    gameRunning = false;
}

// ==========================
// NODE.JS INPUT SETUP
// ==========================
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Main Game Loop using readline
function gameLoop() {
    if (!gameRunning) {
        rl.close();
        return;
    }

    showLocation();

    rl.question("Enter your choice number: ", (answer) => {
        const choice = parseInt(answer);
        if (isNaN(choice)) {
            console.log("Please enter a valid number.");
        } else {
            move(choice);
        }
        gameLoop(); // Continue loop
    });
}

// Start the game
gameLoop();
