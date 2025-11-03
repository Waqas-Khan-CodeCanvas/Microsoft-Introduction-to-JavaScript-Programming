// ===========================================
// The Dragon's Quest - Completed Project
// ===========================================

// Include readline for player input
const readline = require("readline-sync");

// Game state variables
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20; // Starting gold
let currentLocation = "village";

// Weapon/armor defaults
let weaponDamage = 0; // Base weapon damage (unused directly now; chosen from inventory)
let monsterDefense = 5; // Monster's defense value (not used heavily but can be extended)
let healingPotionValue = 30; // How much health is restored (unused; each potion has effect)

// ===========================
// Item templates (tiered)
// ===========================
const healthPotion = {
  id: "health_potion",
  name: "Health Potion",
  type: "potion",
  value: 5, // Cost in gold
  effect: 30, // Healing amount
  description: "Restores 30 health points",
};

const sword = {
  id: "sword_basic",
  name: "Sword",
  type: "weapon",
  value: 10, // Cost in gold
  effect: 10, // Damage amount
  description: "A sturdy blade for combat",
};

const steelSword = {
  id: "sword_steel",
  name: "Steel Sword",
  type: "weapon",
  value: 20,
  effect: 18,
  description: "A sharp steel sword with superior damage",
};

const woodenShield = {
  id: "shield_wood",
  name: "Wooden Shield",
  type: "armor",
  value: 8,
  effect: 5, // protection amount
  description: "Reduces damage taken in combat",
};

const ironShield = {
  id: "shield_iron",
  name: "Iron Shield",
  type: "armor",
  value: 15,
  effect: 12,
  description: "Heavy iron shield that greatly reduces incoming damage",
};

// A catalog of items the blacksmith/market can sell (helps shop display)
const shopCatalog = {
  blacksmith: [sword, steelSword, woodenShield, ironShield],
  market: [healthPotion],
};

// Create empty inventory array (stores item objects)
let inventory = [];

// ===========================
// Display Functions
// ===========================
function showStatus() {
  console.log("\n=== " + playerName + "'s Status ===");
  console.log("❤️  Health: " + playerHealth);
  console.log("💰 Gold: " + playerGold);
  console.log("📍 Location: " + currentLocation);

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
    console.log("You're in a bustling village. The blacksmith and market are nearby.");
    console.log("\nWhat would you like to do?");
    console.log("1: Go to blacksmith");
    console.log("2: Go to market");
    console.log("3: Enter forest (fight monsters)");
    console.log("4: Travel to mountains (face the dragon) - WARNING: Boss");
    console.log("5: Check status");
    console.log("6: Use item");
    console.log("7: Help");
    console.log("8: Quit game");
  } else if (currentLocation === "blacksmith") {
    console.log("The heat from the forge fills the air. Weapons and armor line the walls.");
    console.log("\nWhat would you like to do?");
    console.log("1: Browse items for sale");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "market") {
    console.log("Merchants sell their wares from colorful stalls. A potion seller catches your eye.");
    console.log("\nWhat would you like to do?");
    console.log("1: Browse items for sale");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "forest") {
    console.log("The forest is dark and foreboding. You hear strange noises all around you.");
    console.log("\nWhat would you like to do?");
    console.log("1: Search for monsters (engage)");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  } else if (currentLocation === "mountains") {
    console.log("Wind howls between jagged peaks. The dragon's lair lies ahead.");
    console.log("\nWhat would you like to do?");
    console.log("1: Enter the dragon's lair (Boss fight)"); // deadly
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Use item");
    console.log("5: Help");
    console.log("6: Quit game");
  }
}

// ===========================
// Helper functions — Item management
// ===========================

/**
 * getItemsByType - returns array of items in inventory of given type
 * @param {string} type - item type to filter (e.g., "weapon", "armor", "potion")
 * @returns {Array} - matching item objects
 */
function getItemsByType(type) {
  return inventory.filter((item) => item.type === type);
}

/**
 * getBestItem - returns the item in inventory of type with highest effect (or null)
 * @param {string} type - item type
 * @returns {object|null} - best item or null
 */
