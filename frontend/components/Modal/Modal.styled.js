import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
`;

const slideIn = keyframes`
	0% {
		transform: translateY(-50%);
	}
	100% {
		transform: translateY(0%);
	}
`;

export const StyledModal = styled.div`
	background-color: rgba(0,0,0,0.5);
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	padding-top: 25vh;
	animation-name: ${fadeIn};
	animation-duration: 0.4s;
	animation-iteration-count: 1;
	animation-timing-function: ease-in-out;
`;

export const StyledModalInner = styled.div`
	background-color: white;
	padding: 20px;
	border-radius: 6px;
	box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
	text-align: center;
	animation-name: ${slideIn};
	animation-duration: 0.4s;
	animation-iteration-count: 1;
	animation-timing-function: ease-in-out;
	position: relative;
`;

export const StyledClose = styled.a`
	cursor: pointer;
	position: absolute;
	top: 5px;
	right: 5px;
	border-radius: 50%;
	background-color: #DDD;
	width: 24px;
	height: 24px;
	text-align: center;
	vertical-align: center;
	svg {
		fill: #FFF;
	}
	&:hover {
		background-color: #AAA;
	}
`;