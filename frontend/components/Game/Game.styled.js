import styled from 'styled-components';
import Koji from '@withkoji/vcc';

export const StyledGameContainer = styled.div`
	background-color: Koji.config.colors.backgroundColor;
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
`;

export const StyledGameRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;	
`;

export const StyledGameCell = styled.span`
	display: inline-block;
	padding: 5px;
	width: 32px;
	height: 32px;
	background-image: url("${props => props.image}");
	background-size: contain;
	&.end {
		color: red;
	}
`;