//Autor:  Allan Jales
//Github: https://github.com/allanjales

class Animation
{
	constructor(init_time, duration, delay = 0)
	{
		this.init_time = init_time
		this.delay     = delay
		this.duration  = duration
	}

	linear()
	{
		let t = (new Date() - this.init_time.getTime() - this.delay)/this.duration;

		if (t >= 1)
			return 1

		if (t <= 0)
			return 0

		return t
	}

	easeout
}