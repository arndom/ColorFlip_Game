import React from 'react';
import Koji from '@withkoji/vcc';
import { useSwipeable, Swipeable } from 'react-swipeable';
import { Modal } from '../Modal';
import { Home } from '../Modal';




import {
	StyledSwipeable,
	StyledBackgroundContainer,
	StyledGameContainer,
	StyledGameContainerInner,
	StyledGameRow,
	StyledButton,
	StyledButtonContainer,
	StyledGameCell,
	StyledLevelList,
	StyledLevelContainer,
	StyledTooltop} from './Game.styled';


export class Game extends React.Component {
	EMPTY = 0;
	PLAYER = 1;
	WALL = 2;
	PLAYER_DOWN = 0;
	PLAYER_UP = 1;
	PLAYER_RIGHT = 2;
	PLAYER_LEFT = 3;
	ROW_MAX = 0;
	COL_MAX = 0;
	images = [];
	groundImage = '';
	currentLevel = 0;
	player_direction = 0;
	useFloorImage = false;
	backgroundImage = '';
	animateBackground = false;
	OFFSET_THRESHOLD = 2;
	SCALE_MAX = 7;
	LEVELS_PER_PAGE = 14;
    initial_level_string = '';

	constructor(props) {
		super(props);
		this.state = {
			level: [],
			win: false,
			readInstructions: false,
			levelSelect: false,
			levelSelectPage: 0,
			levelsCompleted: [],
			offset: {x:0,y:0},
			zoom: false,
			hasZoomed: false,
            isFlipped: false

		};
		this.currentLevel = props.currentLevel,
		this.images[this.EMPTY] = '';

        this.flip = this.flip.bind(this);


		this.images[this.PLAYER] = [];
		this.images[this.PLAYER][this.PLAYER_DOWN] = Koji.config.images.player,
		this.images[this.PLAYER][this.PLAYER_UP] = Koji.config.images.player,
		this.images[this.PLAYER][this.PLAYER_RIGHT] = Koji.config.images.player,
		this.images[this.PLAYER][this.PLAYER_LEFT] =  Koji.config.images.player,

		this.images[this.WALL] = Koji.config.images.wall;
		this.groundImage = Koji.config.images.ground;

		this.questionmark = Koji.config.images.mark;

		this.useFloorImage = Koji.config.background.useFloorImage;
		this.backgroundImage = Koji.config.background.backgroundImage;
		this.animateBackground = Koji.config.background.animate;
		this.loadGame()
	}

	componentDidMount() {
        // this.backgroundMusic = Sound.findAndLoop(Koji.config.sounds.backgroundMusic, this.props.muted);
		this.loadLevel(this.currentLevel);
		document.addEventListener('keydown', this.keyDown);
	}

    
    shouldComponentUpdate(nextProps,nextState) {
        let new_level_string = JSON.stringify(Koji.config.levels.levels[this.currentLevel]);
        if (this.initial_level_string != new_level_string) {
            this.loadLevelFromString(new_level_string,this.currentLevel);
        }
        return true;
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
		if (key === " " || key === 32) {
			if (this.state.win) {
				this.nextLevel();
			}
		}
	};

	saveGame = () => {
		if (typeof(Storage) !== "undefined") {
            window.localStorage.setItem('currentLevel', JSON.stringify(this.currentLevel));
            window.localStorage.setItem('levelsCompleted', JSON.stringify(this.state.levelsCompleted));
            window.localStorage.setItem('readInstructions', JSON.stringify(this.state.readInstructions));
        }
	};

	loadGame = () => {
		if (typeof(Storage) !== "undefined") {
			let currentLevel = window.localStorage.getItem('currentLevel');
			let levelsCompleted = window.localStorage.getItem('levelsCompleted');
			let readInstructions = window.localStorage.getItem('readInstructions');
			if (currentLevel) {
				this.currentLevel = JSON.parse(currentLevel);
				this.state.levelsCompleted = JSON.parse(levelsCompleted);
				this.state.readInstructions = JSON.parse(readInstructions);
			}
		}
	}

    loadLevelFromString = (levelString, levelNumber) => {
        this.initial_level_string = levelString;
        let levelData = JSON.parse(this.initial_level_string);
        let level = levelData['level'];
		this.ROW_MAX = level.length - 1;
		this.COL_MAX = level[0].length - 1;
		this.player_direction = 0;
		this.currentLevel = levelNumber;
		this.saveGame();
		this.updateOffset(this.findPlayer(level));
		this.setState({'level': level, 'win': false, 'levelSelect': false});
    };

	loadLevel = (levelNumber) => {
		// Use stringify and later parse to get a deep copy and not edit the config obj
		this.loadLevelFromString(JSON.stringify(Koji.config.levels.levels[levelNumber]), levelNumber)
		
	};

	restartLevel = () => {
		this.loadLevel(this.currentLevel);
	};

	nextLevel = () => {
		this.currentLevel += 1;
		this.loadLevel(this.currentLevel);
	
		// if(this.currentLevel === ((Koji.config.levels.levels).length -1) ){
			
		// 		this.lastLevel();

			
		// }
	};
  
