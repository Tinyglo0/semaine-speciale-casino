# --------- PYODIDE:env --------- #
from js import document
_prefixes_possibles = ["turtle", "tt"]
if "restart" in globals():
    restart()
else:
    for pref in _prefixes_possibles:
        if pref in globals():
            p = eval(pref)
            p.restart()
            break

def m_a_j():
    cible = "figure1"
    if "done" in globals():
        done()
        document.getElementById(cible).innerHTML = Screen().html
    else:
        for pref in _prefixes_possibles:
            if pref in globals():
                p = eval(pref)
                p.done()
                document.getElementById(cible).innerHTML = p.Screen().html
                break
import random
import os
import time
 
# The Card class definition
class Card:
    def __init__(self, suit, value, card_value):
         
        # Suit of the Card like Spades and Clubs
        self.suit = suit
 
        # Representing Value of the Card like A for Ace, K for King
        self.value = value
 
        # Score Value for the Card like 10 for King
        self.card_value = card_value
 
# Clear the terminal
def clear():
    os.system("clear")
 
# Function to print the cards
def print_cards(cards, hidden):
         
    s = ""
    for card in cards:
        s = s + "\t ________________"
    if hidden:
        s += "\t ________________"
    print(s)
 
 
    s = ""
    for card in cards:
        s = s + "\t|                |"
    if hidden:
        s += "\t|                |"    
    print(s)
 
    s = ""
    for card in cards:
        if card.value == '10':
            s = s + "\t|  {}            |".format(card.value)
        else:
            s = s + "\t|  {}             |".format(card.value)  
    if hidden:
        s += "\t|                |"    
    print(s)
 
    s = ""
    for card in cards:
        s = s + "\t|                |"
    if hidden:
        s += "\t|      * *       |"
    print(s)    
 
    s = ""
    for card in cards:
        s = s + "\t|                |"
    if hidden:
        s += "\t|    *     *     |"
    print(s)    
 
    s = ""
    for card in cards:
        s = s + "\t|                |"
    if hidden:
        s += "\t|   *       *    |"
    print(s)    
 
    s = ""
    for card in cards:
        s = s + "\t|                |"
    if hidden:
        s += "\t|   *       *    |"
    print(s)    
 
    s = ""
    for card in cards:
        s = s + "\t|       {}        |".format(card.suit)
    if hidden:
        s += "\t|          *     |"
    print(s)    
 
    s = ""
    for card in cards:
        s = s + "\t|                |"
    if hidden:
        s += "\t|         *      |"
    print(s)    
 
    s = ""
    for card in cards:
        s = s + "\t|                |"
    if hidden:
        s += "\t|        *       |"
    print(s)
 
    s = ""
    for card in cards:
        s = s + "\t|                |"
    if hidden:
        s += "\t|                |"
    print(s)
 
    s = ""
    for card in cards:
        s = s + "\t|                |"
    if hidden:
        s += "\t|                |"
    print(s)    
 
    s = ""
    for card in cards:
        if card.value == '10':
            s = s + "\t|            {}  |".format(card.value)
        else:
            s = s + "\t|            {}   |".format(card.value)
    if hidden:
        s += "\t|        *       |"        
    print(s)    
         
    s = ""
    for card in cards:
        s = s + "\t|________________|"
    if hidden:
        s += "\t|________________|"
    print(s)        
 
    print()
 
 
