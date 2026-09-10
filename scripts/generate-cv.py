"""Generate the current factual French CV shipped with the portfolio."""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "cv-hassan-haddane.pdf"
REGULAR = Path("C:/Windows/Fonts/arial.ttf")
BOLD = Path("C:/Windows/Fonts/arialbd.ttf")

if not REGULAR.exists() or not BOLD.exists():
    raise FileNotFoundError("Arial TrueType fonts are required to generate the Unicode PDF.")

pdfmetrics.registerFont(TTFont("PortfolioSans", str(REGULAR)))
pdfmetrics.registerFont(TTFont("PortfolioSans-Bold", str(BOLD)))

PAGE = (595.28, 841.89)
canvas = Canvas(str(OUT), pagesize=PAGE)
canvas.setTitle("Hassan Haddane - CV Développeur Web Full-Stack")
canvas.setAuthor("Hassan Haddane")
canvas.setSubject("CV actuel - Full-Stack / Front-End - Rennes")

INK = HexColor("#101522")
MUTED = HexColor("#526076")
BLUE = HexColor("#245BE2")
LINE = HexColor("#D8E0EB")


def para(value, x, y, width, size=8.5, color=INK, bold=False, leading=None):
    style = ParagraphStyle(
        "portfolio-body",
        fontName="PortfolioSans-Bold" if bold else "PortfolioSans",
        fontSize=size,
        leading=leading or size * 1.4,
        textColor=color,
        alignment=TA_LEFT,
        splitLongWords=False,
    )
    block = Paragraph(value, style)
    _, height = block.wrap(width, 800)
    block.drawOn(canvas, x, y - height)
    return y - height


def heading(label, x, y, width):
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(x, y, x + width, y)
    return para(label.upper(), x, y - 11, width, 7.5, BLUE, True) - 12


canvas.setFillColor(BLUE)
canvas.rect(0, 829, PAGE[0], 13, fill=1, stroke=0)

y = 790
y = para("HASSAN HADDANE", 42, y, 510, 29, INK, True, 32)
y = para("Développeur Web Full-Stack / Focus Front-End", 42, y - 7, 510, 12.5, BLUE)
y = para("Rennes, France / Mobilité Bretagne et Nantes / Permis B / Recherche CDI", 42, y - 9, 510, 8.5, MUTED)
y = para("hassanhaddane33s@gmail.com &nbsp; | &nbsp; 07 60 58 26 74", 42, y - 3, 510, 8.5, MUTED)
y = para(
    '<link href="https://www.lowkyz.xyz/fr" color="#245BE2">www.lowkyz.xyz</link> &nbsp; / &nbsp; '
    '<link href="https://github.com/hassanhaddane" color="#245BE2">github.com/hassanhaddane</link> &nbsp; / &nbsp; '
    '<link href="https://linkedin.com/in/hassanhaddane" color="#245BE2">linkedin.com/in/hassanhaddane</link>',
    42,
    y - 4,
    510,
    7.8,
)
y = para(
    "Développeur orienté interfaces web et produits, avec plus de trois ans d'expérience professionnelle. "
    "Je travaille du front-end à l'API, avec une attention constante à la qualité, aux tests et à la livraison.",
    42,
    y - 18,
    510,
    9,
)

LEFT, RIGHT, LEFT_W, RIGHT_W = 42, 380, 306, 173
top = y - 21
y = heading("Expérience professionnelle", LEFT, top, LEFT_W)

experiences = [
    (
        "iAudiogram / My Medical Assistant",
        "Développeur Web Full-Stack - Alternance",
        "09/2022 - 09/2025",
        "Applications médicales liées à l'audiométrie et au suivi patient. Refonte React, TypeScript et Electron, composants responsives, intégration d'API REST, correction d'anomalies et stabilisation des parcours.",
        "Cypress / GitHub / backlog / CI/CD / code reviews / équipe R&amp;D",
    ),
    (
        "Santé Respiratoire France",
        "Développeur Front-End - Stage",
        "01/2022 - 02/2022",
        "Site d'information santé, calculateurs interactifs JavaScript, adaptation responsive, corrections d'affichage et amélioration des parcours utilisateurs.",
        "JavaScript / HTML / CSS",
    ),
    (
        "Biosency",
        "Développeur Front-End - Stage",
        "05/2021 - 06/2021",
        "Plateforme de télésuivi médical en e-santé et IoT. Maintenance front-end, correction de bugs, amélioration UX, tests Cypress E2E et suivi des anomalies.",
        "React / TypeScript / Cypress / Git",
    ),
]

