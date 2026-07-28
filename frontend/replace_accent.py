import os
import re

TARGET_DIR = "/Users/prii/Desktop/cloudtask-pro/frontend/src"
PATTERN = re.compile(r'#0EA5E9', re.IGNORECASE)

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace Tailwind arbitrary classes:
    # text-[#0EA5E9] -> text-accent
    # bg-[#0EA5E9] -> bg-accent
    # border-[#0EA5E9] -> border-accent
    # ring-[#0EA5E9] -> ring-accent
    # from-[#0EA5E9] -> from-accent
    # to-[#0EA5E9] -> to-accent
    # shadow-[#0EA5E9] -> shadow-accent
    # shadow-[0_0_16px_rgba(14,165,233,0.4)] -> shadow-[0_0_16px_var(--color-accent)]  # this one is harder to regex generically, but let's stick to #0EA5E9 first
    
    # Simple regex replacements for the arbitrary classes
    new_content = re.sub(r'(text|bg|border|ring|from|to|shadow|outline)-\[#0EA5E9/(\d+)\]', r'\1-accent/\2', content, flags=re.IGNORECASE)
    new_content = re.sub(r'(text|bg|border|ring|from|to|shadow|outline)-\[#0EA5E9\]', r'\1-accent', new_content, flags=re.IGNORECASE)

    # For inline hex strings like color: "#0EA5E9" -> we can change it to "var(--accent)" if it's in a style object, but it's safer to just replace "#0EA5E9" with "var(--accent)" inside strings if we know it's CSS.
    # Actually, recharts properties like stroke="#0EA5E9" will work with "var(--color-accent)".
    new_content = re.sub(r'stroke=["\']#0EA5E9["\']', r'stroke="var(--color-accent)"', new_content, flags=re.IGNORECASE)
    new_content = re.sub(r'fill=["\']#0EA5E9["\']', r'fill="var(--color-accent)"', new_content, flags=re.IGNORECASE)
    new_content = re.sub(r'color:\s*["\']#0EA5E9["\']', r'color: "var(--color-accent)"', new_content, flags=re.IGNORECASE)
    
    # for arrays of colors like ["#0EA5E9", "#8B5CF6"] -> ["var(--color-accent)", "#8B5CF6"]
    new_content = re.sub(r'["\']#0EA5E9["\']', r'"var(--color-accent)"', new_content, flags=re.IGNORECASE)

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    return False

def main():
    changed_files = 0
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.jsx', '.js', '.css', '.html')):
                filepath = os.path.join(root, file)
                if replace_in_file(filepath):
                    changed_files += 1
                    print(f"Updated {filepath}")
    
    print(f"Total files updated: {changed_files}")

if __name__ == "__main__":
    main()
