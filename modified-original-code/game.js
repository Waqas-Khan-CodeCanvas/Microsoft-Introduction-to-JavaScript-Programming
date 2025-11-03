// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================

// Include readline for player input
const readline = require("readline-sync");

// Game state variables
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20; // Starting gold
let currentLocation = "village";

// Weapon damage (starts at 0 until player buys a sword)
let weaponDamage = 0; // Base weapon damage
let monsterDefense = 5; // Monster's defense value
let healingPotionValue = 30; // How much health is restored

// Item templates with properties
const healthPotion = {
  name: "Health Potion",
  type: "potion",
  value: 5, // Cost in gold
  effect: 30, // Healing amount
  description: "Restores 30 health points",
};

const sword = {
  name: "Sword",
  type: "weapon",
  value: 10, // Cost in gold
  effect: 10, // Damage amount
  description: "A sturdy blade for combat",
};

// Create empty inventory array (from previous lab)
let inventory = []; // Will now store item objects instead of strings

// ===========================
// Display Functions
// Functions that show game information to the player
function showHelp() {
  console.log("\n=== HELP ===");
  console.log("- Buy weapons & armor at the Blacksmith");
  console.log("- Buy healing potions at the Market");
  console.log("- Fight monsters in the Forest");
  console.log("- Climb the Mountain to face the Dragon (with good gear!)");
  console.log("- Potions heal you; armor reduces damage");
  console.log("- Defeat the Dragon to win!");
}
// ===========================

/**
 * Shows the player's current stats
 * Displays health, gold, and current location
 */
function showStatus() {
  console.log("\n=== " + playerName + "'s Status ===");
  console.log("❤️  Health: " + playerHealth);
  console.log("💰 Gold: " + playerGold);
  console.log("📍 Location: " + currentLocation);

  // Enhanced inventory display with item details
  console.log("🎒 Inventory: ");
  if (inventory.length === 0) {
    console.log("   Nothing in inventory");
  } else {
    inventory.forEach((item, index) => {
      console.log(
        "   " + (index + 1) + ". " + item.name + " - " + item.description
      );
    });
  }
}

/**
 * Shows the current location's description and available choices
 */
function showLocation() {
  console.log("\n=== " + currentLocation.toUpperCase() + " ===");

  if (currentLocation === "village") {
    console.log(
      "You're in a bustling village. The blacksmith and market are nearby."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Go to blacksmith");
    console.log("2: Go to market");
    console.log("3: Enter forest");
    console.log("4: Check status");
    console.log("5: Use item");
    console.log("6: Help");
    console.log("7: Quit game");
  } else if (currentLocation === "blacksmith") {
    console.log(
      "The heat from the forge fills the air. Weapons and armor line the walls."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy sword (" + sword.value + " gold)");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "market") {
    console.log(
      "Merchants sell their wares from colorful stalls. A potion seller catches your eye."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Buy potion (" + healthPotion.value + " gold)");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "forest") {
    console.log(
      "The forest is dark and foreboding. You hear strange noises all around you."
    );
    console.log("\nWhat would you like to do?");
    console.log("1: Return to village");
    console.log("2: Check status");
    console.log("3: Use item");
    console.log("4: Help");
    console.log("5: Quit game");
  }
}

// ===========================
// Combat Functions
// Functions that handle battles and health
function updateHealth(amount) {
  playerHealth += amount;
  if (playerHealth > 100) playerHealth = 100;
  if (playerHealth < 0) playerHealth = 0;
  console.log("❤️ Health now: " + playerHealth);
  return playerHealth;
}

// ===========================

/**
 * Checks if player has an item of specified type
 * @param {string} type The type of item to check for
 * @returns {boolean} True if player has the item type
 */
function hasItemType(type) {
  return inventory.some((item) => item.type === type);
}

/**
 * Handles monster battles
 * Checks if player has weapon and manages combat results
 * @returns {boolean} true if player wins, false if they retreat
 */
function handleCombat() {
  // Updated to check for item type instead of specific string
  if (hasItemType("weapon")) {
    // Find the weapon to get its properties
    let weapon = inventory.find((item) => item.type === "weapon");
    console.log("You attack with your " + weapon.name + "!");
    console.log("You deal " + weapon.effect + " damage!");
    console.log("Victory! You found 10 gold!");
    playerGold += 10;
    return true;
  } else {
    console.log("Without a weapon, you must retreat!");
    updateHealth(-20);
    return false;
  }
}

/**
 * Updates player health, keeping it between 0 and 100
 * @param {number} amount Amount to change health by (positive for healing, negative for damage)
 * @returns {number} The new health value
 */
function updateHealth(amount) {
  playerHealth += amount;

  if (playerHealth > 100) {
    playerHealth = 100;
    console.log("You're at full health!");
  }
  if (playerHealth < 0) {
    playerHealth = 0;
    console.log("You're gravely wounded!");
  }

  console.log("Health is now: " + playerHealth);
  return playerHealth;
}

// ===========================
// Item Functions
// Functions that handle item usage and inventory
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

/**
 * Handles using items like potions
 * @returns {boolean} true if item was used successfully, false if not
 */
function useItem() {
  if (inventory.length === 0) {
    console.log("\nYou have no items!");
    return false;
  }

  console.log("\n=== Inventory ===");
  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name);
  });

  let choice = readline.question("Use which item? (number or 'cancel'): ");
  if (choice === "cancel") return false;

  let index = parseInt(choice) - 1;
  if (index >= 0 && index < inventory.length) {
    let item = inventory[index];

    if (item.type === "potion") {
      console.log("\nYou drink the " + item.name + ".");
      updateHealth(item.effect);
      inventory.splice(index, 1);
      console.log("Health restored to: " + playerHealth);
      return true;
    } else if (item.type === "weapon") {
      console.log("\nYou ready your " + item.name + " for battle.");
      return true;
    }
  } else {
    console.log("\nInvalid item number!");
  }
  return false;
}

