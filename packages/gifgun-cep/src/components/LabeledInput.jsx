import React from 'react';
import styled from 'styled-components';

const LabeledInput = ({id, label, value, onChange, isVisible,inputWidth}) => {
    // Return
    return(
        <Label isVisible={isVisible}>
            <SpanLabel value={value}>{label}</SpanLabel>
            <Input id={id} value={value} onChange={onChange} label={label} inputWidth={inputWidth}></Input>
        </Label>
    )
};

const Label = styled.div`
    display: ${props => props.isVisible ? 'flex' : 'none'};
    justify-content: space-between;
    width: 100%;
    margin: 3px 0 3px 0;
`

const SpanLabel = styled.span`
    display: flex;
    align-items: center;
    color: ${props => props.value != 0 ? props.theme.text.bright : props.theme.text.mid};
`

const Input = styled.input.attrs({ 
    type: 'text',
  })`
    width: ${props => props.inputWidth ? props.inputWidth : '35px'};
    height: 20px;
    background-color: ${props => props.theme.background.dark};
    border: solid;
    border-width: 1px;
    border-color: ${props => props.theme.background.light};
    box-sizing: border-box;
    color: ${props => props.value != 0 ? props.theme.text.bright : props.theme.text.mid};
    &:focus {
        background-color: ${props => props.theme.background.darker};
        border-color: ${props => props.theme.ae.systemHighlightColor};
        box-shadow: '0 0 0 0px #2684FF';
        color: ${props => props.theme.text.highlight};

    };
    
`

export default LabeledInput