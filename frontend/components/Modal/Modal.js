import React from 'react';
import Koji from '@withkoji/vcc';
import { StyledModal, StyledModalInner } from './Modal.styled';

export class Modal extends React.Component {
	render() {
		return(
			<StyledModal>
				<StyledModalInner>
					{this.props.children}
				</StyledModalInner>
			</StyledModal>
		);
	}
}