/**
 * Displays the player's inventory
 */
function checkInventory() {
  console.log("\n=== INVENTORY ===");
  if (inventory.length === 0) {
    console.log("Your inventory is empty!");
    return;
  }

  // Display all inventory items with numbers and descriptions
  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name + " - " + item.description);
  });
}

// ===========================
// Shopping Functions
// Functions that handle buying items
// ===========================

/**
 * Handles purchasing items at the blacksmith
 */
function buyFromBlacksmith() {
  if (playerGold >= sword.value) {
    console.log("\nBlacksmith: 'A fine blade for a brave adventurer!'");
    playerGold -= sword.value;

    // Add sword object to inventory instead of just the name
    inventory.push({ ...sword }); // Create a copy of the sword object

    console.log(
      "You bought a " + sword.name + " for " + sword.value + " gold!"
    );
    console.log("Gold remaining: " + playerGold);
  } else {
    console.log("\nBlacksmith: 'Come back when you have more gold!'");
  }
}

/**
 * Handles purchasing items at the market
 */
function buyFromMarket() {
  if (playerGold >= healthPotion.value) {
    console.log("\nMerchant: 'This potion will heal your wounds!'");
    playerGold -= healthPotion.value;

    // Add potion object to inventory instead of just the name
    inventory.push({ ...healthPotion }); // Create a copy of the potion object

    console.log(
      "You bought a " +
        healthPotion.name +
        " for " +
        healthPotion.value +
        " gold!"
    );
    console.log("Gold remaining: " + playerGold);
  } else {
    console.log("\nMerchant: 'No gold, no potion!'");
  }
}

// ===========================
// Help System
// Provides information about available commands
// ===========================

/**
 * Shows all available game commands and how to use them
 */
function showHelp() {
  console.log("\n=== AVAILABLE COMMANDS ===");

  console.log("\nMovement Commands:");
  console.log("- In the village, choose 1-3 to travel to different locations");
  console.log(
    "- In other locations, choose the return option to go back to the village"
  );

  console.log("\nBattle Information:");
  console.log("- You need a weapon to win battles");
  console.log("- Weapons have different damage values");
  console.log("- Monsters appear in the forest");
  console.log("- Without a weapon, you'll lose health when retreating");

  console.log("\nItem Usage:");
  console.log("- Health potions restore health based on their effect value");
  console.log(
    "- You can buy potions at the market for " + healthPotion.value + " gold"
  );
  console.log(
    "- You can buy a sword at the blacksmith for " + sword.value + " gold"
  );

  console.log("\nOther Commands:");
  console.log("- Choose the status option to see your health and gold");
  console.log("- Choose the help option to see this message again");
  console.log("- Choose the quit option to end the game");

  console.log("\nTips:");
  console.log("- Keep healing potions for dangerous areas");
  console.log("- Defeat monsters to earn gold");
  console.log("- Health can't go above 100");
}

