require 'rubygems'
require 'gosu'
include Math

#lakes and mountains happen first, then roads, then trees?

class DrawMap
	attr_reader :rows
	def initialize (window, width, height)
		@window = window
		@font = Gosu::Font.new(window, default_font_name, 12)
		@width = width
		@height = height
		@tiles = Hash.new
		@tiled = false
		tile_struct = Struct.new :image, :z_ordering, :speed, :name 
		#tile properties, 	
		#					image, 
		#					z-ordering, 
		#					speed/id
		#					name
		@tiles["pines"] = tile_struct.new Gosu::Image.new(window, "map_tiles/evergreens.png", true), 
							2, 
							4,
							"pines"
		@tiles["pines1"] = tile_struct.new Gosu::Image.new(window, "map_tiles/evergreens1.png", true), 
							2, 
							4,
							"pines"
		
		@tiles["grass"] = tile_struct.new Gosu::Image.new(window, "map_tiles/grass.png", true), 
							1, 
							2,
							"grass"
		@tiles["grass1"] = tile_struct.new Gosu::Image.new(window, "map_tiles/grass1.png", true), 
							1, 
							2,
							"grass"
		@tiles["grass2"] = tile_struct.new Gosu::Image.new(window, "map_tiles/grass2.png", true), 
							1, 
							2,
							"grass"
		@tiles["grass3"] = tile_struct.new Gosu::Image.new(window, "map_tiles/grass3.png", true), 
							1, 
							2,
							"grass"
		
		@tiles["peak"] = tile_struct.new Gosu::Image.new(window, "mountains/mountainpeak.png", true), 
							4, 
							15,
							"peak"
		@tiles["peak1"] = tile_struct.new Gosu::Image.new(window, "mountains/mountainpeak1.png", true), 
							4, 
							15,
							"peak"
		@tiles["lake"] = tile_struct.new Gosu::Image.new(window, "lake/lake.png", true), 
							3, 
							15,
							"lake"	
		@tiles["lake1"] = tile_struct.new Gosu::Image.new(window, "lake/lake1.png", true), 
							3, 
							15,
							"lake"	
		@tiles["lake2"] = tile_struct.new Gosu::Image.new(window, "lake/lake2.png", true), 
							3, 
							15,
							"lake"	
		@tiles["lake3"] = tile_struct.new Gosu::Image.new(window, "lake/lake3.png", true), 
							3, 
							15,
							"lake"	
		@tiles["nil"] = tile_struct.new nil, 
							0, 
							0,
							"nil"
		@tiles["lake_shallow"] = tile_struct.new Gosu::Image.new(window, "lake/lake_shallow.png", true), 
							3, 
							4,
							"lake_shallow"	
		@tiles["lake_shallow1"] = tile_struct.new Gosu::Image.new(window, "lake/lake_shallow1.png", true), 
							3, 
							4,
							"lake_shallow"	
		@tiles["lake_shallow2"] = tile_struct.new Gosu::Image.new(window, "lake/lake_shallow2.png", true), 
							3, 
							4,
							"lake_shallow"	
		@tiles["lake_shallow3"] = tile_struct.new Gosu::Image.new(window, "lake/lake_shallow3.png", true), 
							3, 
							4,
							"lake_shallow"								
		@tiles["hills"] = tile_struct.new Gosu::Image.new(window, "map_tiles/hills.png", true), 
							1, 
							3,
							"hills"		
		@tiles["hills1"] = tile_struct.new Gosu::Image.new(window, "map_tiles/hills1.png", true), 
							1, 
							3,
							"hills"						
		@tiles["cliff"] = tile_struct.new Gosu::Image.new(window, "mountains/cliff.png", true), 
							4, 
							9,
							"cliff"
		@tiles["pass"] = tile_struct.new Gosu::Image.new(window, "mountains/pass.png", true), 
							4, 
							6.5,
							"pass"		
		@tiles["cliff1"] = tile_struct.new Gosu::Image.new(window, "mountains/cliff1.png", true), 
							4, 
							9,
							"cliff"
		@tiles["pass1"] = tile_struct.new Gosu::Image.new(window, "mountains/pass1.png", true), 
							4, 
							6.5,
							"pass"
		@tiles["forest"] = tile_struct.new Gosu::Image.new(window, "map_tiles/forest.png", true), 
							2, 
							4,
							"forest"
		@tiles["forest1"] = tile_struct.new Gosu::Image.new(window, "map_tiles/forest1.png", true), 
							2, 
							4,
							"forest"
		@tiles["dark_forest"] = tile_struct.new Gosu::Image.new(window, "map_tiles/darkforest.png", true), 
							2, 
							6.5,
							"dark_forest"
		@tiles["dark_forest1"] = tile_struct.new Gosu::Image.new(window, "map_tiles/darkforest1.png", true), 
							2, 
							6.5,
							"dark_forest"
							
		@tiles["tree"] = tile_struct.new Gosu::Image.new(window, "map_tiles/tree.png", true), 
							2, 
							4,
							"tree"
							
		@tiles["tree1"] = tile_struct.new Gosu::Image.new(window, "map_tiles/tree1.png", true), 
							2, 
							4,
							"tree"		
		@tiles["fill"] = tile_struct.new nil, 
							100, 
							0,
							"fill"	
		
		@rand_tile_angle = Hash.new
		
		@rand_tile_angle["nil"] = ["nil"]
		@rand_tile_angle["fill"] = ["fill"]
		
		@rand_tile_angle["peak"] = ["peak", "peak1"]
		@rand_tile_angle["cliff"] = ["cliff", "cliff1"]
		@rand_tile_angle["pass"] = ["pass", "pass1"]
		@rand_tile_angle["pines"] = ["pines", "pines1"]
		
		@rand_tile_angle["grass"] = ["grass", "grass1", "grass2", "grass3"]
		@rand_tile_angle["hills"] = ["hills", "hills1"]
		@rand_tile_angle["tree"] = ["tree", "tree1"]
		
		@rand_tile_angle["lake"] = ["lake", "lake1", "lake2", "lake3"]
		@rand_tile_angle["lake_shallow"] = ["lake_shallow", "lake_shallow1", "lake_shallow2", "lake_shallow3"]
		
		@rand_tile_angle["forest"] = ["forest", "forest1"]
		@rand_tile_angle["dark_forest"] = ["dark_forest", "dark_forest1"]
		
		rows = 900
		@map = Array.new(rows) { Array.new(rows) { [@tiles["nil"], @tiles["nil"]]} }
		@mapCompare = Array.new(rows) { Array.new(rows) { [@tiles["nil"], @tiles["nil"]]} }
		
		@rows = readMap
		@cols = @rows
		
		
		
		#order of generation grass, hills, forest, lake, mountain
		#puts "generating ocean..."
		#gen_section(20,17,30,"lake")
		
		
		
	end
	def marks_compare_function
		if !@tiled
			(0..@rows-1).each do |r|
				(0..@cols-1).each do |c|
					@mapCompare[r][c][0] = @map[r][c][0] 
					@mapCompare[r][c][1] = @map[r][c][1]
					@map[r][c][0] = @tiles[@map[r][c][0].name]
					@map[r][c][1] = @tiles[@map[r][c][1].name]
				end
			end
			@tiled = true
		end
	end
	def marks_uncompare_function
		if @tiled
			(0..@rows-1).each do |r|
				(0..@cols-1).each do |c|
					@map[r][c][0] = @mapCompare[r][c][0] 
					@map[r][c][1] = @mapCompare[r][c][1]
				end
			end
			@tiled = false
		end
	end
	
	def readMap
		file = File.new("map.tbm", "r")
		rows = 0
		tempMap = Array.new()
		line = file.gets()
		dim = line.split(",")
		while (line = file.gets)
			tempMap.push(line.split(","))
			rows+=1
		end
		
		file.close
		
		i = 0
		j = 0
		for row in tempMap
			for e in row
				case e
				when ("c")
					
				when ("-1")
					@map[i][j][0] = rand_tile("lake")
				when ("0")
					@map[i][j][0] = rand_tile("grass")
				when ("1")
					switch = rand(0..100)
					case switch
					when (0..95)
						@map[i][j][0] = rand_tile("grass")
					when (95..97)
						@map[i][j][0] = rand_tile("hills")
					when (98..100)
						@map[i][j][1] = rand_tile("tree")
						@map[i][j][0] = rand_tile("grass")
					end
				when ("2")
					@map[i][j][0] = rand_tile("forest")
				when ("3")
					@map[i][j][0] = rand_tile("forest")
				when ("4")
					@map[i][j][0] = rand_tile("dark_forest")
				when ("5")
					@map[i][j][0] = rand_tile("pines")
				when ("6")
					@map[i][j][0] = rand_tile("pines")
				when ("7")
					@map[i][j][0] = rand_tile("pass")
				when ("8")
					@map[i][j][0] = rand_tile("cliff")
				when ("9")
					@map[i][j][0] = rand_tile("cliff")
				when ("10")
					@map[i][j][0] = rand_tile("peak")
				
				end
				j += 1
			end
			i += 1
			j = 0
		end
		return rows
	
	end

	def rand_tile(tile_name)
		length = @rand_tile_angle[tile_name].length
		new_tile = @tiles[@rand_tile_angle[tile_name][rand(0..length-1)]]
		return new_tile
	end

	def check_x(x_value)
		if x_value >= @rows
			x_value = x_value - @rows
		elsif x_value < 0
			x_value = x_value + (@rows)
		end
		return x_value
	end
	def check_y(y_value)
		if y_value >= @cols
			y_value = y_value - @cols
		elsif y_value < 0
			y_value = y_value + @cols
		end
		return y_value
	end
	def traversable?(x,y)
		return true
		if x >= @rows
			x = 0
		elsif x < 0
			x = @rows -1
		end
		if y >= @rows
			y = 0
		elsif y < 0
			y = @rows -1
		end
		if @map[x][y][0].name != "nil"
			if @map[x][y][0].speed == 0
				return false
			else
				return true
			end
		else
			return true
		end
	end
	def speed(x,y)
		return 0.9
		if @map[x][y][0].name != "nil"
			return @map[x][y][0].speed
			
		elsif @map[x][y][1].name != "nil"
			return @map[x][y][1].speed
		else
			return 1
		end
	end
	def draw(c_x, c_y)
		x_edge = @width/2
		y_edge = @height/2
		x = 1
		y = 1
		
		(c_x - x_edge..x_edge + c_x).each do |r|
			(c_y - y_edge..y_edge + c_y).each do |c|
				if r >= @rows
					r = r-@rows
				end
				if r < 0
					r = r+@rows
				end
				if c >=@cols
					c = c-@cols
				end
				if c < 0
					c = c+@cols
				end
				if @map[r][c][1].image != nil
					@map[r][c][1].image.draw(x*32, y*32, @map[r][c][1].z_ordering)
					@font.draw("13", x*32, y*32, @map[r][c][1].z_ordering)
				end
				if @map[r][c][0].image != nil
					@map[r][c][0].image.draw(x*32, y*32, @map[r][c][0].z_ordering)
					@font.draw("13", x*32, y*32, @map[r][c][1].z_ordering)
				end
				y+=1
			end
			x+=1
			y=1
		end
	end

end