    lastLevel = () => {
        this.setState({levellast : true})
    } 

	closeInstructions = () => {
		this.setState({readInstructions:true}, this.saveGame);
	};
    closeHomeScreen = () => {
		this.setState({startGame:true}, this.saveGame);
	};

	openLevelSelect = () => {
		let currentPage = Math.floor(this.currentLevel / this.LEVELS_PER_PAGE);
		this.setState({levelSelect:true, levelSelectPage:currentPage});
	};

    openLevelSelectAfterWin = () => {
        let currentPage = Math.floor(this.currentLevel / this.LEVELS_PER_PAGE);
		this.setState({levelSelect:true, levelSelectPage:currentPage, levellast : false});
    }

	openIns = () => {
		this.setState({openins:true});
	}

	closeOpenIns = () => {
		this.setState({openins:false});
	} 

	closeLevelSelect = () => {
		this.setState({levelSelect:false});
	};

	levelSelectBack = () => {
		this.setState({levelSelectPage:this.state.levelSelectPage-1});
	};

	levelSelectForward = () => {
		this.setState({levelSelectPage:this.state.levelSelectPage+1});
	};

	findPlayer = (level) => {
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

    flip = () => {
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }

    move = (x,y) => {
		let player = this.findPlayer(this.state.level);
		let target = {x:player.x+x, y:player.y+y};

		// Cant leave level
		if (this.COL_MAX < target.x || target.x < 0 || this.ROW_MAX < target.y || target.y < 0) {
			return false;
		}

		// erase tile
		if (this.atPosition(target) == this.WALL) {
            let groundT = {x: target.x-x,  y: target.y-y };
            this.setPosition(target, this.PLAYER);
            this.setPosition(groundT, this.EMPTY);
            this.flip();
            if (this.win()) {
				    this.setState({'win': true});
					//end of levels condition
					if(this.currentLevel === ((Koji.config.levels.levels).length -1) ){
						this.lastLevel();
					}
			      }      
            return true;
		}
    
        // draw tile
        if(this.atPosition(target) == this.EMPTY){
            
            this.setPosition(target, this.PLAYER);
            
            this.setPosition(player, this.WALL);
            this.flip();
            if (this.win()) {
				    this.setState({'win': true});
					//end of levels condition
					if(this.currentLevel === ((Koji.config.levels.levels).length -1) ){
						this.lastLevel();
					}
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

        

        let level = this.state.level;
        for (var i = level.length - 1; i >= 0; i--) {
		for (var j = level[i].length - 1; j >= 0; j--) {
				if (level[i][j] == this.EMPTY) {
					return false;
				}
			}
            // console.log(currentLevel)
		}

		let { levelsCompleted } = this.state;
		levelsCompleted.push(this.currentLevel);
		this.setState({levelsCompleted: levelsCompleted}, this.saveGame);
		return true;
	};

	updateOffset = (player) => {
		if (this.COL_MAX < this.SCALE_MAX && this.ROW_MAX < this.SCALE_MAX) {
			this.setState({
				offset:{x:0,y:0}
			});
			return;
		}
		const middleX = (this.COL_MAX) / 2;
		const middleY = (this.ROW_MAX) / 2;
		let { offset } = this.state;
		while (player.x < middleX + offset.x - this.OFFSET_THRESHOLD ) {
			offset.x -= 1;
		}
		while (player.x > middleX + offset.x + this.OFFSET_THRESHOLD ) {
			offset.x += 1;
		}
		while (player.y < middleY + offset.y - this.OFFSET_THRESHOLD ) {
			offset.y -= 1;
		}
		while (player.y > middleY + offset.y + this.OFFSET_THRESHOLD ) {
			offset.y += 1;
		}
		this.setState({offset:offset});
	};

	zoomOut = () => {
		let max_dimension = Math.max(this.COL_MAX, this.ROW_MAX) + 1;
		let scale = max_dimension > this.SCALE_MAX ? this.SCALE_MAX/max_dimension : false;
		this.setState({zoom:scale, hasZoomed: true});
	};

	zoomReset = () => {
		this.setState({zoom:false});
	};

	render() {
		let {
			level,
			win,
			currentLevel,
			readInstructions,
            startGame,
			levelSelect,
			levelsCompleted,
			offset,
			zoom,
			hasZoomed,
			levelSelectPage,
			openins,
            levellast
		} = this.state;
        
		let backgroundImage = this.useFloorImage ? this.groundImage : this.backgroundImage;
		let backgroundClass = this.animateBackground ? 'animate' : '';
		backgroundClass += this.useFloorImage ? ' darken' : '';
		const levels = JSON.parse(JSON.stringify(Koji.config.levels.levels));
		const max_dimension = Math.max(this.COL_MAX, this.ROW_MAX) + 1;
		const canZoom = max_dimension > this.SCALE_MAX;


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

                            <StyledButton onClick={this.openLevelSelect}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                            </StyledButton>

                            <StyledButton onClick={this.restartLevel}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                            </StyledButton>

                            <StyledButton onClick={this.openIns}>
                                <div style  = {{ fontSize: "24px", width: "36px", fontWeight:"bold"}}>&#63;</div>
                            </StyledButton>
                            
                            {(canZoom && <StyledButton
                                onTouchStart={this.zoomOut}
                                onTouchEnd={this.zoomReset}
                                onMouseDown={this.zoomOut}
                                onMouseUp={this.zoomReset}
                                onMouseLeave={this.zoomReset}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg>
                            </StyledButton>)}

                            {(canZoom && !hasZoomed && Koji.config.strings.zoom_tooltip &&
                                <StyledTooltop>
                                    {Koji.config.strings.zoom_tooltip}
                                </StyledTooltop>
                            )}

                        </StyledButtonContainer>
                        
                    
                        <StyledLevelContainer offset={offset} zoom={zoom}>

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
                                                        />
                                                    )
                                                }
                                            )
                                        }
                                    </StyledGameRow>
                                    )

                                }
                            )}

                        </StyledLevelContainer>

                    </StyledGameContainerInner>

                </StyledGameContainer>

                
                {(win &&
                    <Modal>
                        <h3>{Koji.config.strings.level_complete_title}</h3>
                        <p>{Koji.config.strings.level_complete_text}</p>
                        <StyledButton onClick={this.nextLevel}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                        </StyledButton>
                    </Modal>
                )}

                {(!readInstructions &&
                    <Modal close={this.closeInstructions}>
                        {(Koji.config.images.logo &&
                            <img src={Koji.config.images.logo}/>
                        )}  
                        {(!Koji.config.images.logo &&
                            <h3>{Koji.config.strings.welcome_title}</h3>
                        )}
                        <p>{Koji.config.strings.welcome_text_1}<br/>{Koji.config.strings.welcome_text_2}</p>
                        <StyledButton onClick={this.closeInstructions}>
                            GOT IT
                        </StyledButton>
                    </Modal>
                )}

                {(!startGame &&
                    <Home>
                        <div style={{ background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)", height: "93vh", width: "75vw", margin: "auto", display:"block"}}>
                            
                            <div style = {{paddingTop: "10vh"}}>
                                {(Koji.config.images.home &&
                                    <img src={Koji.config.images.home}/>
                                )}
                            
                                {(!Koji.config.images.home &&
                                    <h3>{Koji.config.strings.fallbackText}</h3>
                                )}
                            </div>
                            

                            <div  style = {{paddingTop: "10vh"}}>
                                <StyledButton onClick={this.closeHomeScreen}>
                                    <h2>{Koji.config.strings.play}</h2>
                                </StyledButton>
                            </div>

                        </div>

                    </Home>
                )}


                {(openins &&
                    <Modal close = {this.closeOpenIns}>
                        {(Koji.config.images.logo &&
                            <img src={Koji.config.images.logo}/>
                        )}
                        {(!Koji.config.images.logo &&
                            <h3>{Koji.config.strings.welcome_title}</h3>
                        )}
                        <p>{Koji.config.strings.welcome_text_1}<br/>{Koji.config.strings.welcome_text_2}</p>
                    </Modal>
                )}

                {(levellast &&
                    <Modal>
                        {(Koji.config.images.win &&
                            <img src={Koji.config.images.win}/>
                        )}
                            {(!Koji.config.images.win &&
                                <h3>{Koji.config.strings.win_text_1}</h3>
                            )}

                        <p>{Koji.config.strings.win_text_2}</p>
                            

                            <StyledButton onClick={this.openLevelSelectAfterWin}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                            </StyledButton>

                            
                    </Modal>
                )}


                
                {(levelSelect &&
                    <Modal close={this.closeLevelSelect}>

                        <h3>{Koji.config.strings.level_select_title}</h3>

                        <StyledLevelList>

                            {(levelSelectPage!= 0 &&
                                <StyledButton key={'back'} onClick={this.levelSelectBack}>
                                        &lsaquo;
                                </StyledButton>
                            )}

                            {levels.map(
                                (level, level_index) => {
                                    if (Math.floor(level_index /this.LEVELS_PER_PAGE) == levelSelectPage) {
                                    return(
                                        <span key={'container-'+level_index}>
                                            <StyledButton
                                                className={
                                                    (levelsCompleted.includes(level_index) ? 'done' : '') +
                                                    (this.currentLevel == level_index ? ' current': '')
                                                }
                                                key={level_index}
                                                onClick={()=>{this.loadLevel(level_index)}}>
                                                    {level_index+1}
                                            </StyledButton>
                                        </span>
                                    )}
                                }
                            )}

                            {( Math.floor((levels.length - 1) / this.LEVELS_PER_PAGE) > levelSelectPage &&
                                <StyledButton key={'forward'} onClick={this.levelSelectForward}>
                                        &rsaquo;
                                </StyledButton>
                            )}

                        </StyledLevelList>
                    </Modal>
                )}

			</Swipeable>

			
		);
	}
}