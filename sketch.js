window.addEventListener("contextmenu", function(e) { e.preventDefault(); });
function disableselect(e) {return false;}
document.onselectstart = function () {return false;}
document.onmousedown = disableselect;

var board;
var deck;

var finalPiles;
var freePiles;

var movedPile;
var sourcePile;
var destPile;

var gameover;
var valid;
var clicked;

var gravity = 2;
var finalCounter = 0;

var finalPosX;
var finalPosY;
var finalSpeedX;
var finalSpeedY;
var finalDirX;
var finalDirY;


function setup()
{
	createCanvas(1000,600);
	board = [];
	freePiles = [];
	finalPiles = [];
	deck = new Deck();
	deck.shuffle();
	
	for(var i=0;i<4;++i)
	{
		finalPiles.push(new Pile());
		freePiles.push(new Pile());
	}
		
	for(var i=0;i<8;++i)
	{
		board.push(new Pile());
	}
	stockPile = new Pile();
	playedPile = new Pile();
	for(var i=0;deck.areCardsLeft();++i)
	{
		board[i%8].placeOnTop(deck.getNextCard());
		board[i%8].showTop();
	}
	movedPile = undefined;
    destPile = undefined;
	sourcePile = undefined;
	
	gameover = false;
	valid = false;
	clicked = false;	
	
	finalCounter = 0;
	
	finalPosX = 240;
	finalPosY = 20;
	finalSpeedX = random(2,20);
	finalSpeedY = random(3,10);
	finalDirX = 1;
	finalDirY = 1;
}

function pilesFall()
{
	finalSpeedY += gravity;
	finalPosY += finalSpeedY;
	finalPosX += finalSpeedX * finalDirX;
	
	if(finalPosY >= height-80)
	{
		finalSpeedY *= -1;
	}
	finalPiles[floor(finalCounter/13)].cards[12-finalCounter%13].show(finalPosX, finalPosY);
	if(finalPosX<-70 || finalPosX>width)
	{
		finalPosX = 240+(finalCounter/14)*70;
		finalPosY = 20;
		finalSpeedX = random(2,20);
		finalSpeedY = random(3,10);
		finalDirY = 1;
		finalDirX = (Math.random() <0.5) ? -1 : 1;
		++finalCounter;
	}	
	
	if(finalCounter==52)
	{
		setup();
	}	
}


function draw()
{
	if(gameover)
	{
		pilesFall();
	}
	else
	{
		clear();
	}
	
	for(var i=0;i<board.length;++i)
	{
		board[i].show(70*i+30,130,20);
	}
	
	for(var i=0;i<freePiles.length;++i)
	{
		freePiles[i].show(60*i+30,20,0);
	}
	
	for(var i=0;i<finalPiles.length;++i)
	{
		finalPiles[i].show(60*i+340,20,0);
	}
	
	if(mouseIsPressed)
	{
		if(!clicked)
		{
			valid = true;
			var x = mouseX;
			var y = mouseY;
			
			sourcePile = getPileByCoords(x,y);
			if(!sourcePile)
			{
				clicked = true;
				return;
			}
			
			
			if(mouseButton == RIGHT)
			{
				clicked = true;
				var currentCard = sourcePile.getTop();
				if(currentCard)
				{
					for(var i=0;i<finalPiles.length;++i)
					{
						if(finalPiles[i].empty() && currentCard.value=='A')
						{
							sourcePile.removeTop();
							finalPiles[i].placeOnTop(currentCard);
							break;
						}
						else if(!finalPiles[i].empty() && finalPiles[i].getTop().color == currentCard.color && finalPiles[i].getTop().lessThan(currentCard))
						{
							sourcePile.removeTop();
							finalPiles[i].placeOnTop(currentCard);
							break;
						}
					}
				}
			}
			if(mouseButton == CENTER)
			{
				clicked = true;				
				var changed = false;
				do
				{
					changed = false;
						for(var i=0;i<board.length;++i)
						{
							var currentCard = board[i].getTop();
							if(currentCard)
							{
								for(var j=0;j<finalPiles.length;++j)
								{
									if((finalPiles[j].empty() && currentCard.value=='A') || 
										(!finalPiles[j].empty() && finalPiles[j].getTop().color == currentCard.color && finalPiles[j].getTop().lessThan(currentCard)))
									{
										board[i].removeTop();
										finalPiles[j].placeOnTop(currentCard);
										changed = true;
										break;
									}
								}
							}
						}
						
						for(var i=0;i<freePiles.length;++i)
						{
							var currentCard = freePiles[i].getTop();
							if(currentCard)
							{
								for(var j=0;j<finalPiles.length;++j)
								{
									if((finalPiles[j].empty() && currentCard.value=='A') || 
											(!finalPiles[j].empty() && finalPiles[j].getTop().color == currentCard.color && finalPiles[j].getTop().lessThan(currentCard)))
									{
										freePiles[i].removeTop();
										finalPiles[j].placeOnTop(currentCard);
										changed = true;
										break;
									}
								}
							}
						}
				}
				while(changed);				
			}
			if(mouseButton == LEFT)
			{
				if(y<100 && x<280)
				{
					movedPile = new Pile();
					movedPile.placeOnTop(sourcePile.getTop());
					sourcePile.removeTop();

				}
				//pile from board, don't let them fuck up the final piles
				else if(y>100)
				{
					if(sourcePile.empty())
					{
						clicked = true;
						return;
					}
					//revealing of the top card
					if(sourcePile.getTop().hidden)
					{
						sourcePile.showTop();
					}
					else
					{
						//(y-130)/20
						var cardNum = max(sourcePile.cards.length - floor(y/20-6.5),1);
						cardNum = min(sourcePile.cards.length,cardNum);
						movedPile = new Pile(sourcePile.getSubPile(cardNum));
					}
				}
				clicked = true;
			}
		}
		//mouse held down
		else
		{
			if(movedPile && !movedPile.empty())
			movedPile.show(mouseX-25, mouseY-10,20);
		}
	}
}