// ===========================
// Movement Functions
// Functions that handle player movement
// ===========================

/**
 * Handles movement between locations
 * @param {number} choiceNum The chosen option number
 * @returns {boolean} True if movement was successful
 */
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
      validMove = true;

      // Trigger combat when entering forest
      console.log("\nA monster appears!");
      if (!handleCombat()) {
        currentLocation = "village";
      }
    }
  } else if (currentLocation === "blacksmith") {
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    }
  } else if (currentLocation === "market") {
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    }
  } else if (currentLocation === "forest") {
    if (choiceNum === 1) {
      currentLocation = "village";
      console.log("\nYou hurry back to the safety of the village.");
      validMove = true;
    }
  }

  return validMove;
}

// ===========================
// Input Validation
// Functions that validate player input
// ===========================

/**
 * Validates if a choice number is within valid range
 * @param {string} input The user input to validate
 * @param {number} max The maximum valid choice number
 * @returns {boolean} True if choice is valid
 */
function isValidChoice(input, max) {
  if (input === "") return false;
  let num = parseInt(input);
  return num >= 1 && num <= max;
}

// ===========================
// Main Game Loop
// Controls the flow of the game
// ===========================

if (require.main === module) {
  console.log("=================================");
  console.log("       The Dragon's Quest        ");
  console.log("=================================");
  console.log("\nYour quest: Defeat the dragon in the mountains!");

  // Get player's name
  playerName = readline.question("\nWhat is your name, brave adventurer? ");
  console.log("\nWelcome, " + playerName + "!");
  console.log("You start with " + playerGold + " gold.");

  while (gameRunning) {
    // Show current location and choices
    showLocation();

    // Get and validate player choice
    let validChoice = false;
    while (!validChoice) {
      try {
        let choice = readline.question("\nEnter choice (number): ");

        // Check for empty input
        if (choice.trim() === "") {
          throw "Please enter a number!";
        }

        // Convert to number and check if it's a valid number
        let choiceNum = parseInt(choice);
        if (isNaN(choiceNum)) {
          throw "That's not a number! Please enter a number.";
        }

        // Handle choices based on location
        if (currentLocation === "village") {
          if (choiceNum < 1 || choiceNum > 7) {
            throw "Please enter a number between 1 and 7.";
          }

          validChoice = true;

          if (choiceNum <= 3) {
            move(choiceNum);
          } else if (choiceNum === 4) {
            showStatus();
          } else if (choiceNum === 5) {
            useItem();
          } else if (choiceNum === 6) {
            showHelp();
          } else if (choiceNum === 7) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "blacksmith") {
          if (choiceNum < 1 || choiceNum > 6) {
            throw "Please enter a number between 1 and 6.";
          }

          validChoice = true;

          if (choiceNum === 1) {
            buyFromBlacksmith();
          } else if (choiceNum === 2) {
            move(choiceNum);
          } else if (choiceNum === 3) {
            showStatus();
          } else if (choiceNum === 4) {
            useItem();
          } else if (choiceNum === 5) {
            showHelp();
          } else if (choiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "market") {
          if (choiceNum < 1 || choiceNum > 6) {
            throw "Please enter a number between 1 and 6.";
          }

          validChoice = true;

          if (choiceNum === 1) {
            buyFromMarket();
          } else if (choiceNum === 2) {
            move(choiceNum);
          } else if (choiceNum === 3) {
            showStatus();
          } else if (choiceNum === 4) {
            useItem();
          } else if (choiceNum === 5) {
            showHelp();
          } else if (choiceNum === 6) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "forest") {
          if (choiceNum < 1 || choiceNum > 5) {
            throw "Please enter a number between 1 and 5.";
          }

          validChoice = true;

          if (choiceNum === 1) {
            move(choiceNum);
          } else if (choiceNum === 2) {
            showStatus();
          } else if (choiceNum === 3) {
            useItem();
          } else if (choiceNum === 4) {
            showHelp();
          } else if (choiceNum === 5) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        }
      } catch (error) {
        console.log("\nError: " + error);
        console.log("Please try again!");
      }
    }

    // Check if player died
    if (playerHealth <= 0) {
      console.log("\nGame Over! Your health reached 0!");
      gameRunning = false;
    }
  }
}
