import React from 'react';
import styled from 'styled-components';

const AddButton = ({onClick,visible}) => {

    return (
        <AddButtonDiv onClick={onClick} visible={visible}>+</AddButtonDiv>
    )
}

const AddButtonDiv = styled.div`
    display: ${props => props.visible ? 'flex' : 'none'};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.ae.panelBackgroundColor};
    width:100%;
`

export default AddButton 