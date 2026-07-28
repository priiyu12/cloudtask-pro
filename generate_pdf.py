import markdown
from weasyprint import HTML, CSS

with open('layout.md', 'r') as f:
    text = f.read()

# Convert markdown to HTML with table and code block support
html_content = markdown.markdown(text, extensions=['tables', 'fenced_code'])

# Wrap in basic HTML structure with some styling
full_html = f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    body {{
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 2cm;
    }}
    h1, h2, h3, h4 {{
        color: #111;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
    }}
    h1 {{ border-bottom: 2px solid #eaecef; padding-bottom: 0.3em; }}
    h2 {{ border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }}
    table {{
        border-collapse: collapse;
        width: 100%;
        margin-bottom: 1em;
    }}
    th, td {{
        border: 1px solid #dfe2e5;
        padding: 6px 13px;
    }}
    th {{
        background-color: #f6f8fa;
    }}
    pre {{
        background-color: #f6f8fa;
        padding: 16px;
        border-radius: 6px;
        overflow: auto;
        font-family: monospace;
    }}
    code {{
        background-color: #f6f8fa;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: monospace;
    }}
</style>
</head>
<body>
{html_content}
</body>
</html>
"""

# Generate PDF
HTML(string=full_html).write_pdf('layout.pdf')
print("Successfully generated layout.pdf")