function getBestItem(type) {
  const items = getItemsByType(type);
  if (items.length === 0) return null;
  // Find max by effect
  let best = items.reduce((prev, current) => (current.effect > prev.effect ? current : prev), items[0]);
  return best;
}

/**
 * hasGoodEquipment - checks whether player is well-equipped for the dragon
 * Requires: steel sword (specific id) and any armor item
 * Returns true if steelSword is in inventory and at least one armor exists
 */
function hasGoodEquipment() {
  const hasSteel = inventory.some((item) => item.id === steelSword.id);
  const anyArmor = getItemsByType("armor").length > 0;
  return hasSteel && anyArmor;
}

// ===========================
// Combat Functions (enhanced)
// ===========================

/**
 * handleCombat - fight a monster or the dragon
 * @param {boolean} isDragon - whether this battle is the dragon boss
 * @returns {boolean} - true if player survived/won, false if player retreated/died
 */
function handleCombat(isDragon = false) {
  console.log("\n--- Combat Start ---");

  // Select best weapon and armor (automatic)
  const bestWeapon = getBestItem("weapon");
  const bestArmor = getBestItem("armor");

  if (!bestWeapon) {
    // No weapon => must retreat (regular monster) or suffer heavy consequences with dragon
    console.log("You have no weapon to fight with!");
    if (isDragon) {
      console.log("The dragon laughs at your lack of weapon and breathes fire!");
      // Dragon does a lot of damage
      updateHealth(-40);
      console.log("You barely escape with your life and retreat to the village.");
      return false;
    } else {
      console.log("Without a weapon, you must retreat!");
      updateHealth(-20);
      return false;
    }
  }

  console.log("You equip: " + bestWeapon.name + " (damage: " + bestWeapon.effect + ").");
  if (bestArmor) {
    console.log("You shield yourself with: " + bestArmor.name + " (protection: " + bestArmor.effect + ").");
  } else {
    console.log("You have no armor equipped.");
  }

  // Monster stats
  let monsterName = isDragon ? "The Dragon" : "A Forest Monster";
  let monsterHealth = isDragon ? 50 : 20;
  let monsterDamage = isDragon ? 20 : 10;

  // If dragon fight, require good equipment or make battle extremely hard
  if (isDragon && !hasGoodEquipment()) {
    console.log("\nWarning: The dragon is a deadly foe.");
    console.log("Without a Steel Sword and decent armor, this fight will be nearly impossible.");
    // Optionally give player a chance to retreat before the fight
    const proceed = readline.question("Do you still want to fight? (yes/no): ").toLowerCase();
    if (proceed !== "yes" && proceed !== "y") {
      console.log("You wisely decide to return to the village to prepare.");
      return false;
    }
    // If proceeding without good equipment, weaken player or make dragon stronger:
    console.log("You brave the lair despite being underprepared...");
    // Make monster stronger temporarily
    monsterDamage += 10;
    monsterHealth += 20;
  }

  // Start combat rounds
  while (monsterHealth > 0 && playerHealth > 0) {
    // Player attack
    let playerHit = bestWeapon.effect;
    console.log("\nYou strike the " + monsterName + " for " + playerHit + " damage!");
    monsterHealth -= playerHit;
    if (monsterHealth <= 0) {
      console.log("You defeated " + monsterName + "!");
      // Give rewards: gold and maybe potion drop for monsters
      const goldReward = isDragon ? 100 : 10;
      console.log("You found " + goldReward + " gold!");
      playerGold += goldReward;
      if (!isDragon) {
        // chance to drop a potion (small chance); keep simple: always 50% drop
        if (Math.random() < 0.5) {
          console.log("The monster dropped a Health Potion!");
          inventory.push({ ...healthPotion });
        }
      }
      // If dragon defeated, trigger victory outside
      return true;
    }

    // Monster attacks
    // Calculate armor protection (if any)
    let protection = bestArmor ? bestArmor.effect : 0;
    let incoming = monsterDamage - protection;
    if (incoming < 1) incoming = 1; // minimum 1 damage

    console.log(monsterName + " attacks you for " + monsterDamage + " damage.");
    if (protection > 0) {
      console.log("Your armor reduces incoming damage by " + protection + ". You take " + incoming + " damage.");
    } else {
      console.log("You have no armor to protect you. You take " + incoming + " damage.");
    }

    updateHealth(-incoming);

    // If player still alive, loop for next round
    if (playerHealth <= 0) {
      console.log("\nYou were slain in battle...");
      return false;
    }
  }

  return false;
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
// Item functions (use/check inventory)
// ===========================
function useItem() {
  if (inventory.length === 0) {
    console.log("\nYou have no items!");
    return false;
  }

  console.log("\n=== Inventory ===");
  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name + " (" + item.type + ")");
  });

  let choice = readline.question("Use which item? (number or 'cancel'): ");
  if (choice === "cancel") return false;

  let index = parseInt(choice) - 1;
  if (isNaN(index) || index < 0 || index >= inventory.length) {
    console.log("\nInvalid item number!");
    return false;
  }

  let item = inventory[index];

  if (item.type === "potion") {
    console.log("\nYou drink the " + item.name + ".");
    updateHealth(item.effect);
    inventory.splice(index, 1);
    console.log("Health restored to: " + playerHealth);
    return true;
  } else if (item.type === "weapon") {
    console.log("\nYou ready your " + item.name + " for battle. (Weapons auto-selected in combat.)");
    return true;
  } else if (item.type === "armor") {
    console.log("\nYou equip the " + item.name + " now. (Armor auto-selected in combat.)");
    return true;
  } else {
    console.log("\nThat item can't be used.");
  }
  return false;
}

