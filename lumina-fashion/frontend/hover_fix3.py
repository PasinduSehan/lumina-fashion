from pathlib import Path

path = Path(r'D:\New folder\store\lumina-fashion\frontend\src\components\Hero.jsx')
text = path.read_text()
text = text.replace("backgroundColor: shopEditHovered ? '#fcf3f3' : 'var(--bg-primary)',", "backgroundColor: shopEditHovered ? '#000000' : '#ffffff',")
text = text.replace("color: shopEditHovered ? 'var(--text-secondary)' : 'var(--text-secondary)',", "color: shopEditHovered ? '#ffffff' : '#000000',")
text = text.replace("borderColor: shopEditHovered ? 'rgba(7, 6, 6, 0.8)' : 'var(--bg-primary)',", "borderColor: shopEditHovered ? '#000000' : 'rgba(7, 6, 6, 0.8)',")
path.write_text(text)
