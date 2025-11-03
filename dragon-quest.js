// ===========================================
// The Dragon's Quest - Advanced Edition
// A progression-based text adventure game
// ===========================================

const readline = require("readline-sync");

// ===========================
// Game State
// ===========================
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20;
let currentLocation = "village";
let inventory = [];

// ===========================
// Base Items
// ===========================
const healthPotion = {
  name: "Health Potion",
  type: "potion",
  value: 5,
  effect: 30,
  description: "Restores 30 health points",
};

const sword = {
  name: "Sword",
  type: "weapon",
  value: 10,
  effect: 10,
  description: "A sturdy blade for combat",
};

// ===========================
// Advanced Items (Task 1)
// ===========================
const woodenShield = {
  name: "Wooden Shield",
  type: "armor",
  value: 8,
  effect: 5,
  description: "Reduces damage taken in combat",
};

const ironShield = {
  name: "Iron Shield",
  type: "armor",
  value: 15,
  effect: 10,
  description: "A sturdy shield that offers excellent protection",
};

const steelSword = {
  name: "Steel Sword",
  type: "weapon",
  value: 20,
  effect: 20,
  description: "A sharp and durable blade forged from steel",
};

// ===========================
// Helper Functions for Items
// ===========================
function getItemsByType(type) {
  return inventory.filter((item) => item.type === type);
}

function getBestItem(type) {
  let items = getItemsByType(type);
  if (items.length === 0) return null;
  return items.reduce((best, current) =>
    current.effect > best.effect ? current : best
  );
}

function hasGoodEquipment() {
  const hasSteelSword = inventory.some((item) => item.name === "Steel Sword");
  const hasArmor = inventory.some((item) => item.type === "armor");
  return hasSteelSword && hasArmor;
}

// ===========================
// Display Functions
// ===========================
function showStatus() {
  console.log("\n=== " + playerName + "'s Status ===");
  console.log("❤️  Health: " + playerHealth);
  console.log("💰 Gold: " + playerGold);
  console.log("📍 Location: " + currentLocation);
  console.log("🎒 Inventory:");
  if (inventory.length === 0) console.log("   (empty)");
  else
    inventory.forEach((item, i) =>
      console.log(`   ${i + 1}. ${item.name} - ${item.description}`)
    );
}

function showHelp() {
  console.log("\n=== HELP ===");
  console.log("- Buy weapons & armor at the Blacksmith");
  console.log("- Buy healing potions at the Market");
  console.log("- Fight monsters in the Forest");
  console.log("- Climb the Mountain to face the Dragon (with good gear!)");
  console.log("- Potions heal you; armor reduces damage");
  console.log("- Defeat the Dragon to win!");
}