# Function for a single game of blackjack
def blackjack_game(deck):
 
    # Cards for both dealer and player
    player_cards = []
    dealer_cards = []
 
    # Scores for both dealer and player
    player_score = 0
    dealer_score = 0
 
    clear()
 
    # Initial dealing for player and dealer
    while len(player_cards) < 2:
 
        # Randomly dealing a card
        player_card = random.choice(deck)
        player_cards.append(player_card)
        deck.remove(player_card)
 
        # Updating the Total des points du joueur
        player_score += player_card.card_value
 
        # In case both the cards are Ace, make the first ace value as 1 
        if len(player_cards) == 2:
            if player_cards[0].card_value == 11 and player_cards[1].card_value == 11:
                player_cards[0].card_value = 1
                player_score -= 10
 
        # Print Cartes du joueur and score      
        print("Cartes du joueur: ")
        print_cards(player_cards, False)
        print("Total des points du joueur = ", player_score)
 
        input()
 
        # Randomly dealing a card
        dealer_card = random.choice(deck)
        dealer_cards.append(dealer_card)
        deck.remove(dealer_card)
 
        # Updating the Total des points du croupier
        dealer_score += dealer_card.card_value
 
        # Print Cartes du croupier and score, keeping in mind to hide the second card and score
        print("Cartes du croupier: ")
        if len(dealer_cards) == 1:
            print_cards(dealer_cards, False)
            print("Total des points du croupier = ", dealer_score)
        else:
            print_cards(dealer_cards[:-1], True)    
            print("Total des points du croupier = ", dealer_score - dealer_cards[-1].card_value)
 
 
        # In case both the cards are Ace, make the second ace value as 1 
        if len(dealer_cards) == 2:
            if dealer_cards[0].card_value == 11 and dealer_cards[1].card_value == 11:
                dealer_cards[1].card_value = 1
                dealer_score -= 10
 
        input()
 
    # Player gets a blackjack   
    if player_score == 21:
        print("Le joueur possède un blackjack!!!!")
        print("Le joueur gagne!!!")
        quit()
 
    clear()
 
    # Print dealer and Cartes du joueur
    print("Cartes du croupier: ")
    print_cards(dealer_cards[:-1], True)
    print("Total des points du croupier = ", dealer_score - dealer_cards[-1].card_value)
 
    print() 
 
    print("Cartes du joueur: ")
    print_cards(player_cards, False)
    print("Total des points du joueur = ", player_score)
 
    # Managing the player moves
    while player_score < 21:
        choice = input("Saisissez T pour tirer une carte ou A pour arreter : ")
 
        # Sanity checks for player's choice
        if len(choice) != 1 or (choice.upper() != 'T' and choice.upper() != 'A'):
            clear()
            print("Mauvais choix, merci de réessayer")
 
        # If player decides to HIT
        if choice.upper() == 'T':
 
            # Dealing a new card
            player_card = random.choice(deck)
            player_cards.append(player_card)
            deck.remove(player_card)
 
            # Updating Total des points du joueur
            player_score += player_card.card_value
 
            # Updating Total des points du joueur in case player's card have ace in them
            c = 0
            while player_score > 21 and c < len(player_cards):
                if player_cards[c].card_value == 11:
                    player_cards[c].card_value = 1
                    player_score -= 10
                    c += 1
                else:
                    c += 1 
 
            clear()     
 
            # Print player and Cartes du croupier
            print("Cartes du croupier: ")
            print_cards(dealer_cards[:-1], True)
            print("Total des points du croupier = ", dealer_score - dealer_cards[-1].card_value)
 
            print()
 
            print("Cartes du joueur: ")
            print_cards(player_cards, False)
            print("Total des points du joueur = ", player_score)
             
        # If player decides to Stand
        if choice.upper() == 'A':
            break
 
 
    clear() 
 
    # Print player and Cartes du croupier
    print("Cartes du joueur: ")
    print_cards(player_cards, False)
    print("Total des points du joueur = ", player_score)
 
    print()
    print("Le croupier révèle sa main....")
 
    print("Cartes du croupier: ")
    print_cards(dealer_cards, False)
    print("Total des points du croupier = ", dealer_score)
 
    # Check if player has a Blackjack
    if player_score == 21:
        print("Le joueur possède un blackjack !!!")
        quit()
 
    # Check if player busts
    if player_score > 21:
        print("Le nombre total de points du joueur est supérieur à 21 - GAME OVER!!!")
        quit()
 
    input() 
 
    # Managing the dealer moves
    while dealer_score < 17:
        clear() 
 
        print("Le croupier décide de rajoute une carte à sa main .....")
 
        # Dealing card for dealer
        dealer_card = random.choice(deck)
        dealer_cards.append(dealer_card)
        deck.remove(dealer_card)
 
        # Updating the dealer's score
        dealer_score += dealer_card.card_value
 
        # Updating Total des points du joueur in case player's card have ace in them
        c = 0
        while dealer_score > 21 and c < len(dealer_cards):
            if dealer_cards[c].card_value == 11:
                dealer_cards[c].card_value = 1
                dealer_score -= 10
                c += 1
            else:
                c += 1
 
        # print player and Cartes du croupier
        print("Cartes du joueur: ")
        print_cards(player_cards, False)
        print("Total des points du joueur = ", player_score)
 
        print()
 
        print("Cartes du croupier: ")
        print_cards(dealer_cards, False)
        print("Total des points du croupier = ", dealer_score)      
 
        input()
 
    # Dealer busts
    if dealer_score > 21:        
        print("Le croupier à plus que 21, vous avez gagné 🎉") 
        quit()  
 
    # Dealer gets a blackjack
    if dealer_score == 21:
        print("Le croupier possède un blackjack!!! Vous avez perdu")
        quit()
 
    # TIE Game
    if dealer_score == player_score:
        print("Egalité!!!!")
 
    # Player Wins
    elif player_score > dealer_score:
        print("Le joueur gagne!!!")                 
 
    # Dealer Wins
    else:
        print("Le croupier gagne!!!")                 
 
if __name__ == '__main__':
 
    # The type of suit
    suits = ["Spades", "Hearts", "Clubs", "Diamonds"]
 
    # The suit value 
    suits_values = {"Spades":"\u2664", "Hearts":"\u2661", "Clubs": "\u2667", "Diamonds": "\u2662"}
 
    # The type of card
    cards = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
 
    # The card value
    cards_values = {"A": 11, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "10":10, "J":10, "Q":10, "K":10}
 
    # The deck of cards
    deck = []
 
    # Loop for every type of suit
    for suit in suits:
 
        # Loop for every type of card in a suit
        for card in cards:
 
            # Adding card to the deck
            deck.append(Card(suits_values[suit], card, cards_values[card]))
     
    blackjack_game(deck) 
# --------- PYODIDE:post_term --------- #
if any(pref in globals() for pref in _prefixes_possibles) and "m_a_j" in globals():
    m_a_j()


# --- PYODIDE:post --- #
if 'post_async' in globals():
    await post_async()

if 'Screen' in globals():
    if Screen().html is None:
        forward(0)
    m_a_j()
elif "turtle" in globals():
    if turtle.Screen().html is None:
        turtle.forward(0)
    m_a_j()

# --- PYODIDE:code --- #
blackjack_game()
