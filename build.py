import os
d=os.path.dirname(os.path.abspath(__file__))
r=lambda p: open(os.path.join(d,p)).read()
shell=r('src/shell.html')
page=shell.replace('/*CSS*/',r('src/styles.css')).replace('/*LOGO*/',r('logo_symbol.txt')).replace('<script>/*BANNERS*/</script>','<script>'+r('src/banners.js')+'</script>').replace('<script>/*IMAGES*/</script>','<script>'+r('src/images.js')+'</script>').replace('<script>/*ABOUT*/</script>','<script>'+r('src/about.js')+'</script>').replace('/*DATA*/',r('src/data.js')).replace('/*APP*/',r('src/app.js'))
open(os.path.join(d,'site.html'),'w').write(page)  # artifact body (publish wraps the skeleton)
local=shell.replace('/*CSS*/',r('src/styles.css')).replace('/*LOGO*/',r('logo_symbol.txt')).replace('<script>/*BANNERS*/</script>','<script src="src/banners.js"></script>').replace('<script>/*IMAGES*/</script>','<script src="src/images.js"></script>').replace('<script>/*ABOUT*/</script>','<script src="src/about.js"></script>').replace('/*DATA*/',r('src/data.js')).replace('/*APP*/',r('src/app.js'))
full='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+local.replace('<a class="sr-only"','</head>\n<body>\n<a class="sr-only"',1)+'\n</body>\n</html>\n'
open(os.path.join(d,'index.html'),'w').write(full)
print(len(page))
