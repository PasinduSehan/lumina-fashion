from pathlib import Path

path = Path(r'D:\New folder\store\lumina-fashion\frontend\src\components\Hero.jsx')
text = path.read_text()
text = text.replace("backgroundColor: shopEditHovered ? 'transparent' : 'var(--bg-primary)',", "backgroundColor: shopEditHovered ? '#F8F6F2' : 'var(--bg-primary)',")
text = text.replace("color: shopEditHovered ? 'var(--text-light)' : 'var(--text-primary)',", "color: shopEditHovered ? 'var(--text-primary)' : 'var(--text-primary)',")
text = text.replace("borderColor: shopEditHovered ? 'rgba(255,255,255,0.6)' : 'var(--bg-primary)',", "borderColor: shopEditHovered ? 'rgba(255,255,255,0.8)' : 'var(--bg-primary)',")
path.write_text(text)