function showLocation() {
  console.log("\n=== " + currentLocation.toUpperCase() + " ===");

  if (currentLocation === "village") {
    console.log("You're in a bustling village. The blacksmith and market await.");
    console.log("\nWhat would you like to do?");
    console.log("1: Go to blacksmith");
    console.log("2: Go to market");
    console.log("3: Enter forest");
    console.log("4: Travel to the mountain (final battle)");
    console.log("5: Check status");
    console.log("6: Use item");
    console.log("7: Help");
    console.log("8: Quit game");
  } else if (currentLocation === "blacksmith") {
    console.log(
      "The forge glows bright. Weapons and armor gleam in the firelight."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy item");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "market") {
    console.log(
      "The market is lively with merchants selling all kinds of goods."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy potion");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "forest") {
    console.log("The forest is dark and full of danger...");
    console.log("\nWhat would you like to do?");
    console.log("1: Return to village");
    console.log("2: Check status");
    console.log("3: Use item");
    console.log("4: Help");
    console.log("5: Quit game");
  } else if (currentLocation === "mountain") {
    console.log("You stand before the dragon's lair atop the mountain...");
    console.log("\nWhat would you like to do?");
    console.log("1: Fight the dragon");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  }
}

// ===========================
// Combat System
// ===========================
function updateHealth(amount) {
  playerHealth += amount;
  if (playerHealth > 100) playerHealth = 100;
  if (playerHealth < 0) playerHealth = 0;
  console.log("❤️ Health now: " + playerHealth);
  return playerHealth;
}

/**
 * Handles monster and dragon battles
 * @param {boolean} isDragon - Whether this is the final boss battle
 */
function handleCombat(isDragon = false) {
  let enemy = {
    name: isDragon ? "Dragon" : "Monster",
    health: isDragon ? 50 : 20,
    damage: isDragon ? 20 : 10,
  };

  console.log(`\nA ${enemy.name} appears!`);

  let bestWeapon = getBestItem("weapon");
  let bestArmor = getBestItem("armor");

  if (!bestWeapon) {
    console.log("You have no weapon! You must retreat!");
    updateHealth(-enemy.damage);
    return false;
  }

  console.log(
    `You ready your ${bestWeapon.name} (Damage: ${bestWeapon.effect})`
  );
  if (bestArmor)
    console.log(
      `You brace with your ${bestArmor.name} (Protection: ${bestArmor.effect})`
    );

  let playerAttack = bestWeapon.effect;
  let armorProtection = bestArmor ? bestArmor.effect : 0;
  let enemyAttack = Math.max(1, enemy.damage - armorProtection);

  console.log(`\nYou strike the ${enemy.name} for ${playerAttack} damage!`);
  enemy.health -= playerAttack;

  if (enemy.health <= 0) {
    console.log(`Victory! You defeated the ${enemy.name}!`);
    let reward = isDragon ? 100 : 10;
    playerGold += reward;
    console.log(`You found ${reward} gold!`);
    if (isDragon) {
      console.log("\n🔥 You have slain the mighty Dragon!");
      console.log("🏆 Congratulations, hero! You've completed your quest!");
      showStatus();
      gameRunning = false;
    }
    return true;
  } else {
    console.log(`${enemy.name} attacks you for ${enemyAttack} damage!`);
    updateHealth(-enemyAttack);
    if (playerHealth <= 0) {
      console.log("\n💀 You were defeated in battle!");
      gameRunning = false;
      return false;
    }
  }

  return true;
}

// ===========================
// Item & Shopping Functions
// ===========================
function useItem() {
  if (inventory.length === 0) {
    console.log("You have no items!");
    return;
  }

  console.log("\n=== Inventory ===");
  inventory.forEach((item, i) => console.log(`${i + 1}: ${item.name}`));

  let choice = readline.question("Use which item? (number or 'cancel'): ");
  if (choice === "cancel") return;
  let index = parseInt(choice) - 1;
  if (index >= 0 && index < inventory.length) {
    let item = inventory[index];
    if (item.type === "potion") {
      console.log(`You drink the ${item.name}.`);
      updateHealth(item.effect);
      inventory.splice(index, 1);
    } else {
      console.log("You can't use that right now.");
    }
  } else {
    console.log("Invalid choice.");
  }
}

function buyFromBlacksmith() {
  console.log("\nAvailable items:");
  console.log("1: Sword - 10 gold");
  console.log("2: Steel Sword - 20 gold");
  console.log("3: Wooden Shield - 8 gold");
  console.log("4: Iron Shield - 15 gold");
  console.log("5: Return");

  let choice = readline.question("Choose an item to buy: ");
  if (choice === "5") return;

  let item;
  if (choice === "1") item = sword;
  else if (choice === "2") item = steelSword;
  else if (choice === "3") item = woodenShield;
  else if (choice === "4") item = ironShield;
  else return console.log("Invalid choice.");

  if (playerGold >= item.value) {
    inventory.push({ ...item });
    playerGold -= item.value;
    console.log(`You bought a ${item.name} for ${item.value} gold!`);
  } else {
    console.log("Not enough gold!");
  }
}

function buyFromMarket() {
  if (playerGold >= healthPotion.value) {
    console.log("You buy a health potion.");
    inventory.push({ ...healthPotion });
    playerGold -= healthPotion.value;
  } else console.log("You can't afford that!");
}

// ===========================
// Movement
// ===========================
function move(choiceNum) {
  let validMove = false;

  if (currentLocation === "village") {
    if (choiceNum === 1) {
      currentLocation = "blacksmith";
      console.log("\nYou enter the blacksmith's shop.");
      validMove = true;
    } else if (choiceNum === 2) {
      currentLocation = "market";
      console.log("\nYou enter the market.");
      validMove = true;
    } else if (choiceNum === 3) {
      currentLocation = "forest";
      console.log("\nYou venture into the forest...");
      handleCombat(false);
      validMove = true;
    } else if (choiceNum === 4) {
      if (hasGoodEquipment()) {
        currentLocation = "mountain";
        console.log("\nYou climb the mountain, ready to face the dragon...");
        validMove = true;
      } else {
        console.log(
          "\nYou're not ready to face the dragon! Get a Steel Sword and some armor first."
        );
      }
    }
  } else if (currentLocation === "blacksmith" && choiceNum === 2) {
    currentLocation = "village";
    console.log("You return to the village.");
    validMove = true;
  } else if (currentLocation === "market" && choiceNum === 2) {
    currentLocation = "village";
    console.log("You return to the village.");
    validMove = true;
  } else if (currentLocation === "forest" && choiceNum === 1) {
    currentLocation = "village";
    console.log("You return to the village.");
    validMove = true;
  } else if (currentLocation === "mountain" && choiceNum === 2) {
    currentLocation = "village";
    console.log("You retreat back to the village to rest.");
    validMove = true;
  }

  return validMove;
}

// ===========================
// Main Game Loop
// ===========================
if (require.main === module) {
  console.log("=================================");
  console.log("       The Dragon's Quest        ");
  console.log("=================================");
  console.log("\nYour quest: Defeat the dragon in the mountains!");

  playerName = readline.question("\nWhat is your name, brave adventurer? ");
  console.log("\nWelcome, " + playerName + "!");
  console.log("You start with " + playerGold + " gold.");

  while (gameRunning) {
    showLocation();

    try {
      let choice = readline.question("\nEnter choice (number): ");
      let choiceNum = parseInt(choice);

      if (isNaN(choiceNum)) throw "Please enter a valid number.";

      // Location-based logic
      if (currentLocation === "village") {
        if (choiceNum < 1 || choiceNum > 8)
          throw "Enter a number between 1 and 8.";
        if (choiceNum <= 4) move(choiceNum);
        else if (choiceNum === 5) showStatus();
        else if (choiceNum === 6) useItem();
        else if (choiceNum === 7) showHelp();
        else if (choiceNum === 8) {
          console.log("Thanks for playing!");
          gameRunning = false;
        }
      } else if (currentLocation === "blacksmith") {
        if (choiceNum === 1) buyFromBlacksmith();
        else if (choiceNum === 2) move(choiceNum);
        else if (choiceNum === 3) showStatus();
        else if (choiceNum === 4) useItem();
        else if (choiceNum === 5) showHelp();
        else if (choiceNum === 6) {
          console.log("Thanks for playing!");
          gameRunning = false;
        }
      } else if (currentLocation === "market") {
        if (choiceNum === 1) buyFromMarket();
        else if (choiceNum === 2) move(choiceNum);
        else if (choiceNum === 3) showStatus();
        else if (choiceNum === 4) useItem();
        else if (choiceNum === 5) showHelp();
        else if (choiceNum === 6) {
          console.log("Thanks for playing!");
          gameRunning = false;
        }
      } else if (currentLocation === "forest") {
        if (choiceNum === 1) move(choiceNum);
        else if (choiceNum === 2) showStatus();
        else if (choiceNum === 3) useItem();
        else if (choiceNum === 4) showHelp();
        else if (choiceNum === 5) {
          console.log("Thanks for playing!");
          gameRunning = false;
        }
      } else if (currentLocation === "mountain") {
        if (choiceNum === 1) handleCombat(true);
        else if (choiceNum === 2) move(choiceNum);
        else if (choiceNum === 3) showStatus();
        else if (choiceNum === 4) useItem();
        else if (choiceNum === 5) showHelp();
        else if (choiceNum === 6) {
          console.log("Thanks for playing!");
          gameRunning = false;
        }
      }
    } catch (error) {
      console.log("\nError: " + error);
    }

    if (playerHealth <= 0) {
      console.log("\nGame Over! Your health reached 0!");
      gameRunning = false;
    }
  }
}
