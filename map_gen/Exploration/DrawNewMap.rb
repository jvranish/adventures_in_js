require 'rubygems'
require 'gosu'
require 'json'
include Math

#lakes and mountains happen first, then roads, then trees?

class DrawNewMap
	attr_reader :rows
	def initialize (window, width, height)
		@map
		@font = Gosu::Font.new(window, Gosu::default_font_name, 12)
		@width = width
		@height = height
		@tiles = Hash.new
		
		@tiles["Ocean"] = [
			Gosu::Image.new(window, "new_tiles/Ocean.png", true) ]
		@tiles["Grass"] = [
			Gosu::Image.new(window, "new_tiles/Grass-1.png", true), 
			Gosu::Image.new(window, "new_tiles/Grass-2.png", true) ]
		@tiles["Cliff1"] = [
			Gosu::Image.new(window, "new_tiles/Cliff1-1.png", true), 
			Gosu::Image.new(window, "new_tiles/Cliff1-2.png", true) ]
		@tiles["Cliff3"] = [
			Gosu::Image.new(window, "new_tiles/Cliff3-1.png", true), 
			Gosu::Image.new(window, "new_tiles/Cliff3-2.png", true) ]
		@tiles["Cliff5"] = [
			Gosu::Image.new(window, "new_tiles/Cliff5-1.png", true), 
			Gosu::Image.new(window, "new_tiles/Cliff5-2.png", true) ]
		@tiles["Cliff7"] = [
			Gosu::Image.new(window, "new_tiles/Cliff7-1.png", true), 
			Gosu::Image.new(window, "new_tiles/Cliff7-2.png", true) ]
		@tiles["Cliff2a"] = [
			Gosu::Image.new(window, "new_tiles/Cliff2a.png", true) ]
		@tiles["Cliff2b"] = [
			Gosu::Image.new(window, "new_tiles/Cliff2b.png", true) ]
		@tiles["Cliff4a"] = [
			Gosu::Image.new(window, "new_tiles/Cliff4a.png", true) ]
		@tiles["Cliff4b"] = [
			Gosu::Image.new(window, "new_tiles/Cliff4b.png", true) ]
		@tiles["Cliff6a"] = [
			Gosu::Image.new(window, "new_tiles/Cliff6a.png", true) ]
		@tiles["Cliff6b"] = [
			Gosu::Image.new(window, "new_tiles/Cliff6b.png", true) ]
		@tiles["Cliff8a"] = [
			Gosu::Image.new(window, "new_tiles/Cliff8a.png", true) ]
		@tiles["Cliff8b"] = [
			Gosu::Image.new(window, "new_tiles/Cliff8b.png", true) ]
			
		@tiles["Edge1"] = [
			Gosu::Image.new(window, "new_tiles/Edge1.png", true) ]
		@tiles["Edge3"] = [
			Gosu::Image.new(window, "new_tiles/Edge3.png", true) ]
		@tiles["Edge5"] = [
			Gosu::Image.new(window, "new_tiles/Edge5.png", true) ]
		@tiles["Edge7"] = [
			Gosu::Image.new(window, "new_tiles/Edge7.png", true) ]
		@tiles["Edge2a"] = [
			Gosu::Image.new(window, "new_tiles/Edge2a.png", true) ]
		@tiles["Edge2b"] = [
			Gosu::Image.new(window, "new_tiles/Edge2b.png", true) ]
		@tiles["Edge4a"] = [
			Gosu::Image.new(window, "new_tiles/Edge4a.png", true) ]
		@tiles["Edge4b"] = [
			Gosu::Image.new(window, "new_tiles/Edge4b.png", true) ]
		@tiles["Edge6a"] = [
			Gosu::Image.new(window, "new_tiles/Edge6a.png", true) ]
		@tiles["Edge6b"] = [
			Gosu::Image.new(window, "new_tiles/Edge6b.png", true) ]
		@tiles["Edge8a"] = [
			Gosu::Image.new(window, "new_tiles/Edge8a.png", true) ]
		@tiles["Edge8b"] = [
			Gosu::Image.new(window, "new_tiles/Edge8b.png", true) ]
		@tiles["Tree"] = [
			Gosu::Image.new(window, "new_tiles/Tree-1.png", true) ]
		@tiles["Bush"] = [
			Gosu::Image.new(window, "new_tiles/Bush-1.png", true) ]
		@tiles["Stone"] = [
			Gosu::Image.new(window, "new_tiles/Stone-1.png", true), 
			Gosu::Image.new(window, "new_tiles/Stone-2.png", true), 
			Gosu::Image.new(window, "new_tiles/Stone-3.png", true), 
			Gosu::Image.new(window, "new_tiles/Stone-4.png", true), 
			Gosu::Image.new(window, "new_tiles/Stone-5.png", true) ]
		
		
		@rows = readMap
		@cols = @rows
		
		
	
	end
	def readMap
		file = File.new("map.tbm", "r")
		rows = 0
		tempMap = Array.new()
		while (line = file.gets)
			tempMap.push(line.strip().split(";"))
			rows+=1
		end
		# puts rows
		# puts tempMap[0].length
		file.close
		map_struct = Struct.new :type, :offset, :special, :elevation, :traversable
		@map = Array.new(rows) { Array.new (rows) {map_struct.new "" [0,0], "", -1, true}}
		i = 0
		j = 0
		for row in tempMap
			for e in row
				a = e.split(",")
				@map[i][j].type = a[0]
				b = a[1].split("-")
				@map[i][j].offset = [b[0].to_i, b[1].to_i]
				@map[i][j].special = a[2]
				@map[i][j].elevation = a[3].to_i
				@map[i][j].traversable = a[4].to_i == 1 
				# @map[i][j] = @map[i][j].to_h
				j += 1
			end
			i += 1
			j = 0
		end
		# puts JSON.pretty_generate(@map)
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
		
	end
	def speed(x,y)
		return 0.9
		
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
				#puts @map[r][c].type
				if @map[r][c].type != ""
					#Specials
					if @map[r][c].special == "Tree1"
						#@tiles["Tree1"].draw((x-@map[r][c].offset[0])*40, (y-@map[r][c].offset[1])*40, 10)
					elsif @map[r][c].special == "Tree2"
						#@tiles["Tree2"].draw((x-@map[r][c].offset[0])*40, (y-@map[r][c].offset[1])*40, 10)
					elsif @map[r][c].special == "Stone"
						@tiles["Stone"][(r+c*7)%5].draw(x*40, y*40, 1)
						@font.draw("#{@map[r][c].elevation}", x*40, y*40, 11)

					end
					
					#Types
					if @map[r][c].type.include? "Cliff"
						@tiles[@map[r][c].type][(r+c*3)%@tiles[@map[r][c].type].length].draw((x-@map[r][c].offset[0])*40, (y-@map[r][c].offset[1])*40, 2)						
						@tiles["Grass"][(r*c)%2].draw(x*40, y*40, 0)
						@font.draw("#{@map[r][c].elevation}", x*40, y*40, 11)
					else
						@tiles[@map[r][c].type][0].draw(x*40, y*40, 0)
						@font.draw("#{@map[r][c].elevation}", x*40, y*40, 11)
					end
				end
				y+=1
			end
			x+=1
			y=1
		end
	end

end