const game = {
	flasks: [],
	selected_flask: null,
	gameover_since: null,
	starting_flasks: [],
	win_text: null,
	colors_id: ['#8BC34A', '#3F51B5', '#9C27B0', '#E53935', '#FDD835', '#35BEFD', '#999999'],
	restartButton: new Path2D(),
	nextButton: new Path2D(),
	disposeFlasks: function()
	{
		const canvas_rect = canvas.getBoundingClientRect()
		let margin = 50

		let spacing = (canvas_rect.width-margin*2)/this.flasks.length
		for (const [i, flask] of this.flasks.entries())
			flask.position.x = margin+spacing*(i+0.5)
	},
	isGameOver()
	{
		for (flask of this.flasks)
		{
			if (!flask.isCompleted())
				return false
		}

		if (!this.gameover_since)
		{
			this.gameover_since = new Date()
			let win_texts = ['PASSOU', 'COMPLETO', 'VOCÊ CONSEGUIU', 'PARABÉNS', 'ÓTIMO', 'FENOMENAL', 'EXCELENTE', 'MANEIRO!', 'DELICIOSO!', 'PERFEITO']
			win_text  = win_texts[Math.floor(Math.random()*win_texts.length)];
		}

		return true
	},
	copyFlasks: function(from)
	{
		let result = []

		for (let i = 0; i < from.length; i++)
		{
			result.push(new Flask())

			for (let j = 0; j < from[i].slots.length; j++)
				result[i].addBall(new Ball(from[i].slots[j].color_id))
		}

		return result
	},
	next: function()
	{
		this.flasks = []
		this.selected_flask = null
		this.gameover_since = null

		let choosed_colors = []

		for ([i,j] of this.colors_id.entries())
			choosed_colors.push(i)

		for (let i = 0; i < choosed_colors.length; i++)
			this.flasks.push(new Flask())

		for (color of choosed_colors)
		{
			for (let i = 0; i < 4; i++)
			{
				if (this.flasks[Math.floor(Math.random()*this.flasks.length)].addBall(new Ball(color)))
					continue;
				else
					i--;
			}
		}

		this.flasks.push(new Flask())
		this.flasks.push(new Flask())

		this.starting_flasks = this.copyFlasks(this.flasks)
	},
	restart: function()
	{
		this.flasks = []
		this.selected_flask = null
		this.gameover_since = null

		this.flasks = this.copyFlasks(this.starting_flasks)
	},
	click: function(x, y)
	{
		if (!this.isGameOver())
		{
			for (flask of this.flasks)
			{
				flask.clickCheck(x, y)
			}
		}

		this.isGameOver()

		if (context.isPointInPath(this.restartButton, x, y))
		{
			game.restart()
		}

		if (context.isPointInPath(this.nextButton, x, y))
		{
			game.next()
		}
	},
	drawFlasks: function()
	{
		this.disposeFlasks()

		for (flask of this.flasks)
		{
			flask.draw(context)
		}
	},
	drawRoundedRectangle: function(path, x1, y1, width, height, radius = 0)
	{
		path.moveTo(x1+width/2, y1);
		path.arcTo (x1+width, y1, x1+width, y1+height/2, radius);
		path.arcTo (x1+width, y1+height, x1+width/2, y1+height, radius);
		path.arcTo (x1, y1+height, x1, y1+height/2, radius);
		path.arcTo (x1, y1, x1+width/2, y1, radius);
		path.closePath();
	},
	drawRestartButton: function(x1, y1, width, height, radius = 0)
	{
		if (radius > width/2)
			radius = width/2

		if (radius > height/2)
			radius = height/2

		//Clear path
		this.restartButton = new Path2D();
		this.drawRoundedRectangle(this.restartButton, x1, y1, width, height, radius);

		const highlightButton = new Path2D();
		this.drawRoundedRectangle(highlightButton, x1, y1, width, height-10, radius);

		context.fillStyle = '#DA0';
		context.fill(this.restartButton);

		context.fillStyle = '#FDEA00';
		context.fill(highlightButton);

		context.font         = "30px Arial";
		context.fillStyle    = '#D90';
		context.textAlign    = "center";
		context.textBaseline = 'middle';
		context.fillText("REIN", x1+width/2, y1+height/2);
	},
	drawNextButton: function(x1, y1, width, height, radius = 0)
	{
		if (radius > width/2)
			radius = width/2

		if (radius > height/2)
			radius = height/2

		//Clear path
		this.nextButton = new Path2D();
		this.drawRoundedRectangle(this.nextButton, x1, y1, width, height, radius);

		const highlightButton = new Path2D();
		this.drawRoundedRectangle(highlightButton, x1, y1, width, height-10, radius);

		context.fillStyle = '#DA0';
		context.fill(this.nextButton);

		context.fillStyle = '#FDEA00';
		context.fill(highlightButton);

		context.font         = "30px Arial";
		context.fillStyle    = '#D90';
		context.textAlign    = "center";
		context.textBaseline = 'middle';
		context.fillText("NEXT", x1+width/2, y1+height/2);
	},
	drawGameOverScreen: function(){
		if (this.gameover_since)
		{
			let bar_height = 150
			const animation_bkg = new Animation(this.gameover_since, 200, 150)

			context.save();
			context.translate(canvas.width/2, canvas.height/2-150);
			context.rotate(-Math.PI/90);

			//Angled rectangle
			context.beginPath();
			context.rect(-canvas.width/2*1.1, -bar_height/2, canvas.width*1.1*animation_bkg.linear(), bar_height);
			context.fillStyle = '#D22';
			context.fill();

			context.restore();

			//Rectangle
			context.save();
			context.translate(canvas.width/2, canvas.height/2-150);

			context.beginPath();
			context.rect(-canvas.width*(animation_bkg.linear()-0.5), -bar_height/2, canvas.width*2, bar_height);
			context.fillStyle = '#F44';
			context.fill();

			//Text
			context.font         = "40px Arial";

			//Variable font size
			const animation_text = new Animation(this.gameover_since, 100, 300)
			let fontArgs = context.font.split(' ');
			context.font = 40*animation_text.linear() + 'px ' + fontArgs[fontArgs.length - 1]; /// using the last part

			context.fillStyle    = '#FFF';
			context.textAlign    = "center";
			context.textBaseline = 'middle';

			context.fillText(win_text, 0, 0);

			context.restore();
		}
	}
}