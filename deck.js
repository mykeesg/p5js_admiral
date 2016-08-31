function Deck()
{
	this.cards = [];
	this.givencount = 0;
	
	for(var i=0;i<cardValues.length;++i)
	{
		this.cards.push(new Card('S',cardValues[i]));
		this.cards.push(new Card('C',cardValues[i]));
		this.cards.push(new Card('H',cardValues[i]));
		this.cards.push(new Card('D',cardValues[i]));
	}
	this.areCardsLeft = function()
	{
		return this.givencount<52;
	}
	this.getNextCard = function()
	{
		return this.cards[this.givencount++];
	}
	
	this.shuffle = function()
	{
		var j, x, i;
		for (i = this.cards.length; i; i--)
		{
			j = Math.floor(Math.random() * i);
			x = this.cards[i - 1];
			this.cards[i - 1] = this.cards[j];
			this.cards[j] = x;
		}
	}	
}