function checkInventory() {
  console.log("\n=== INVENTORY ===");
  if (inventory.length === 0) {
    console.log("Your inventory is empty!");
    return;
  }

  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name + " - " + item.description);
  });
}

// ===========================
// Shopping Functions
// ===========================

/**
 * Display a catalog and buy item by number from that catalog (shopKey)
 */
function shopBrowseAndBuy(shopKey) {
  const catalog = shopCatalog[shopKey];
  if (!catalog || catalog.length === 0) {
    console.log("Nothing to buy here.");
    return;
  }
  console.log("\n--- Items for sale ---");
  catalog.forEach((it, idx) => {
    console.log((idx + 1) + ": " + it.name + " - " + it.description + " (" + it.value + " gold)");
  });
  console.log((catalog.length + 1) + ": Cancel / Back");

  let choice = readline.question("Choose item number to buy: ");
  let choiceNum = parseInt(choice);
  if (isNaN(choiceNum) || choiceNum < 1 || choiceNum > catalog.length + 1) {
    console.log("Invalid choice.");
    return;
  }
  if (choiceNum === catalog.length + 1) {
    console.log("Leaving the shop.");
    return;
  }

  const chosen = catalog[choiceNum - 1];
  if (playerGold >= chosen.value) {
    playerGold -= chosen.value;
    // Add a copy of the item to inventory
    inventory.push({ ...chosen });
    console.log("You bought a " + chosen.name + " for " + chosen.value + " gold!");
    console.log("Gold remaining: " + playerGold);
  } else {
    console.log("You don't have enough gold for that item.");
  }
}

function buyFromBlacksmith() {
  shopBrowseAndBuy("blacksmith");
}

function buyFromMarket() {
  shopBrowseAndBuy("market");
}

// ===========================
// Movement Functions (updated)
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
      validMove = true;

      // Trigger combat when searching in forest (monster encounter)
      const fought = handleCombat(false);
      if (!fought) {
        // Either retreated or died; send back to village unless dead
        if (playerHealth > 0) {
          currentLocation = "village";
          console.log("You returned to the village to recover.");
        }
      }
    } else if (choiceNum === 4) {
      currentLocation = "mountains";
      console.log("\nYou travel to the mountains. The dragon's lair is nearby.");
      validMove = true;
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
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou hurry back to the safety of the village.");
      validMove = true;
    } else if (choiceNum === 1) {
      // If explicitly choosing to "search for monsters" here, call combat
      console.log("\nYou search for more monsters...");
      const fought = handleCombat(false);
      if (!fought && playerHealth > 0) {
        currentLocation = "village";
        console.log("You returned to the village to recover.");
      }
      validMove = true;
    }
  } else if (currentLocation === "mountains") {
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    } else if (choiceNum === 1) {
      // Enter dragon lair
      console.log("\nYou step into the dragon's lair...");
      const won = handleCombat(true);
      if (won && playerHealth > 0) {
        // Dragon defeated -> Victory
        console.log("\n*** VICTORY! You have slain the dragon! ***");
        console.log("You have completed your quest and saved the land!");
        // Show final stats
        showStatus();
        console.log("\nThank you for playing The Dragon's Quest!");
        gameRunning = false;
      } else {
        // If lost/died, handle accordingly
        if (playerHealth <= 0) {
          console.log("\nGame Over! The dragon was too powerful.");
          gameRunning = false;
        } else {
          // retreat happened; send to village
          currentLocation = "village";
          console.log("You returned to the village to lick your wounds.");
        }
      }
      validMove = true;
    }
  }

  return validMove;
}

