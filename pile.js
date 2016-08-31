function Pile(cards)
{
	this.cards = cards || [];
	
	this.empty = function()
	{
		return this.cards.length == 0;
	}
	this.clear = function()
	{
		this.cards = [];
	}
	
	this.showTop = function()
	{
		if(this.cards.length>0)
		{
			this.cards[this.cards.length-1].reveal();
		}
	}
	
	this.getTop = function()
	{
		if(this.cards.length>0)
		{
			return this.cards[this.cards.length-1];
		}
		return undefined;
	}
	
	this.getBottom = function()
	{
		if(this.cards.length>0)
		{
			return this.cards[0];
		}
		return undefined;
	}
	
	this.placeOnTop = function(card)
	{
		this.cards.push(card);
	}
	
	this.removeTop = function()
	{
		if(this.cards.length>0)
		{
			this.cards.pop();
		}
	}	
	this.placePile = function(pile)
	{
		this.cards = this.cards.concat(pile);
	}
	
	this.removeBottom = function()
	{
		if(this.cards.length>0)
		{
			this.cards.shift();
		}
	}
	
	this.visibleCards = function()
	{
		var s = 0;
		for(var i = this.cards.length-1;i>=0;--i)
		{
			if(!this.cards[i].hidden) ++s;
		}
		return s;
	}
	this.availableCards = function()
	{
		if(this.empty()) return 0;
		var s = 1;
		for(var i = this.cards.length-1;i>0;--i)
		{
			if(this.cards[i].lessThan(this.cards[i-1]) && this.cards[i-1].getColor()!=this.cards[i].getColor()) ++s;
			else break;
		}
		return s;
	}
	
	this.getSubPile = function(count)
	{
		var subpile = [];
		var j = min(count,this.availableCards());
		for(var i=0;i<j;++i)
		{
			subpile.push(this.cards.pop());
		}
		return subpile.reverse();
	}
	this.setAllHidden = function()
	{	
		for(var i=0;i<this.cards.length;++i)
		{
			this.cards[i].hide();
		}
	}
	
	this.canPlacePile = function(pile)
	{	
		if(this.empty() || !this.empty() && this.getTop().getColor() != pile.getBottom().getColor() && this.getTop().greaterThan(pile.getBottom()))
		{
			return true;
		}	
		return false;			
	}	
	
	this.show = function(x,y,z)
	{
		
		if(this.cards.length==0)
		{
			fill(255);
			rect(x,y,50,80);
		}
		else
		{			
			for(var i=0;i<this.cards.length;++i)
			{
				this.cards[i].show(x,y+i*z);
			}
		}
	}
}