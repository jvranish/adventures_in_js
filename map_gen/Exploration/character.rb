
class Character
	attr_reader :x, :y
	def initialize (window, x, y)
		@x = x
		@y = y
		#face = current way walking
		@face = Hash["n",0,"e",1,"s",2,"w",3]
		@current_face = "n"
		@faces = Hash.new
		@step = false
		@filenames = []
		#reads in all the files from a dirctory
		#Dir.glob("elf/*.png") do |filename|
		Dir.glob("halfling/*.png") do |filename|
			@faces.store(filename, Gosu::Image.new(window, filename, true))
			@filenames.push filename
		end
		@text = Gosu::Font.new(window, 'courier', 25)
		
	end
	
	def move_up
		@current_face = "n"
	end
	def move_down
		@current_face = "s"
	end
	def move_left
		@current_face = "w"
	end
	def move_right
		@current_face = "e"
	end
	
	def move_upL
		@current_face = "w"
	end
	def move_upR
		@current_face = "e"
	end
	def move_downL
		@current_face = "w"
	end
	def move_downR
		@current_face = "e"
	end
	
	#toggles between steps for animation
	def step_taken
		@step = !@step
	end
	
	def draw
		#selects which image to use
		pattern = "1" + (@face[@current_face] * 2 + 1).to_s + (@step ? 2 : 1).to_s
		key = ""
		@filenames.each do |file|
			if file.include?(pattern)
				key = file
				break
			end
		end
		#draws the image that matches the key
		@faces[key].draw(@x*32, @y*32, 5)
		#@text.draw("p = #{pattern}", 300, 515, 1)
	end
end