// ===========================
// Input Validation
// ===========================
function isValidChoice(input, max) {
  if (input === "") return false;
  let num = parseInt(input);
  return !isNaN(num) && num >= 1 && num <= max;
}

// ===========================
// Help System
// ===========================
function showHelp() {
  console.log("\n=== AVAILABLE COMMANDS ===");

  console.log("\nMovement Commands:");
  console.log("- In the village, choose 1-4 to travel to different locations");
  console.log("- In other locations, choose the return option to go back to the village");

  console.log("\nBattle Information:");
  console.log("- The game will automatically pick your best weapon and armor.");
  console.log("- Weapons increase your damage; armor reduces incoming damage.");
  console.log("- Monsters appear in the forest. The dragon awaits in the mountains.");
  console.log("- Without a weapon, you'll take heavy penalties or be unable to fight.");

  console.log("\nItem Usage:");
  console.log("- Health potions restore health based on their effect value");
  console.log("- You can buy potions at the market and weapons/armor at the blacksmith");

  console.log("\nOther Commands:");
  console.log("- Choose the status option to see your health and gold");
  console.log("- Choose the help option to see this message again");
  console.log("- Choose the quit option to end the game");

  console.log("\nTips:");
  console.log("- Save potions for tough fights (like the dragon)");
  console.log("- Buy higher tier equipment (Steel Sword, Iron Shield) to improve survival");
  console.log("- Defeat monsters to earn gold and sometimes potions");
  console.log("- Health can't go above 100");
}

// ===========================
// Main Game Loop
// ===========================
if (require.main === module) {
  console.log("=================================");
  console.log("       The Dragon's Quest        ");
  console.log("=================================");
  console.log("\nYour quest: Defeat the dragon in the mountains!");

  // Get player's name
  playerName = readline.question("\nWhat is your name, brave adventurer? ");
  if (!playerName || playerName.trim() === "") playerName = "Adventurer";
  console.log("\nWelcome, " + playerName + "!");
  console.log("You start with " + playerGold + " gold.");

  while (gameRunning) {
    showLocation();

    // Determine max option number for current location to validate
    let maxOption = 8; // default (village)
    if (currentLocation === "village") maxOption = 8;
    else if (currentLocation === "blacksmith" || currentLocation === "market") maxOption = 6;
    else if (currentLocation === "forest") maxOption = 6;
    else if (currentLocation === "mountains") maxOption = 6;

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

        if (!isValidChoice(choice, maxOption)) {
          throw `Please enter a number between 1 and ${maxOption}.`;
        }

        validChoice = true;

        // Handle choices based on location
        if (currentLocation === "village") {
          if (choiceNum <= 4) {
            // 1-4 are move actions
            move(choiceNum);
          } else if (choiceNum === 5) {
            showStatus();
          } else if (choiceNum === 6) {
            useItem();
          } else if (choiceNum === 7) {
            showHelp();
          } else if (choiceNum === 8) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "blacksmith") {
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
          if (choiceNum === 1) {
            move(1); // search for monsters
          } else if (choiceNum === 2) {
            move(2); // return to village
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
        } else if (currentLocation === "mountains") {
          if (choiceNum === 1) {
            move(1); // enter dragon lair
          } else if (choiceNum === 2) {
            move(2); // return to village
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
