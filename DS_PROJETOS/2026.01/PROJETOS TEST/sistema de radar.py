PaisOrigem = input("Qual seu país? (BRA/USA/EUA) ").upper()
VelocidadeCarro = float(input("Qual a velocidade do carro? km/h "))
LimiteSpeed = 80.0

if VelocidadeCarro > LimiteSpeed:
    excesso = VelocidadeCarro - LimiteSpeed
    multa = excesso * 5.0  # Multa base em reais mesmo

    if PaisOrigem == "BRA": # A multa continua o valor base já que vc e BR
        print(f"Você foi multado em R$ {multa:.2f}")

    elif PaisOrigem == "USA":
        dolar = multa / 5.0  # Base do dolar fixo x5
        print(f"You were fined $ {dolar:.2f}")

    elif PaisOrigem == "EUA":
        euro = multa / 6.0 # Base do euro fixo 6x
        print(f"You were fined $ {euro:.2f}")

    else:
        print(f"Você foi multado em R$ {multa:.2f} (País não identificado)") # Pais não indentificado logo segue o valor base e a pessoa muda lá

else:
    print("Você está dentro do limite de velocidade.") # segue viagem