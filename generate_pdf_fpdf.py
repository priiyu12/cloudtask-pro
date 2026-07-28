from fpdf import FPDF

with open('layout.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace unicode symbols that standard fpdf fonts struggle with
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

# Fallback: remove any other un-encodable char (helvetica uses latin-1 basically)
text = text.encode('latin-1', 'ignore').decode('latin-1')

class PDF(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 15)
        self.cell(0, 10, text="CloudTask Pro Platform Architecture", border=False, align="C")
        self.ln(15)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.cell(0, 10, text=f"Page {self.page_no()}", align="C")

pdf = PDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)

for line in text.split('\n'):
    if line.startswith('## '):
        pdf.ln(5)
        pdf.set_font("helvetica", "B", 14)
        pdf.multi_cell(0, 10, text=line[3:])
        pdf.set_font("helvetica", "", 10)
    elif line.startswith('### '):
        pdf.ln(3)
        pdf.set_font("helvetica", "B", 12)
        pdf.multi_cell(0, 8, text=line[4:])
        pdf.set_font("helvetica", "", 10)
    elif line.startswith('#### '):
        pdf.ln(2)
        pdf.set_font("helvetica", "B", 11)
        pdf.multi_cell(0, 6, text=line[5:])
        pdf.set_font("helvetica", "", 10)
    elif line.startswith('**') and line.endswith('**'):
        pdf.set_font("helvetica", "B", 10)
        pdf.multi_cell(0, 6, text=line.replace('**', ''))
        pdf.set_font("helvetica", "", 10)
    elif '---' in line:
        pdf.ln(5)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(5)
    else:
        pdf.set_font("helvetica", "", 10)
        # Handle empty lines so they don't crash
        if not line.strip():
            pdf.ln(5)
        else:
            pdf.multi_cell(0, 5, text=line)

pdf.output("layout.pdf")
print("Successfully generated layout.pdf with FPDF2")
