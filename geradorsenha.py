import random
import string

print("===GERADOR DE SENHA===")
tamanho = int(input("Digite o tamanho da senha: "))
maiusculas = input("Incluir letras maiúsculas? (s/n): ").lower() == 's'
minusculas = input("Incluir letras minúsculas? (s/n): ").lower() == 's'
numeros = input("Incluir números? (s/n): ").lower() == 's'
simbolos = input("Incluir símbolos? (s/n): ").lower() == 's'

caracteres = ''
if maiusculas:
    caracteres += string.ascii_uppercase
if minusculas:
    caracteres += string.ascii_lowercase
if numeros:
    caracteres += string.digits
if simbolos:
    caracteres += string.punctuation
if not caracteres:
    print("Nenhum tipo de caractere selecionado. Gerando senha com letras minúsculas por padrão.")
    caracteres = string.ascii_lowercase
senha = ''.join(random.choice(caracteres) for _ in range(tamanho))
print("Senha gerada:", senha)

with open('senha.txt', 'w') as arquivo:
    arquivo.write(senha)
    print("Senha salva em 'senha.txt'.")

    quantidadesdesenhas = int(input("Quantas senhas deseja gerar? "))
    for i in range(quantidadesdesenhas):
        senha_gerada = ''.join(random.choice(caracteres) for _ in range(tamanho))
        print(f"Senha {i + 1}: {senha_gerada}")

        with open('senhas.txt', 'a') as arquivo:
           arquivo.write(senha_gerada + '\n')
    print(f"Senha {i + 1} salva em 'senhasmulti.txt'.")