function getPileByCoords(x,y)
{
	//boardpiles
	if(y>100)
	{
		if(x<90)
		{
			return board[0];
		}
		if(x<160)
		{
			return board[1];
		}
		if(x<230)
		{
			return board[2];
		}
		if(x<300)
		{
			return board[3];
		}
		if(x<370)
		{
			return board[4];
		}
		if(x<440)
		{
			return board[5];
		}
		if(x<510)
		{
			return board[6];
		}
		if(x<600)
		{
			return board[7];
		}
	}
	
	//upper piles
	else
	{
		if(x<90)
		{
			return freePiles[0];
		}
		if(x<150)
		{
			return freePiles[1];
		}
		if(x<210)
		{
			return freePiles[2];
		}
		if(x<270)
		{
			return freePiles[3];
		}
		
		
		if(x>300 && x<390)
		{
			return finalPiles[0];
		}
		if(x>=390 && x<450)
		{
			return finalPiles[1];
		}
		if(x>=450 && x<510)
		{
			return finalPiles[2];
		}
		if(x>=510 && x<600)
		{
			return finalPiles[3];
		}
		//570 is the right edge of the last pile
	}
	
	return undefined;
}

function mouseClicked()
{
	if(gameover)
	{
		setup();
	}
}

function getFreeSpaces()
{
	var s = 0;
	for(var i=0;i<board.length;++i)
	{
		if(board[i].cards.length==0) ++s;
	}
	
	for(var i=0;i<freePiles.length;++i)
	{
		if(freePiles[i].cards.length==0) ++s;
	}
	return s;
}

function mouseReleased()
{
	if(valid)
	{		
		var success = false;
		var x = mouseX;
		var y = mouseY;
		destPile = getPileByCoords(x,y);
		if(destPile && movedPile)
		{
			//free spaces
			if(y<100 && x<280)
			{
				if(movedPile.cards.length==1)
				{
					if(destPile.empty())
					{
						success = true;
						destPile.placePile(movedPile.cards);
					}
				}
				else
				{
					success = false;
				}
			}
			
			//final piles
			else if(y<100 && x>=280)
			{
				if(movedPile.cards.length==1)
				{
					if(destPile.empty() && movedPile.getTop().value=='A')
					{
						success = true;
						destPile.placePile(movedPile.cards);
					}
					else if(!destPile.empty() && destPile.getTop().color == movedPile.getTop().color && destPile.getTop().lessThan(movedPile.getTop()))
					{
						success = true;
						destPile.placePile(movedPile.cards);
					}

				}
				else
				{
					success = false;
				}
			}
			else if(destPile.canPlacePile(movedPile) && (!destPile.empty() && movedPile.cards.length<=getFreeSpaces()+1) || 
															(destPile.empty() && movedPile.cards.length<=getFreeSpaces()))
			{
				success = true;
				destPile.placePile(movedPile.cards);
			}
			else
			{
				success = false;
			}
		}
		
		
		if(movedPile && !success)
		{
			sourcePile.placePile(movedPile.cards);
		}
		
		sourcePile = undefined;
		movedPile = undefined;
		clicked = false;
		valid = false;
	}
	var s = 0;
	for(var i=0;i<finalPiles.length;++i)
	{
		s += finalPiles[i].cards.length;
	}
	if(s==52)
	{
		alert('Game won!');
		gameover = true;
	}
}