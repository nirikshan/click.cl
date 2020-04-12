import { app } from 'click.cl';


new app('ClickTyper',
{
	view: (`<span>{view}{endsymbol}</span>`),
	state:
	{
		loopNum: 0,
		text: [],
		erasespeed: 1000,
		typespeed: 1000,
		i: 0,
		view: '',
		endsymbol:'|'
	},
	props:['text','typespeed','erasespeed','endsymbol'],
	fn:
	{
		start: function(that)
		{
			var self = this;
			var txt = that.text[that.loopNum];
			if (that.i < txt.length)
			{
				that.view += txt[that.i];
				that.i++;
				setTimeout(function()
				{
					self.start(that)
				}, that.typespeed);
			}
			else
			{
				var a = Number(that.loopNum),
					c = that.text.length;
				that.i = 0;
				self.backCycle(that, function()
				{
					if (that.view.length == 0)
					{
						if (a < c - 1)
						{
							that.loopNum++;
						}
						else
						{
							that.loopNum = 0;
						}
						self.start(that)
					}
				});
			}
		},
		backCycle: function(that, callback)
		{
			var view = that.view.length,
				self = this;
			if (view)
			{
				var Inte = setTimeout(function(params)
				{
					that.view = that.view.slice(0, -1);
					self.backCycle(that, callback)
					if (that.view.length == 0)
					{
						clearInterval(Inte);
						callback !== undefined &&
					callback();
					}
				}, that.erasespeed)
			}
		}
	},
	auto:
	{
		text: function(a)
		{
			return (a.split('|'));
		}
	}
});