for company, role, period, description, tools in experiences:
    y = para(company, LEFT, y, LEFT_W, 10.2, INK, True)
    y = para(role, LEFT, y - 2, LEFT_W, 8.2, BLUE)
    y = para(period, LEFT, y - 2, LEFT_W, 7.4, MUTED)
    y = para(description, LEFT, y - 6, LEFT_W, 8.1)
    y = para(tools, LEFT, y - 4, LEFT_W, 7.1, MUTED) - 14

y = heading("Projet sélectionné", LEFT, y - 1, LEFT_W)
y = para("GreeCheck", LEFT, y, LEFT_W, 10.2, INK, True)
y = para("PWA d'aide au choix de produits alimentaires - 2025/2026", LEFT, y - 2, LEFT_W, 8.2, BLUE)
y = para(
    "Scan, recherche et comparaison de produits, français / anglais / arabe, historique local, favoris, critères personnalisés et listes. GreeScore calculé localement selon des règles déterministes et explicables.",
    LEFT,
    y - 6,
    LEFT_W,
    8.1,
)
y = para("Next.js App Router / React / TypeScript / Open Food Facts / OpenStreetMap / Vercel", LEFT, y - 4, LEFT_W, 7.1, MUTED)

right_y = heading("Formation", RIGHT, top, RIGHT_W)
education = [
    ("EPSI", "09/2020 - 09/2025", "Expert en informatique et système d'information", "Bac+5 / RNCP40573 niveau 7"),
    ("EPSI", "09/2020 - 09/2023", "Concepteur Développeur d'Application", "Bac+3 / RNCP31678 niveau 6"),
]
for school, period, degree, certification in education:
    right_y = para(school, RIGHT, right_y, RIGHT_W, 9, INK, True)
    right_y = para(period, RIGHT, right_y - 2, RIGHT_W, 7.3, BLUE)
    right_y = para(degree, RIGHT, right_y - 4, RIGHT_W, 8)
    right_y = para(certification, RIGHT, right_y - 3, RIGHT_W, 7.2, MUTED) - 11

right_y = heading("Stack", RIGHT, right_y - 1, RIGHT_W)
stack = [
    ("Front-End", "React, Next.js, TypeScript, JavaScript, Electron, Tailwind CSS"),
    ("Back-End / API", "Python, FastAPI, Django, Flask, Node.js, Express, REST"),
    ("Données", "PostgreSQL, MySQL, MongoDB, Firebase"),
    ("DevOps", "Docker, Git, GitHub Actions, CI/CD, Vercel, Linux"),
    ("Qualité", "Cypress, Vitest, Jest, React Testing Library, tests E2E"),
]
for title, items in stack:
    right_y = para(title, RIGHT, right_y, RIGHT_W, 7.9, INK, True)
    right_y = para(items, RIGHT, right_y - 3, RIGHT_W, 7.3, MUTED) - 5

right_y = heading("Langues", RIGHT, right_y - 2, RIGHT_W)
right_y = para("Français : bilingue<br/>Anglais : professionnel<br/>Arabe : langue maternelle", RIGHT, right_y, RIGHT_W, 7.6, MUTED)

right_y = heading("Outils IA", RIGHT, right_y - 9, RIGHT_W)
right_y = para(
    "Codex et Claude CoWork pour la recherche, le prototypage, la refactorisation et le diagnostic. Suggestions relues, typées, testées et validées humainement.",
    RIGHT,
    right_y,
    RIGHT_W,
    7.3,
    MUTED,
)

canvas.setStrokeColor(LINE)
canvas.line(42, 42, 553, 42)
para("LOWKYZ / HASSAN HADDANE", 42, 32, 280, 7, MUTED)
para("CV ACTUEL / 2026", 445, 32, 108, 7, MUTED)

assert min(y, right_y) > 46, f"Content exceeds page: left={y}, right={right_y}"
canvas.showPage()
canvas.save()
print(OUT)
