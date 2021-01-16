//Autor:  Allan Jales
//Github: https://github.com/allanjales

class Flask
{
	constructor(slots = [], size = 4)
	{
		this.size = size
		this.slots = slots
		this.position = {x: 75, y: 200}

		this.balls_radius = 25

		//Drawing
		this.path_flask = new Path2D();
		this.flask_top_border = 7
	}

	addBall(ball)
	{
		if (this.slots.length < this.size)
		{
			this.slots.push(ball)
			return true
		}
		return false
	}

	isCompleted()
	{
		if (this.slots.length == 4)
		{
			let color_id = this.slots[0].color_id

			for (const ball of this.slots)
				if (ball.color_id != color_id)
					return false
			return true
		}

		if (this.slots.length == 0)
			return true

		return false
	}

	drawFlask(x1, y1, width, height, radius_top, radius_bottom)
	{
		//Clear path
		this.path_flask = new Path2D();

		//Upper left corner
		this.path_flask.lineTo(x1, y1);
		this.path_flask.arcTo (x1-radius_top, y1, x1-radius_top, y1+radius_top, radius_top);
		this.path_flask.arcTo (x1-radius_top, y1+radius_top*2, x1, y1+radius_top*2, radius_top);

		//Bottoms corners
		this.path_flask.arcTo (x1, y1+height, x1+radius_bottom, y1+height, radius_bottom);
		this.path_flask.arcTo (x1+width, y1+height, x1+width, y1+height-radius_bottom, radius_bottom);
		
		//Upper right corner
		this.path_flask.lineTo(x1+width, y1+radius_top*2);
		this.path_flask.arcTo (x1+width+radius_top, y1+radius_top*2, x1+width+radius_top, y1+radius_top, radius_top);
		this.path_flask.arcTo (x1+width+radius_top, y1, x1+width, y1, radius_top);

		this.path_flask.closePath();
	}

	draw(context)
	{
		//Drawing flask
		this.drawFlask(this.position.x-this.balls_radius*1.1, this.position.y, this.balls_radius*1.1*2, this.balls_radius*(0.2+2*4)+this.flask_top_border*2.5, this.flask_top_border, 10)

		context.fillStyle = '#FFF';
		context.fill(this.path_flask);

		context.strokeStyle = "#000";
		context.stroke(this.path_flask);

		//Set balls inherit position
		for (const [i, ball] of this.slots.entries())
		{
			if (ball.animation.type === null)
			{
				if (i == this.slots.length - 1 && game.selected_flask === this)
				{
					ball.position.x = this.position.x
					ball.position.y = this.position.y-this.balls_radius*1.2
				}
				else
				{
					ball.position.x = this.position.x
					ball.position.y = this.position.y+this.balls_radius*(1.1+2*(this.size-1-i))+this.flask_top_border*2.5
				}
			}
			ball.draw(context)
		}
	}

	getLastBall()
	{
		if (this.slots.length > 0)
			return this.slots[this.slots.length - 1]
		return false
	}

	getBallPosition(i)
	{
		return {x: this.position.x, y: this.position.y+this.balls_radius*(1.1+2*(this.size-1-i))+this.flask_top_border*2.5}
	}

	fallAnimation(force_location = false)
	{
		if (force_location && this.getLastBall())
			this.getLastBall().moveTo(this.position.x, this.getBallPosition(this.slots.length-1).y, this.position.x, this.position.y-this.balls_radius*1.2)
		else
			this.getLastBall().moveTo(this.position.x, this.getBallPosition(this.slots.length-1).y)
	}

	riseAnimation()
	{
		if (this.getLastBall())
			this.getLastBall().moveTo(this.position.x, this.position.y-this.balls_radius*1.2, this.position.x, this.getBallPosition(this.slots.length-1).y)
	}

	clickCheck(x, y)
	{
		if (context.isPointInPath(this.path_flask, x, y))
		{
			if (game.selected_flask)
			{
				if(game.selected_flask == this)
				{
					game.selected_flask = null
					this.fallAnimation()
				}
				else
				{
					if (game.selected_flask.getLastBall().color_id == this.getLastBall().color_id || this.getLastBall() == false)
					{
						if (this.addBall(game.selected_flask.getLastBall()))
						{
							game.selected_flask.slots.pop()
							game.selected_flask = null
							this.fallAnimation(true)
						}
						else
						{
							game.selected_flask.fallAnimation()
							game.selected_flask = this
							this.riseAnimation()
						}
					}
					else
					{
						game.selected_flask.fallAnimation()
						game.selected_flask = this
						this.riseAnimation()
					}
				}
			}
			else
			{
				game.selected_flask = this
				this.riseAnimation()
			}
			return true
		}
		return false
	}
}