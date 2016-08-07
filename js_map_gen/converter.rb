# must go through and find cliff elevation (if elevation change is 2 or greater then add cliff)
#
#angles/facings:
# 8 1 2
# 7 0 3
# 6 5 4
# 
require 'json'


class Converter
	def initialize(map, rows)
		@map = map
		@rows = rows
		@map_struct = Struct.new :elevation, :special, :type, :offset, :traversable
		
		
		@new_map = Array.new(@rows*2) { Array.new(@rows*2) { @map_struct.new -1, "", "Grass", [0,0], true}} 
		@json_map = Array.new(@rows*2) { Array.new(@rows*2) {[]}}
		@tile_list = {
		  "Cliff8a" => 0,
		  "Cliff8b" => 112,
		  "Cliff1" => 2,
		  "Cliff7" => 32,
		  "Cliff2a" => 4,
		  "Cliff2b" => 114,
		  "Cliff3" => 36,
		  "Cliff4a" => 68,
		  "Cliff4b" => 146,
		  "Cliff5" => 66,
		  "Cliff6a" => 64,
		  "Cliff6b" => 144,
		  "Grass" => 79,
		  "Stone" => 10,
		  "Ocean" => 79
		}
		
	end
	
	#convert map for new tileset and expand map so that each tile of the original map is expanded into four tiles
	# on this map (this allows for better cliffs)
	def convert
		#n and m are special counters used to keep track of where we are in new_map
		
		#clean map from annomolies
		#remove annomolies that I can't make workd
		
		for i in (0..@rows-1)
			for j in (0..@rows-1)
				c1 = @map[i][j-1 > 0? j-1 : @rows-1]
				c3 = @map[i+1 < @rows? i+1 : 0][j]
				c5 = @map[i][j+1 < @rows? j+1 : 0]
				c7 = @map[i-1 > 0? i-1 : @rows-1][j]
				
				c2 = @map[i+1 < @rows? i+1 : 0][j-1 > 0? j-1 : @rows-1]
				c4 = @map[i+1 < @rows? i+1 : 0][j+1 < @rows? j+1 : 0]
				c6 = @map[i-1 > 0? i-1 : @rows-1][j+1 < @rows? j+1 : 0]
				c8 = @map[i-1 > 0? i-1 : @rows-1][j-1 > 0? j-1 : @rows-1]
				
				#elevation at 0
				e = @map[i][j].elevation
				if e >= 4 && c5.elevation < 4 && c4.elevation >= 4 && c3.elevation < 4
					c5.elevation = 7
					c3.elevation = 7
					@map[i+1 < @rows? i+1 : 0][j].elevation = 7
					@map[i][j+1 < @rows? j+1 : 0].elevation = 7
				end
				if e >= 4 && c7.elevation < 4 && c6.elevation >= 4 && c5.elevation < 4
					c7.elevation = 6
					c5.elevation = 6
					@map[i][j+1 < @rows? j+1 : 0].elevation = 4
					@map[i-1 > 0? i-1 : @rows-1][j].elevation = 4
				end
			end
		end
		n = 0
		for i in (0..@rows-1)
			m = 0
			for j in (0..@rows-1)
				#if location on map is an ocean then its not a cliff (durp)
				if @map[i][j].type != "Ocean" 
					
					cliff_elev = 5
					stone_elev = 3
					
					#8 1 2
					#7 0 3
					#6 5 4
					c1 = @map[i][j-1 > 0? j-1 : @rows-1]
					c3 = @map[i+1 < @rows? i+1 : 0][j]
					c5 = @map[i][j+1 < @rows? j+1 : 0]
					c7 = @map[i-1 > 0? i-1 : @rows-1][j]
					
					c2 = @map[i+1 < @rows? i+1 : 0][j-1 > 0? j-1 : @rows-1]
					c4 = @map[i+1 < @rows? i+1 : 0][j+1 < @rows? j+1 : 0]
					c6 = @map[i-1 > 0? i-1 : @rows-1][j+1 < @rows? j+1 : 0]
					c8 = @map[i-1 > 0? i-1 : @rows-1][j-1 > 0? j-1 : @rows-1]
					
					#elevation at 0
					e = @map[i][j].elevation
					
					
					
					# *************** *************** **********************
					# - Conditions for upper left corner of expanded tile - 
					# *************** *************** **********************
					
					
					# *************** *************** **********************
					# Grass and Stone Edge
					# *************** *************** **********************
					
					#condition for Edge8a (concave) - (c1, c8 and c7 are all lower than e)
					# if e >= 2 && c1.elevation < 2 && c8.elevation < 2 && c7.elevation < 2  
						# @new_map[n][m].elevation = @map[i][j].elevation
						# @new_map[n][m].type = "Edge8a"		
					# #condition for Edge8b (convex) - (c1 and c7 are the same as e but 8 is lower)
					# elsif e >= 2 && c1.elevation >= 2 && c8.elevation < 2 && c7.elevation >= 2
						# @new_map[n][m].elevation = @map[i][j].elevation
						# @new_map[n][m].type = "Edge8b"
					# #condition for Cliff1 (north) - (c1 and c8 are lower than e but 7 is the same)
					# elsif e >= 2 && c1.elevation < 2 && c8.elevation < 2 && c7.elevation >= 2
						# @new_map[n][m].elevation = @map[i][j].elevation
						# @new_map[n][m].type = "Edge1"
					# #condition for Cliff7 (west) - (c7 and c8 are lower than e but 1 is the same)
					# elsif e >= 2 && c1.elevation >= 2 && c8.elevation < 2 && c7.elevation < 2
						# @new_map[n][m].elevation = @map[i][j].elevation
						# @new_map[n][m].type = "Edge7"
					
					# *************** *************** **********************
					# Cliff
					# *************** *************** **********************
					
					#condition for Cliff8a (concave) - (c1, c8 and c7 are all lower than e)
					if e >= 4 && c1.elevation < 4 && c8.elevation < 4 && c7.elevation < 4  
						@new_map[n][m].elevation = @map[i][j].elevation
						@new_map[n][m].type = "Cliff8a"
						@new_map[n][m].offset = [1,1]
						createCliff(n, m, 2, 2)	
					#condition for Cliff8b (convex) - (c1 and c7 are the same as e but 8 is lower)
					elsif e >= 4 && c1.elevation >= 4 && c8.elevation < 4 && c7.elevation >= 4
						@new_map[n][m].elevation = @map[i][j].elevation
						@new_map[n][m].type = "Cliff8b"
						@new_map[n][m].offset = [1,1]	
						createCliff(n, m, 2, 2)		
					#condition for Cliff1 (north) - (c1 and c8 are lower than e but 7 is the same)
					elsif e >= 4 && c1.elevation < 4 && c8.elevation < 4 && c7.elevation >= 4
						@new_map[n][m].elevation = @map[i][j].elevation
						@new_map[n][m].type = "Cliff1"
						@new_map[n][m].offset = [0,1]
						createCliff(n, m, 1, 2)
					#condition for Cliff7 (west) - (c7 and c8 are lower than e but 1 is the same)
					elsif e >= 4 && c1.elevation >= 4 && c8.elevation < 4 && c7.elevation < 4
						@new_map[n][m].elevation = @map[i][j].elevation
						@new_map[n][m].type = "Cliff7"
						@new_map[n][m].offset = [1,0]
						createCliff(n, m, 2, 1)
					else
						createGrass(n, m, i, j)
					end 
					#8 1 2
					#7 0 3
					#6 5 4
					# *************** *************** **********************
					# - Conditions for upper right corner of expanded tile - 
					# *************** *************** **********************
					
					# *************** *************** **********************
					# Grass and Stone
					# *************** *************** **********************
					
					#condition for Edge2a (concave) - (c1, c2 and c3 are all lower than e)
					# if e >= 2 && c1.elevation < 2 && c2.elevation < 2 && c3.elevation < 2
						# @new_map[n+1][m].elevation = @map[i][j].elevation
						# @new_map[n+1][m].type = "Edge2a"
					# #condition for Edge2b (convex) - (c1 and c3 are the same as e but 2 is lower
					# elsif e >= 2 && c1.elevation >= 2 && c2.elevation < 2 && c3.elevation >= 2
						# @new_map[n+1][m].elevation = @map[i][j].elevation
						# @new_map[n+1][m].type = "Edge2b"
					# #condition for Edge1 (north) - (c1 and c2 are lower than e but 3 is the same)
					# elsif e >= 2 && c1.elevation < 2 && c2.elevation < 2 && c3.elevation >= 2
						# @new_map[n+1][m].elevation = @map[i][j].elevation
						# @new_map[n+1][m].type = "Edge1"
					# #condition for Edge3 (east) - (c3 and c2 are lower than e but 1 is the same)
					# elsif e >= 2 && c1.elevation >= 2 && c2.elevation < 2 && c3.elevation < 2
						# @new_map[n+1][m].elevation = @map[i][j].elevation
						# @new_map[n+1][m].type = "Edge3"
						
					# *************** *************** **********************
					# Cliff
					# *************** *************** **********************
					
					#condition for Cliff2a (concave) - (c1, c2 and c3 are all lower than e)
					if e >= 4 && c1.elevation < 4 && c2.elevation < 4 && c3.elevation < 4
						@new_map[n+1][m].elevation = @map[i][j].elevation
						@new_map[n+1][m].type = "Cliff2a"
						@new_map[n+1][m].offset = [0,1]
						createCliff(n+1, m, 2, 2)
					#condition for Cliff2b (convex) - (c1 and c3 are the same as e but 2 is lower
					elsif e >= 4 && c1.elevation >= 4 && c2.elevation < 4 && c3.elevation >= 4
						@new_map[n+1][m].elevation = @map[i][j].elevation
						@new_map[n+1][m].type = "Cliff2b"
						@new_map[n+1][m].offset = [0,1]
						createCliff(n+1, m, 2, 2)
					#condition for Cliff1 (north) - (c1 and c2 are lower than e but 3 is the same)
					elsif e >= 4 && c1.elevation < 4 && c2.elevation < 4 && c3.elevation >= 4
						@new_map[n+1][m].elevation = @map[i][j].elevation
						@new_map[n+1][m].type = "Cliff1"
						@new_map[n+1][m].offset = [0,1]
						createCliff(n+1, m, 1, 2)						
					#condition for Cliff3 (east) - (c3 and c2 are lower than e but 1 is the same)
					elsif e >= 4 && c1.elevation >= 4 && c2.elevation < 4 && c3.elevation < 4
						@new_map[n+1][m].elevation = @map[i][j].elevation
						@new_map[n+1][m].type = "Cliff3"
						@new_map[n+1][m].offset = [0,0]
						createCliff(n+1, m, 2, 1)
					else
						createGrass(n+1, m, i, j)
					end
					#8 1 2
					#7 0 3
					#6 5 4
					# *************** *************** **********************
					# - Conditions for lower right corner of expanded tile - 
					# *************** *************** **********************
										
					# *************** *************** **********************
					# Grass and Stone
					# *************** *************** **********************
					
					#condition for Edge4a (concave) - (c5, c4 and c3 are all lower than e)
					# if e >= 2 && c5.elevation < 2 && c4.elevation < 2 && c3.elevation < 2
						# @new_map[n+1][m+1].elevation = @map[i][j].elevation
						# @new_map[n+1][m+1].type = "Edge4a"					
					# #condition for Edge4b (convex) - (c5 and c3 are the same as e but 4 is lower)
					# elsif e >= 2 && c5.elevation >= 2 && c4.elevation < 2 && c3.elevation >= 2
						# @new_map[n+1][m+1].elevation = @map[i][j].elevation
						# @new_map[n+1][m+1].type = "Edge4b"
					# #condition for Edge5 (south) - (c5 and c4 are lower than e but 3 is the same)
					# elsif e >= 2 && c5.elevation < 2 && c4.elevation < 2 && c3.elevation >= 2
						# @new_map[n+1][m+1].elevation = @map[i][j].elevation
						# @new_map[n+1][m+1].type = "Edge5"
					# #condition for Edge3 (east) - (c3 and c2 are lower than e but 1 is the same)
					# elsif e >= 2 && c5.elevation >= 2 && c4.elevation < 2 && c3.elevation < 2
						# @new_map[n+1][m+1].elevation = @map[i][j].elevation
						# @new_map[n+1][m+1].type = "Edge3"
						
					# *************** *************** **********************
					# Cliff
					# *************** *************** **********************
					
					#condition for Cliff4a (concave) - (c5, c4 and c3 are all lower than e)
					if e >= 4 && c5.elevation < 4 && c4.elevation < 4 && c3.elevation < 4
						@new_map[n+1][m+1].elevation = @map[i][j].elevation
						@new_map[n+1][m+1].type = "Cliff4a"
						@new_map[n+1][m+1].offset = [0,0]
						createCliff(n+1, m+1, 2, 3)
					#condition for Cliff4b (convex) - (c5 and c3 are the same as e but 4 is lower)
					elsif e >= 4 && c5.elevation >= 4 && c4.elevation < 4 && c3.elevation >= 4
						@new_map[n+1][m+1].elevation = @map[i][j].elevation
						@new_map[n+1][m+1].type = "Cliff4b"
						@new_map[n+1][m+1].offset = [0,0]
						createCliff(n+1, m+1, 2, 3)
					#condition for Cliff5 (south) - (c5 and c4 are lower than e but 3 is the same)
					elsif e >= 4 && c5.elevation < 4 && c4.elevation < 4 && c3.elevation >= 4
						@new_map[n+1][m+1].elevation = @map[i][j].elevation
						@new_map[n+1][m+1].type = "Cliff5"
						@new_map[n+1][m+1].offset = [0,0]
						createCliff(n+1, m+1, 1, 2)						
					#condition for Cliff3 (east) - (c4 and c3 are lower than e but 5 is the same)
					elsif e >= 4 && c5.elevation >= 4 && c4.elevation < 4 && c3.elevation < 4
						@new_map[n+1][m+1].elevation = @map[i][j].elevation
						@new_map[n+1][m+1].type = "Cliff3"
						@new_map[n+1][m+1].offset = [0,0]
						createCliff(n+1, m+1, 2, 1)
					else
						createGrass(n+1, m+1, i, j)
					end
					#8 1 2
					#7 0 3
					#6 5 4
					# *************** *************** **********************
					# - Conditions for lower left corner of expanded tile - 
					# *************** *************** **********************
					
					
					# *************** *************** **********************
					# Grass and Stone
					# *************** *************** **********************
					
					# #condition for Edge6a (concave) - (c5, c6 and c7 are all lower than e)
					# if e >= 2 && c5.elevation < 2 && c6.elevation < 2 && c7.elevation < 2
						# @new_map[n][m+1].elevation = @map[i][j].elevation
						# @new_map[n][m+1].type = "Edge6a"
					# #condition for Edge6b (convex) - (c5 and c7 are the same as e but 6 is lower)
					# elsif e >= 2 && c5.elevation >= 2 && c6.elevation < 2 && c7.elevation >= 2
						# @new_map[n][m+1].elevation = @map[i][j].elevation
						# @new_map[n][m+1].type = "Edge6b"
					# #condition for Edge5 (north) - (c5 and c6 are lower than e but 7 is the same)
					# elsif e>= 2 && c5.elevation < 2 && c6.elevation < 2 && c7.elevation >= 2
						# @new_map[n][m+1].elevation = @map[i][j].elevation
						# @new_map[n][m+1].type = "Edge5"
					# #condition for Edge7 (west) - (c7 and c6 are lower than e but 5 is the same)
					# elsif e >= 2 && c5.elevation >= 2 && c6.elevation < 2 && c7.elevation < 2
						# @new_map[n][m+1].elevation = @map[i][j].elevation
						# @new_map[n][m+1].type = "Edge7"
					
					# *************** *************** **********************
					# Cliff
					# *************** *************** **********************
					
					#condition for Cliff6a (concave) - (c5, c6 and c7 are all lower than e)
					if e >= 4 && c5.elevation < 4 && c6.elevation < 4 && c7.elevation < 4
						@new_map[n][m+1].elevation = @map[i][j].elevation
						@new_map[n][m+1].type = "Cliff6a"
						@new_map[n][m+1].offset = [1,0]
						createCliff(n, m+1, 2, 3)
					#condition for Cliff6b (convex) - (c5 and c7 are the same as e but 6 is lower)
					elsif e >= 4 && c5.elevation >= 4 && c6.elevation < 4 && c7.elevation >= 4
						@new_map[n][m+1].elevation = @map[i][j].elevation
						@new_map[n][m+1].type = "Cliff6b"
						@new_map[n][m+1].offset = [1,0]
						createCliff(n, m+1, 2, 3)
					#condition for Cliff5 (north) - (c5 and c6 are lower than e but 7 is the same)
					elsif e>= 4 && c5.elevation < 4 && c6.elevation < 4 && c7.elevation >= 4
						@new_map[n][m+1].elevation = @map[i][j].elevation
						@new_map[n][m+1].type = "Cliff5"
						@new_map[n][m+1].offset = [0,0]
						createCliff(n, m+1, 1, 2)
					#condition for Cliff7 (west) - (c7 and c6 are lower than e but 5 is the same)
					elsif e >= 4 && c5.elevation >= 4 && c6.elevation < 4 && c7.elevation < 4
						@new_map[n][m+1].elevation = @map[i][j].elevation
						@new_map[n][m+1].type = "Cliff7"
						@new_map[n][m+1].offset = [1,0]
						createCliff(n, m+1, 2, 1)
					else
						createGrass(n, m+1, i, j)
					end 
					
				else #if it is an ocean
					#we are expanding every square into four squares. In this case all four are an exact copy
					@new_map[n][m].elevation = @map[i][j].elevation
					@new_map[n][m].type = @map[i][j].type
					@json_map[n][m] << @tile_list[@new_map[n][m].type]
					
					@new_map[n][m+1].elevation = @new_map[n][m].elevation
					@new_map[n][m+1].type = @new_map[n][m].type
					@json_map[n][m+1] << @tile_list[@new_map[n][m+1].type]
					
					@new_map[n+1][m].elevation = @new_map[n][m].elevation
					@new_map[n+1][m].type = @new_map[n][m].type
					@json_map[n+1][m] << @tile_list[@new_map[n+1][m].type]
					
					@new_map[n+1][m+1].elevation = @new_map[n][m].elevation
					@new_map[n+1][m+1].type = @new_map[n][m].type
					@json_map[n+1][m+1] << @tile_list[@new_map[n+1][m+1].type]
				
				end #end of if !Ocean
				m = m + 2
			end #end of j
			n = n + 2
		end #end of i
	
	end #end of - def convert -
	
	def createJson(x, y, w, h)
		offset = @new_map[x][y].offset
		name = @new_map[x][y].type
		s1 = x-offset[0]
		s2 = y-offset[1]
		w.times do |i|
			h.times do |j|
				@json_map[s1+i][s2+j] << @tile_list[name] + i + j*16
			end
		end
	
	end
	
	def createCliff(x, y, w, h)
		for i in (0..w-1)
			for j in (0..h-1)
				@new_map[x+i][y+j].special = "Cliff"
				@new_map[x+i][y+j].traversable = false
				if @new_map[x+i][y+j].type == ""
					@new_map[x+i][y+j].type = "Grass"
				end
			end
		end
		createJson(x, y, w, h)
	end
	
	def createGrass (x, y, i, j)
		e = @map[i][j].elevation
		@new_map[x][y].elevation = e
		@new_map[x][y].type = "Grass"
		switch = rand(0..100)
		special = ""
		offset = [0,0]
		if (e == 2)
			
			special = "grass"
		elsif (e == 3)
			case switch		
				when (0..80)
					special = "Grass"
				when (80..100)
					special = "Tree1"
			end
		elsif (e >= 4)
			special = "Stone"
		end
		
		if special == "Tree1"
			offset = [0, 2]
		elsif special == "Tree2"
			offset = [0, 2]
		end
		@new_map[x][y].special = special
		@new_map[x][y].offset = offset
		
		
		@json_map[x][y] << @tile_list[@new_map[x][y].type]
		if @new_map[x][y].special != ""
			#@json_map[x][y] << @tile_list[@new_map[x][y].special]
		end
	end
		
	def saveFileNew(seed)
		r = @rows*2
		fileName = "mapNew_" + seed.to_s + ".tbm"
		file = File.open(fileName, "w")
		
		for i in (0..r-1)
			str = ""
			for j in (0..r-1)
				str += @new_map[i][j].type + "," + @new_map[i][j].offset[0].to_s + "-" + @new_map[i][j].offset[1].to_s + "," + 
				@new_map[i][j].special + "," + @new_map[i][j].elevation.to_s + "," + (@new_map[i][j].traversable ? "1" : "0") + ";"
				#str += @map[i][j].elevation.to_s + ";"
			end
			str += "\n"
			file.write(str)
		end
		file.close
		
	end
	def saveToJason
		File.write("mysafefile.json", JSON.generate(@json_map))
	end
	
end