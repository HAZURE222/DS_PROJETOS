import os
from datetime import datetime, timezone

import discord
from discord.ext import commands
from discord import ui

# ============================
# CONFIGURAÇÃO
# ============================
TOKEN = os.getenv("TOKEN")

TICKETS_CATEGORY_NAME = "Recrutamento"
ROLE_ANALISE = "Em Análise"
ROLE_MEMBER = "Member"
STAFF_ROLES = {"Founder", "Owner", "Leader"}

# ============================
# BOT
# ============================
intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

# ============================
# HELPERS
# ============================
def is_staff(member):
    return any(r.name in STAFF_ROLES for r in member.roles)

# ============================
# EVENTOS
# ============================
@bot.event
async def on_ready():
    await bot.tree.sync()
    print(f"✅ Bot conectado como {bot.user}")

@bot.event
async def on_member_join(member):
    role = discord.utils.get(member.guild.roles, name=ROLE_ANALISE)
    if role:
        await member.add_roles(role)

# ============================
# MODAL DE REGISTRO
# ============================
class RegistroModal(ui.Modal, title="📋 Registro — GAME"):
    nick = ui.TextInput(label="Nick no jogo")
    idade = ui.TextInput(label="Idade")
    plataforma = ui.TextInput(label="Plataforma (PC ou Mobile)")
    estilo = ui.TextInput(label="Estilo (Runner ou Walker)")
    experiencia = ui.TextInput(label="Experiência", style=discord.TextStyle.long)

    async def on_submit(self, interaction: discord.Interaction):
        guild = interaction.guild

        category = discord.utils.get(guild.categories, name=TICKETS_CATEGORY_NAME)
        if not category:
            category = await guild.create_category(TICKETS_CATEGORY_NAME)

        channel = await guild.create_text_channel(
            name=f"registro-{interaction.user.name}",
            category=category
        )

        embed = discord.Embed(
            title="📥 Novo Registro",
            color=discord.Color.green(),
            timestamp=datetime.now(timezone.utc)
        )
        embed.add_field(name="👤 Usuário", value=interaction.user.mention, inline=False)
        embed.add_field(name="🎮 Nick", value=self.nick.value, inline=True)
        embed.add_field(name="📅 Idade", value=self.idade.value, inline=True)
        embed.add_field(name="🖥️ Plataforma", value=self.plataforma.value, inline=True)
        embed.add_field(name="🎯 Estilo", value=self.estilo.value, inline=True)
        embed.add_field(name="⭐ Experiência", value=self.experiencia.value, inline=False)

        await channel.send(
            embed=embed,
            view=RegistroView(
                interaction.user.id,
                self.plataforma.value,
                self.estilo.value
            )
        )

        await interaction.response.send_message(
            "✅ Registro enviado! Aguarde a liderança.",
            ephemeral=True
        )

# ============================
# BOTÕES COM AUTO CARGO
# ============================
class RegistroView(ui.View):
    def __init__(self, user_id, plataforma, estilo):
        super().__init__(timeout=None)
        self.user_id = user_id
        self.plataforma = plataforma.lower()
        self.estilo = estilo.lower()

    @ui.button(label="✅ Aprovar", style=discord.ButtonStyle.success)
    async def aprovar(self, interaction: discord.Interaction, button: ui.Button):
        if not is_staff(interaction.user):
            return await interaction.response.send_message("❌ Sem permissão.", ephemeral=True)

        guild = interaction.guild
        membro = guild.get_member(self.user_id)

        role_member = discord.utils.get(guild.roles, name=ROLE_MEMBER)
        role_analise = discord.utils.get(guild.roles, name=ROLE_ANALISE)

        if role_analise:
            await membro.remove_roles(role_analise)
        if role_member:
            await membro.add_roles(role_member)

        # AUTO CARGO ESTILO
        if "runner" in self.estilo:
            role = discord.utils.get(guild.roles, name="Runner")
            if role:
                await membro.add_roles(role)

        if "walker" in self.estilo:
            role = discord.utils.get(guild.roles, name="Walker")
            if role:
                await membro.add_roles(role)

        # AUTO CARGO PLATAFORMA
        if "pc" in self.plataforma:
            role = discord.utils.get(guild.roles, name="PC")
            if role:
                await membro.add_roles(role)

        if "mobile" in self.plataforma:
            role = discord.utils.get(guild.roles, name="Mobile")
            if role:
                await membro.add_roles(role)

        await interaction.channel.edit(name=f"aprovado-{membro.name}")
        await interaction.response.defer()

    @ui.button(label="❌ Recusar", style=discord.ButtonStyle.danger)
    async def recusar(self, interaction: discord.Interaction, button: ui.Button):
        if not is_staff(interaction.user):
            return await interaction.response.send_message("❌ Sem permissão.", ephemeral=True)

        await interaction.channel.delete(delay=3)

# ============================
# SLASH COMMAND
# ============================
@bot.tree.command(name="registrar", description="Iniciar recrutamento no clã")
async def registrar(interaction: discord.Interaction):
    await interaction.response.send_modal(RegistroModal())

# ============================
# START
# ============================
bot.run(TOKEN)
