import tkinter as tk
from tkinter import messagebox, scrolledtext, ttk
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

# ===================== Game Logic =====================
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
    insert_colored_text(output_widget, f"\n⚔️ Duel: {c1.name} vs {c2.name}\n", "title")

    while c1.isAlive() and c2.isAlive():
        attacker, defender = (c1, c2) if turn % 2 == 1 else (c2, c1)
        damage = attacker.attack()
        defender.hit(damage)
        msg = f"{attacker.name} attacks {defender.name} for {damage} damage! | {defender.health} HP left\n"
        insert_colored_text(output_widget, msg, "attack")
        output_widget.update()
        output_widget.yview(tk.END)
        turn += 1

    winner = c1 if c1.isAlive() else c2
    insert_colored_text(output_widget, f"🏆 {winner.name} wins the duel!\n", "winner")
    return winner

def play_game():
    names_types = [
        (p1_name.get(), p1_type.get()),
        (p2_name.get(), p2_type.get()),
        (p3_name.get(), p3_type.get()),
        (p4_name.get(), p4_type.get())
    ]

    if any(name.strip() == "" for name, _ in names_types):
        messagebox.showwarning("Input Error", "Please fill all character names!")
        return

    chars = [create_character(name, ctype) for name, ctype in names_types]
    output_area.config(state="normal")
    output_area.delete(1.0, tk.END)

    insert_colored_text(output_area, "🏁 The Battle Begins!\n", "start")

    winner1 = duel(chars[0], chars[2], output_area)
    winner2 = duel(chars[1], chars[3], output_area)

    final_winner = duel(winner1, winner2, output_area)

    insert_colored_text(output_area, f"\n🎉 The ultimate winner is {final_winner.name} the {final_winner.__class__.__name__}!\n", "final")
    output_area.config(state="disabled")
    messagebox.showinfo("Game Over", f"The ultimate winner is {final_winner.name} the {final_winner.__class__.__name__}!")

def reset_game():
    for entry in [p1_name, p2_name, p3_name, p4_name]:
        entry.delete(0, tk.END)
    output_area.config(state="normal")
    output_area.delete(1.0, tk.END)
    insert_colored_text(output_area, "Game reset. Ready for a new battle!\n", "reset")
    output_area.config(state="disabled")

# ===================== Helper Function for Colored Text =====================
def insert_colored_text(widget, text, tag):
    widget.insert(tk.END, text, tag)
    widget.see(tk.END)

# ===================== GUI Setup =====================
root = tk.Tk()
root.title("⚔️ 2v2 Battle Arena")
root.geometry("700x550")
root.config(bg="#1e1e2e")

style = ttk.Style()
style.configure("TLabel", background="#1e1e2e", foreground="white", font=("Segoe UI", 10))
style.configure("TButton", font=("Segoe UI", 10, "bold"))
style.configure("TMenubutton", font=("Segoe UI", 10))

# Title
tk.Label(root, text="⚔️ 2v2 Battle Arena", font=("Segoe UI", 20, "bold"), fg="white", bg="#1e1e2e").pack(pady=10)

# Team Frames
frame = tk.Frame(root, bg="#1e1e2e")
frame.pack(pady=5)

# Team 1
team1 = tk.LabelFrame(frame, text="Team 1", bg="#2e2e3e", fg="white", font=("Segoe UI", 11, "bold"), padx=10, pady=5)
team1.grid(row=0, column=0, padx=10, pady=5)

tk.Label(team1, text="Player 1 Name:", bg="#2e2e3e", fg="white").grid(row=0, column=0, pady=5)
p1_name = tk.Entry(team1, width=18)
p1_name.grid(row=0, column=1)
p1_type = tk.StringVar(value="Warrior")
ttk.OptionMenu(team1, p1_type, "Warrior", "Archer", "Mage").grid(row=0, column=2, padx=5)

tk.Label(team1, text="Player 2 Name:", bg="#2e2e3e", fg="white").grid(row=1, column=0, pady=5)
p2_name = tk.Entry(team1, width=18)
p2_name.grid(row=1, column=1)
p2_type = tk.StringVar(value="Archer")
ttk.OptionMenu(team1, p2_type, "Warrior", "Archer", "Mage").grid(row=1, column=2, padx=5)

# Team 2
team2 = tk.LabelFrame(frame, text="Team 2", bg="#2e2e3e", fg="white", font=("Segoe UI", 11, "bold"), padx=10, pady=5)
team2.grid(row=0, column=1, padx=10, pady=5)

tk.Label(team2, text="Player 3 Name:", bg="#2e2e3e", fg="white").grid(row=0, column=0, pady=5)
p3_name = tk.Entry(team2, width=18)
p3_name.grid(row=0, column=1)
p3_type = tk.StringVar(value="Mage")
ttk.OptionMenu(team2, p3_type, "Warrior", "Archer", "Mage").grid(row=0, column=2, padx=5)

tk.Label(team2, text="Player 4 Name:", bg="#2e2e3e", fg="white").grid(row=1, column=0, pady=5)
p4_name = tk.Entry(team2, width=18)
p4_name.grid(row=1, column=1)
p4_type = tk.StringVar(value="Warrior")
ttk.OptionMenu(team2, p4_type, "Warrior", "Archer", "Mage").grid(row=1, column=2, padx=5)

# Buttons
btn_frame = tk.Frame(root, bg="#1e1e2e")
btn_frame.pack(pady=10)
tk.Button(btn_frame, text="▶ Play 2v2 Battle", command=play_game, bg="#4CAF50", fg="white", font=("Segoe UI", 10, "bold"), width=18).grid(row=0, column=0, padx=10)
tk.Button(btn_frame, text="🔄 Reset", command=reset_game, bg="#f44336", fg="white", font=("Segoe UI", 10, "bold"), width=12).grid(row=0, column=1, padx=10)

# Output area
output_area = tk.Text(root, width=85, height=15, bg="#121212", fg="white", font=("Consolas", 11), wrap="word")
output_area.pack(padx=15, pady=10)
output_area.insert(tk.END, "Welcome to the 2v2 Battle Arena!\n")
output_area.config(state="disabled")

# Tag colors
output_area.tag_config("start", foreground="orange", font=("Consolas", 11, "bold"))
output_area.tag_config("title", foreground="yellow", font=("Consolas", 11, "bold"))
output_area.tag_config("attack", foreground="#00bfff")
output_area.tag_config("winner", foreground="#90ee90", font=("Consolas", 11, "bold"))
output_area.tag_config("final", foreground="#ff69b4", font=("Consolas", 12, "bold"))
output_area.tag_config("reset", foreground="gray")

root.mainloop()
