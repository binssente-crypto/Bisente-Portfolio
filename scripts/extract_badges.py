import os

import fitz

pub_cert_dir = os.path.join(os.getcwd(), 'public', 'certificates')
pub_badge_dir = os.path.join(os.getcwd(), 'public', 'images', 'credentials')
os.makedirs(pub_badge_dir, exist_ok=True)

# 1. Extract from each pdf in public/certificates/
for f in os.listdir(pub_cert_dir):
    if not f.endswith('.pdf'):
        continue
    name = f[:-4]
    if name.startswith(('seminar-', 'workshop-')):
        continue

    doc = fitz.open(os.path.join(pub_cert_dir, f))
    page = doc[0]
    extracted = False
    for img in page.get_images():
        xref = img[0]
        base_img = doc.extract_image(xref)
        w, h = base_img['width'], base_img['height']
        if w == h and w >= 200:
            out_path = os.path.join(pub_badge_dir, f'{name}.png')
            with open(out_path, 'wb') as out_f:
                out_f.write(base_img['image'])
            print(f'Extracted {name}.png ({w}x{h}, {len(base_img["image"])} bytes)')
            extracted = True
            break
    if not extracted:
        print(f'WARNING: Could not extract badge for {name}')

# 2. Extract ai-fundamentals-ibm.png from AIFundamentals in downloads
ibm_pdf = r'C:\Users\Binsu\Downloads\IT CERTS AND BADGES\CERTIFICATES\AIFundamentalsFoundationsforUnderstandingAIv120260922-20-wuorm9.pdf'
if os.path.exists(ibm_pdf):
    doc = fitz.open(ibm_pdf)
    for img in doc[0].get_images():
        xref = img[0]
        base_img = doc.extract_image(xref)
        w, h = base_img['width'], base_img['height']
        if w == h and w >= 200:
            out_path = os.path.join(pub_badge_dir, 'ai-fundamentals-ibm.png')
            with open(out_path, 'wb') as out_f:
                out_f.write(base_img['image'])
            print(f'Extracted ai-fundamentals-ibm.png ({w}x{h}, {len(base_img["image"])} bytes)')
            break
