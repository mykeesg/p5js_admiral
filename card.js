var cardValues = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

function getSymbolByColor(c)
{
	switch(c)
	{
		case 'S' : return '\u2660';
		case 'C' : return '\u2663';
		case 'H' : return '\u2665';
		case 'D' : return '\u2666';
	}
}


function Card(color, value)
{
	this.color = color;	
	this.value = value;
	this.hidden = true;	
	
	this.reveal = function()
	{
		this.hidden = false;
	}
	
	this.hide = function()
	{
		this.hidden = true;
	}
	
	this.getColor = function()
	{
		if(this.color=='S' || this.color=='C')
		{
			return 'black';
		}
		return 'red';
	}
	
	this.greaterThan = function(other)
	{
		return cardValues.indexOf(this.value)-cardValues.indexOf(other.value)==1;
	}
	
	this.lessThan = function(other)
	{
		return cardValues.indexOf(other.value)-cardValues.indexOf(this.value)==1;
	}
	
	this.show = function(x,y)
	{
		if(this.hidden)
		{
			fill(150,150,150);
		}
		else
		{
			fill(255);
		}
		rect(x,y,50,80);
		
		if(!this.hidden)
		{
			
			if(this.color=='S' || this.color=='C')
			{
				fill(0,0,0);
			}
			else
			{
				fill(255,0,0);
			}
			textSize(25);
			text(this.value + getSymbolByColor(this.color),x+4,y+22);
		}
	}	
}