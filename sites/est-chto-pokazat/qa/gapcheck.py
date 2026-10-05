# Анализ снимков из gc/: ищет щель у верхнего/нижнего края кадра.
# Щель = однородная полоса у края (по всей ширине одного тона), резко отличающаяся от кадра под ней.
import glob, os, sys, numpy as np
OUT=os.environ.get('GC_DIR','tmp/gc')
from PIL import Image
bad=[]; n=0
for f in sorted(glob.glob(OUT+'/*.png')):
    a=np.asarray(Image.open(f).convert('L')).astype(float); H,W=a.shape; n+=1
    for edge,rows in (('top',a[:80]),('bottom',a[::-1][:80])):
        band=rows[:, int(W*.05):int(W*.95)]
        med=np.median(band,axis=1)
        jump=np.abs(np.diff(med[:60])); j=int(jump.argmax())
        if jump[j]>25 and abs(med[:max(j,1)].mean()-med[j+1:j+20].mean())>25:
            uniform=band[:max(j,1)].std(axis=1).mean()<8
            if uniform: bad.append((f.split('/')[-1],edge,'полоса до %d px от края'%(j+1),round(float(jump[j]),1)))
for x in bad: print(x)
print('снимков',n,'щелей',len(bad))

sys.exit(1 if bad else 0)
