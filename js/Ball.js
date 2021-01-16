//Autor:  Allan Jales
//Github: https://github.com/allanjales

class Ball
{
	constructor(color_id)
	{
		this.color_id     = color_id
		this.balls_radius = 25
		this.last_flask   = null

		this.position = {x: 50, y: 50}

		this.animation = {
			running: false,
			type: null,
			since: null,
			from: {x: 0, y: 0},
			to: {x: 0, y: 0}
		}
	}

	distanceTo(x2, y2, x1 = this.position.x, y1 = this.position.y)
	{
		return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))
	}

	animate()
	{
		if (this.animation.running)
		{
			const time = new Date();

			if (time.getTime() - this.animation.since.getTime() <= this.animation.duration)
			{
				this.position.x = this.animation.from.x + (this.animation.to.x - this.animation.from.x)*(time.getTime() - this.animation.since.getTime())/this.animation.duration
				this.position.y = this.animation.from.y + (this.animation.to.y - this.animation.from.y)*(time.getTime() - this.animation.since.getTime())/this.animation.duration
			}
			else
			{
				this.animation.running  = false

				this.position.x = this.animation.to.x;
				this.position.y = this.animation.to.y;
			}
		}
	}

	moveTo(x2, y2, x1 = this.position.x, y1 = this.position.y)
	{
		const time = new Date();
		this.animation = {
			running: true,
			type: 'linear',
			since: time,
			duration: this.distanceTo(x2, y2, x1, y1)/2,
			from: {x: x1, y: y1},
			to: {x: x2, y: y2}
		}
	}

	draw(context)
	{
		this.animate()

		context.beginPath();
		context.arc(this.position.x, this.position.y, this.balls_radius, 0, 2*Math.PI);
		context.fillStyle = game.colors_id[this.color_id];
		context.fill();
	}
}