import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

with open('layout.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace symbols
replacements = {
    '✅': '[Y]',
    '❌': '[N]',
    '↓': '->',
    '│': '|',
    '├──': '|--',
    '└──': '\\--',
    '▼': 'v',
    '₹': 'Rs '
}
for k, v in replacements.items():
    text = text.replace(k, v)

# Strip out weird characters
text = text.encode('ascii', 'ignore').decode('ascii')

doc = SimpleDocTemplate("layout.pdf", pagesize=letter)
styles = getSampleStyleSheet()
normal_style = styles["Normal"]
normal_style.fontName = 'Courier'  # Monospace handles tree structures better

h2_style = styles["Heading2"]
h3_style = styles["Heading3"]
h4_style = styles["Heading4"]

story = []
story.append(Paragraph("<b>CloudTask Pro Platform Architecture</b>", styles["Heading1"]))
story.append(Spacer(1, 12))

for line in text.split('\n'):
    line = line.replace('<', '&lt;').replace('>', '&gt;')
    if line.startswith('## '):
        story.append(Spacer(1, 12))
        story.append(Paragraph(f"<b>{line[3:]}</b>", h2_style))
    elif line.startswith('### '):
        story.append(Spacer(1, 6))
        story.append(Paragraph(f"<b>{line[4:]}</b>", h3_style))
    elif line.startswith('#### '):
        story.append(Spacer(1, 4))
        story.append(Paragraph(f"<b>{line[5:]}</b>", h4_style))
    elif line.startswith('**') and line.endswith('**'):
        story.append(Paragraph(f"<b>{line.replace('**', '')}</b>", normal_style))
    elif '---' in line:
        story.append(Spacer(1, 12))
        story.append(Paragraph("_" * 50, normal_style))
        story.append(Spacer(1, 12))
    elif line.strip() == "":
        story.append(Spacer(1, 6))
    else:
        # Keep spaces for formatting (e.g., trees)
        line = line.replace(' ', '&nbsp;')
        story.append(Paragraph(line, normal_style))

doc.build(story)
print("Successfully generated layout.pdf with ReportLab")
