import sys
import io

def ler_operador():
    operadores_validos = {"+", "-", "*", "/"}
    while True:
        op = input("Digite o operador (+, -, *, /): ").strip()
        if op in operadores_validos:
            return op
        print("[ERRO] Operador inválido. Tente novamente.")

def ler_numero(mensagem):
    while True:
        try:
            return float(input(mensagem).strip())
        except ValueError:
            print("[ERRO] Entrada inválida. Digite um número.")

num1 = ler_numero("Digite o primeiro número: ")
operador = ler_operador()
num2 = ler_numero("Digite o segundo número: ")

expressao = f"{num1} {operador} {num2}"

print("\n--- Cálculo Feito ---")
print(expressao)

try:
    resultado = eval(expressao)
    print(f"Resultado: {resultado}")
except ZeroDivisionError:
    print("[ERRO] Divisão por zero não é permitida.")