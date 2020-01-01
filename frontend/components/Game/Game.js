import React from 'react';
import Koji from '@withkoji/vcc';
import { useSwipeable, Swipeable } from 'react-swipeable'

import {
	StyledSwipeable,
	StyledBackgroundContainer,
	StyledGameContainer,
	StyledGameContainerInner,
	StyledGameRow,
	StyledButton,
	StyledButtonContainer,
	StyledGameCell} from './Game.styled';

export class Game extends React.Component {
	EMPTY = 0;
	PLAYER = 1;
	BOX = 2;
	WALL = 3;
	PLAYER_DOWN = 0;
	PLAYER_UP = 1;
	PLAYER_RIGHT = 2;
	PLAYER_LEFT = 3;
	ends = [];
	ROW_MAX = 0;
	COL_MAX = 0;
	images = [];
	groundImage = '';
	endImage = '';
	currentLevel = 0;
	player_direction = 0;
	useFloorImage = false;
	backgroundImage = '';
	animateBackground = false;

	constructor(props) {
		super(props);
		this.state = {
			level: [],
			win: false
		};
		this.currentLevel = props.currentLevel,
		this.images[this.EMPTY] = '';

		this.images[this.PLAYER] = [];
		this.images[this.PLAYER][this.PLAYER_DOWN] = Koji.config.images.player,
		this.images[this.PLAYER][this.PLAYER_UP] = Koji.config.images.player_up ? Koji.config.images.player_up : Koji.config.images.player,
		this.images[this.PLAYER][this.PLAYER_RIGHT] = Koji.config.images.player_right ? Koji.config.images.player_right : Koji.config.images.player,
		this.images[this.PLAYER][this.PLAYER_LEFT] = Koji.config.images.player_left ? Koji.config.images.player_left : Koji.config.images.player,

		this.images[this.BOX] = Koji.config.images.box;
		this.images[this.WALL] = Koji.config.images.wall;
		this.groundImage = Koji.config.images.ground;
		this.endImage = Koji.config.images.end;

		this.useFloorImage = Koji.config.background.useFloorImage;
		this.backgroundImage = Koji.config.background.backgroundImage;
		this.animateBackground = Koji.config.background.animate;
	}

	componentDidMount() {
		// Force an update of the dom on prop changes
		// This is just for development situations so
		// that we can test prop changes in real-time.
		Koji.on('change', () => {
			this.forceUpdate();
		});

		this.loadLevel(this.currentLevel);
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
		// Use stringify->parse to get a deep copy and not edit the config json
		let levelData = JSON.parse(JSON.stringify(Koji.config.levels.levels[levelNumber]));
		let level = levelData['level'];
		this.ends = levelData['ends'];
		this.ROW_MAX = level.length - 1;
		this.COL_MAX = level[0].length - 1;
		this.player_direction = 0;
		this.setState({'level': level, 'win': false});
	};

	restartLevel = () => {
		this.loadLevel(this.currentLevel);
	}

	nextLevel = () => {
		this.currentLevel += 1;
		this.loadLevel(this.currentLevel);
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
		this.player_direction = this.PLAYER_LEFT;
		this.move(-1,0);
	};

	moveRight = () => {
		this.player_direction = this.PLAYER_RIGHT;
		this.move(1,0);
	};

	moveDown = () => {
		this.player_direction = this.PLAYER_DOWN;
		this.move(0,1);
	};

	moveUp = () => {
		this.player_direction = this.PLAYER_UP;
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
		let { level, win, currentLevel } = this.state;
		let backgroundImage = this.useFloorImage ? this.groundImage : this.backgroundImage;
		let backgroundClass = this.animateBackground ? 'animate' : '';
		backgroundClass += this.useFloorImage ? ' darken' : '';
		return(
			<Swipeable
				style={StyledSwipeable}
				onSwipedLeft={this.moveLeft}
				onSwipedRight={this.moveRight}
				onSwipedUp={this.moveUp}
				onSwipedDown={this.moveDown}>
			<StyledGameContainer backgroundImage={backgroundImage} className={backgroundClass}>
				<StyledGameContainerInner>
                    <StyledButtonContainer>
						<StyledButton>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
						</StyledButton>
						{(/*win &&*/
							<StyledButton onClick={this.nextLevel}>	
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
							</StyledButton>
						)}
						<StyledButton onClick={this.restartLevel}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
						</StyledButton>
					</StyledButtonContainer>
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
													image={cell == this.PLAYER ? this.images[this.PLAYER][this.player_direction] : this.images[cell]}
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
				</StyledGameContainerInner>
			</StyledGameContainer>
			</Swipeable>
		);
	}
}