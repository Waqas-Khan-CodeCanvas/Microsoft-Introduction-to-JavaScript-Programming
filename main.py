import tkinter as tk
from tkinter import messagebox, scrolledtext
import random

# ===================== Character Classes =====================
class Character:
    def __init__(self, name, strength, health):
        self.name = name
        self.strength = strength
        self.health = health

    def attack(self):
        return random.randint(1, self.strength)

    def hit(self, points):
        self.health -= points
        if self.health < 0:
            self.health = 0

    def isAlive(self):
        return self.health > 0

    def __str__(self):
        return f"{self.name} | {self.__class__.__name__} | STR: {self.strength} | HP: {self.health}"

class Warrior(Character):
    def attack(self):
        return random.randint(self.strength // 2, self.strength + 2)

class Archer(Character):
    def attack(self):
        return random.randint(1, self.strength + 3)

class Mage(Character):
    def attack(self):
        base = random.randint(1, self.strength)
        if random.random() > 0.8:
            return base + 5  # Critical hit
        return base

# ===================== Game Functions =====================
def create_character(name, char_type):
    strength = random.randint(5, 10)
    health = random.randint(20, 30)
    if char_type == "Warrior":
        return Warrior(name, strength, health)
    elif char_type == "Archer":
        return Archer(name, strength, health)
    elif char_type == "Mage":
        return Mage(name, strength, health)

def duel(c1, c2, output_widget):
    turn = 1
    output_widget.insert(tk.END, f"--- Duel: {c1.name} vs {c2.name} ---\n")
    while c1.isAlive() and c2.isAlive():
        attacker, defender = (c1, c2) if turn % 2 == 1 else (c2, c1)
        damage = attacker.attack()
        defender.hit(damage)
        output_widget.insert(tk.END, f"{attacker.name} attacks {defender.name} for {damage} damage! | {defender.health} HP left\n")
        turn += 1
        output_widget.update()
        output_widget.yview(tk.END)
    winner = c1 if c1.isAlive() else c2
    output_widget.insert(tk.END, f"ðŸ† {winner.name} wins the duel!\n\n")
    return winner

def play_game():
    names_types = [
        (p1_name.get(), p1_type.get()),
        (p2_name.get(), p2_type.get()),
        (p3_name.get(), p3_type.get()),
        (p4_name.get(), p4_type.get())
    ]
    if any(name == "" for name, _ in names_types):
        messagebox.showwarning("Input Error", "Please fill all character names!")
        return

    chars = [create_character(name, ctype) for name, ctype in names_types]
    output_area.delete(1.0, tk.END)

    # Team duels
    winner1 = duel(chars[0], chars[2], output_area)
    winner2 = duel(chars[1], chars[3], output_area)

    # Final duel
    final_winner = duel(winner1, winner2, output_area)
    messagebox.showinfo("Game Over", f"The ultimate winner is {final_winner.name} the {final_winner.__class__.__name__}!")

# ===================== GUI Setup =====================
root = tk.Tk()
root.title("2v2 Game Simulator")
root.geometry("600x500")

# Team 1 Inputs
tk.Label(root, text="Team 1").grid(row=0, column=0, columnspan=2)
tk.Label(root, text="Player 1 Name:").grid(row=1, column=0)
p1_name = tk.Entry(root)
p1_name.grid(row=1, column=1)
p1_type = tk.StringVar(value="Warrior")
tk.OptionMenu(root, p1_type, "Warrior", "Archer", "Mage").grid(row=1, column=2)

tk.Label(root, text="Player 2 Name:").grid(row=2, column=0)
p2_name = tk.Entry(root)
p2_name.grid(row=2, column=1)
p2_type = tk.StringVar(value="Warrior")
tk.OptionMenu(root, p2_type, "Warrior", "Archer", "Mage").grid(row=2, column=2)

# Team 2 Inputs
tk.Label(root, text="Team 2").grid(row=3, column=0, columnspan=2)
tk.Label(root, text="Player 3 Name:").grid(row=4, column=0)
p3_name = tk.Entry(root)
p3_name.grid(row=4, column=1)
p3_type = tk.StringVar(value="Warrior")
tk.OptionMenu(root, p3_type, "Warrior", "Archer", "Mage").grid(row=4, column=2)

tk.Label(root, text="Player 4 Name:").grid(row=5, column=0)
p4_name = tk.Entry(root)
p4_name.grid(row=5, column=1)
p4_type = tk.StringVar(value="Warrior")
tk.OptionMenu(root, p4_type, "Warrior", "Archer", "Mage").grid(row=5, column=2)

# Play button
tk.Button(root, text="Play 2v2 Battle", command=play_game, bg="green", fg="white").grid(row=6, column=0, columnspan=3, pady=10)

# Output area
output_area = scrolledtext.ScrolledText(root, width=70, height=15)
output_area.grid(row=7, column=0, columnspan=3, padx=10, pady=10)

root.mainloop()