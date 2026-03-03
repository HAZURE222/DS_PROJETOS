import random
print("=== jogo de adivinha ===")
print("escolha o nivel de dificuldade:")
print("1- Facil (1 A 10)")
print("2- Medio (1 A 50)")
print("3- Dificil (1 A 100)")
nivel = int(input("digite o nivel: "))
if nivel == 1:
    numero = random.randint(1, 10)
elif nivel == 2:
    numero = random.randint(1, 50)
elif nivel == 3:
    numero = random.randint(1, 100)
else:
    print("nivel invalido")
    exit()

while True:
    palpite = int(input("Digite seu palpite: "))
    if palpite == numero:
        print("Parabens! Voce acertou!")
        break
    elif palpite < numero:
        print("Tente um numero maior.")
    else:
        print("Tente um numero menor.")