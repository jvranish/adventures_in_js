import argparse
import json
import os.path
import re
parser = argparse.ArgumentParser()
# parser.add_argument('--foo', help='foo help')
parser.add_argument('--input')
# parser.add_argument('--input')
args = parser.parse_args()

def quadCoords(rect):
  a = [ rect['x'], rect['y'] ]
  b = [ rect['x'] + rect['w'], rect['y']]
  c = [ rect['x'], rect['y'] + rect['h'] ]
  d = [ rect['x'] + rect['w'], rect['y'] + rect['h'] ]
  return a + c + b + b + c + d

def createSpriteSheetBufferInfo(spritesheet):
  vertexCoords = []
  textureCoords = []
  frameOffsets = {}
  bufferOffset = 0
  for k, v in spritesheet["frames"].items():
    vertexCoords.extend(quadCoords(v['spriteSourceSize']))
    textureCoords.extend(quadCoords(v['frame']))
    action, character, direction, frame_num = re.match(r"([^/]+)/([^.]+)\.\1\.(\w+)\.(\d+)\.png", k).groups()
    # frameOffsets[k] = bufferOffset
    if character not in frameOffsets:
      frameOffsets[character] = {}
    if action not in frameOffsets[character]:
      frameOffsets[character][action] = {}
    if direction not in frameOffsets[character][action]:
      frameOffsets[character][action][direction] = {}
    frameOffsets[character][action][direction][int(frame_num)] = bufferOffset
    bufferOffset += 1

  return { "textureCoords": textureCoords,
           "vertexCoords": vertexCoords,
           "frameOffsets": frameOffsets }


with open(args.input) as f:
  basename, ext = os.path.splitext(os.path.basename(args.input))
  # print basename + ".js"
  var_name = basename.replace('-', '_')
  sprite_info = json.loads(f.read())
  # print sprite_info['meta']
  # print len(sprite_info['frames'])
  result = json.dumps(createSpriteSheetBufferInfo(sprite_info))

  print "var sprites = " + result




#   "frame": {"x":2,"y":2,"w":52,"h":61},
#   "rotated": false,
#   "trimmed": true,
#   "spriteSourceSize": {"x":52,"y":36,"w":52,"h":61},

# function quadCoords(rect) {
#   var a = [rect.x, rect.y];
#   var b = [rect.x + rect.w, rect.y];
#   var c = [rect.x, rect.y + rect.h];
#   var d = [rect.x + rect.w, rect.y + rect.h];
#   //a c b
#   //b c d
#   return a.concat(c).concat(b).concat(b).concat(c).concat(d);
# }

# function createSpriteSheetBufferInfo(spritesheet) {
#   var textureCoords = [];
#   var vertexCoords = [];
#   var frameOffsets = {};
#   var bufferOffset = 0;
#   for (key in spritesheet.frames)
#   {
#     // var offset_x = 64;
#     // var offset_y = 64;
#     textureCoords.concat(quadCoords(spritesheet.frames[key].frame));
#     vertexCoords.concat(quadCoords(spritesheet.frames[key].spriteSourceSize));
#     frameOffsets[key] = bufferOffset;
#     bufferOffset += 2;
#   }
#   return { textureCoords: textureCoords,
#            vertexCoords: vertexCoords,
#            bufferOffset: bufferOffset };
# }


