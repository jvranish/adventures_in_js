import re
import sys
import base64

def inline_js(match_object):
  indent = match_object.group(1)
  filename = match_object.group(2)
  replacement = indent + "<script> <!-- " + filename + " -->\n"
  with open(filename) as f:
    for line in f.readlines():
      replacement += indent + "  " + line
  replacement += indent + "</script>\n"
  return replacement

def inline_png_images(match_object):
  filename = match_object.group(1)
  with open(filename) as f:
    return '<img src="data:image/png;base64,' + base64.b64encode(f.read()) + '"'

with open("index.html", "rb") as f:
  with open("adventures_in_js.html", "wb") as fout:
    contents = f.read()
    js_inlined = re.sub(r'^(\s*)<script\s+type\s*=\s*"text/javascript"\s+src\s*=\s*"([^"]+)"\s*>\s*</script>', inline_js, contents, 0, re.I|re.M)
    fout.write(re.sub(r'<img\s+src\s*=\s*"([^"]+.png)"', inline_png_images, js_inlined, 0, re.I|re.M))

