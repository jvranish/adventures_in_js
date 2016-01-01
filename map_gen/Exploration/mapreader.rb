

class MapReader
	
	def initialize
	
	
	end
	
	def readMap
		file = File.new("map.tbm", "r")
		rows = 0
		map = Array.new()
		while (line = file.gets)
			map.append(line.split(","))
			rows+=1
		end
		file.close
		
		return rows, map
	
	end
	
end