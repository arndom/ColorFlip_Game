import React from 'react';
import Koji from '@withkoji/vcc';
import { StyledBackgroundContainer, StyledGameContainer, StyledGameRow, StyledGameCell } from './Game.styled';

export class Game extends React.Component {
	EMPTY = 0;
	PLAYER = 1;
	BOX = 2;
	WALL = 3;
	ends = [];
	ROW_MAX = 0;
	COL_MAX = 0;
	images = [];
	groundImage = '';
	endImage = '';

	constructor(props) {
		super(props);
		this.state = {
			level: [],
			win: false
		};
		this.images[this.EMPTY] = '';
		this.images[this.PLAYER] = Koji.config.images.player;
		this.images[this.BOX] = Koji.config.images.box;
		this.images[this.WALL] = Koji.config.images.wall;
		this.groundImage = Koji.config.images.ground;
		this.endImage = Koji.config.images.end;
	}

	componentDidMount() {
		// Force an update of the dom on prop changes
		// This is just for development situations so
		// that we can test prop changes in real-time.
		Koji.on('change', () => {
			this.forceUpdate();
		});

		this.loadLevel(0);
		document.addEventListener('keydown', this.keyDown);
	}


	keyDown = (event) => {
		let key = event.key || event.keyCode;
		if (key === "ArrowLeft" || key === 37) {
			this.moveLeft();
		}
		if (key === "ArrowRight" || key === 39) {
			this.moveRight();
		}
		if (key === "ArrowUp" || key === 38) {
			this.moveUp();
		}
		if (key === "ArrowDown" || key === 40) {
			this.moveDown();
		}
	};

	loadLevel = (levelNumber) => {
		let levelData = Koji.config.levels.levels[levelNumber];
		let level = levelData['level'];
		this.ends = levelData['ends'];
		this.ROW_MAX = level.length - 1;
		this.COL_MAX = level[0].length - 1;
		this.setState({'level': level});
	};

	findPlayer = () => {
		const { level } = this.state;
		for (var i = level.length - 1; i >= 0; i--) {
			for (var j = level[i].length - 1; j >= 0; j--) {
				if (level[i][j] == this.PLAYER) {
					return {x: j, y: i};
				}
			}
		}
		return null;
	};

	atPosition = (position) => {
		return this.state.level[position.y][position.x];
	};

	setPosition = (position, value) => {
		let { level } = this.state;
		level[position.y][position.x] = value;
		this.setState({"level": level});
	};

	move = (x,y) => {
		let player = this.findPlayer()
		let target = {x:player.x+x, y:player.y+y};
		// Cant leave level
		if (this.COL_MAX < target.x || target.x < 0 || this.ROW_MAX < target.y || target.y < 0) {
			return false;
		}

		// Cant walk through walls
		if (this.atPosition(target) == this.WALL) {
			return false;
		}

		if (this.atPosition(target) == this.BOX) {
			let boxTarget = {x:target.x+x, y:target.y+y};

			// Cant push box out of level
			if (this.COL_MAX < boxTarget.x || boxTarget.x < 0 || this.ROW_MAX < boxTarget.y || boxTarget.y < 0) {
				return false;
			}

			// Cant push box into box or wall
			if ([this.WALL, this.BOX].includes(this.atPosition(boxTarget))) {
				return false;
			}
			
			// TODO: batch these sets as it currently does multiple state updates (therefore multiple re-renders)
			this.setPosition(boxTarget, this.BOX);
			this.setPosition(target, this.PLAYER);
			this.setPosition(player, this.EMPTY);
			if (this.win()) {
				this.setState({'win': true});
			}
			return true;
		} else {
			this.setPosition(target, this.PLAYER);
			this.setPosition(player, this.EMPTY);
			if (this.win()) {
				this.setState({'win': true});
			}
			return true;
		}
	};

	moveLeft = () => {
		this.move(-1,0);
	};

	moveRight = () => {
		this.move(1,0);
	};

	moveDown = () => {
		this.move(0,1);
	};

	moveUp = () => {
		this.move(0,-1);
	};

	win = () => {
		for (var i = this.ends.length - 1; i >= 0; i--) {
			if (this.atPosition(this.ends[i]) != this.BOX) {
				return false;
			}
		}
		return true;
	};

	isEnd = (x, y) => {
		for (var i = this.ends.length - 1; i >= 0; i--) {
			if (this.ends[i].x == x && this.ends[i].y == y) {
				return true;
			}
		}
		return false;
	};


	render() {
		let { level, win } = this.state;
		return(
			<StyledGameContainer>
				<StyledBackgroundContainer>
				{level.map(
					(row, row_index) => {
						return(
						<StyledGameRow key={row_index}>
							{
								row.map(
									(cell, cell_index) => {
										return(
											<StyledGameCell
												key={cell_index}
												image={this.groundImage}
											/>
										)
									}
								)
							}
						</StyledGameRow>
						)

					}
				)}
				</StyledBackgroundContainer>
			{level.map(
				(row, row_index) => {
					return(
					<StyledGameRow key={row_index}>
						{
							row.map(
								(cell, cell_index) => {
									return(
										<StyledGameCell
											key={cell_index}
											image={this.images[cell]}
											endImage={this.endImage}
											className={this.isEnd(cell_index, row_index) ? 'end' : ''}
										/>
									)
								}
							)
						}
					</StyledGameRow>
					)

				}
			)}
			{(win && <p>You win!</p>)}
			</StyledGameContainer>
		);
	}
}