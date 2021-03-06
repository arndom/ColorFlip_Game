import styled, { keyframes, css } from 'styled-components';
import Koji from '@withkoji/vcc';



export const StyledBackgroundContainer = styled.div`
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	z-index: 9;
	border-radius: 6px;
	overflow: hidden;
	box-shadow: 0 0 6px rgba(0,0,0,0.16), 0 0 6px rgba(0,0,0,0.23);
`;

const scroll = keyframes`
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: 128px 128px;
  }
`;

export const StyledGameContainer = styled.div`
	background-color: ${Koji.config.colors.backgroundColor};
	background-image: url("${props => props.backgroundImage}");
	background-size: 128px 128px;
	width: 100vw;
	height: 100vh;
	box-sizing: border-box;
	padding: 50px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	position: relative;
	overflow: hidden;
	&.animate {
		animation-name: ${scroll};
		animation-duration: 10s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;
	}
	&.darken:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.4);
		z-index: 0;
	}
`;

export const StyledGameContainerInner = styled.div`
	z-index: 11;
`;

export const StyledGameRow = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	z-index: 10;
`;

export const StyledGameCell = styled.span`	
    flex: auto
	padding: 5px;
	width: 2.5rem;
	height: 2.5rem;
	background-image: url("${props => props.image}");
	background-size: contain;
	&.end {
		background-image: url("${props => props.endImage}"), url("${props => props.image}");
	}
`;

export const StyledButtonContainer = styled.div`
	margin-bottom: 20px;
	display: flex;
	justify-content: center;
	position: relative;
	z-index: 11;
`;

export const StyledButton = styled.a`
    flex-grow: fill;
	text-decoration: none;
	display: inline-block;
	padding: 5px 15px;
	box-sizing: border-box;
	background-color: ${Koji.config.colors.actionColor};
	border-radius: 6px;
	border-bottom: 4px solid rgba(0,0,0,0.3);
	font-weight: bold;
	text-transform: uppercase;
	margin: 0 5px;
	min-width: 50px;
	position: relative;
	overflow: hidden;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
	color: ${Koji.config.colors.buttonTextColor};
	text-align: center;
	svg {
		fill: ${Koji.config.colors.buttonTextColor};
	}
	&:hover:after {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255,255,255, 0.3);
	}
	&:active {
		border-bottom-width: 0px;
		margin-bottom: 4px;
		transform: translateY(4px);
	}
	&.done:before{
		position: absolute;
		right: 2px;
		bottom: 0;
		content: '✓';
		z-index: 99;
		color: gold;
	}
	&.current {
		border: none;
		cursor: auto;
		&:after {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: rgba(0,0,0, 0.3);
		}
	}
`;

export const StyledLevelList = styled.div`
	text-align: left;
	max-width: 250px;
`;

export const StyledLevelContainer = styled.div`
	transform: translate(${props=>props.offset.x*-32}px, ${props=>props.offset.y*-32}px);
	${props => props.zoom && css`
		transform-origin: top;
		transform: scale(${props => props.zoom});
	`}
`;

export const StyledTooltop = styled.div`
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	background-color: #FFF;
	padding: 10px;
	border-radius: 6px;
	box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
	margin-top: 3px;
	white-space: nowrap;
	&:after {
		content: '';
		display: block;
		position: absolute;
		bottom: 100%;
		right: 32px;
		border: 10px solid transparent;
		border-bottom: 10px solid #FFF;
	}
`;

// Use classic inline-style object for imported module component
export const StyledSwipeable = {
	touchAction: 'none',
	height: '100%',
	color: Koji.config.colors.textColor
};