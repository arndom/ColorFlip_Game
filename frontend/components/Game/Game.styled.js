import styled, { keyframes } from 'styled-components';
import Koji from '@withkoji/vcc';

export const StyledBackgroundContainer = styled.div`
	position: absolute;
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
	background-image: url(${Koji.config.images.ground});
	background-size: 128px 128px;
	animation-name: ${scroll};
	animation-duration: 10s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	position: relative;
	&:after {
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

export const StyledGameRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
	z-index: 10;
`;

export const StyledGameCell = styled.span`
	display: inline-block;
	padding: 5px;
	width: 32px;
	height: 32px;
	background-image: url("${props => props.image}");
	background-size: contain;
	&.end {
		background-image: url("${props => props.endImage}"), url("${props => props.image}");
	}
`;