import React, {useState,useEffect,useRef} from 'react';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import Select, { components } from 'react-select';

const SelectionOutputs = ({outputTemplates,selectedOutput,setSelectedOutput}) => {

    const [selectionOpen,setSelectionOpen] = useState(false)

    // Set the preset groups open. Runs when header is clicked.

    // Handle Menu open close
    const onInputChange = (props, { action }) => {
        if (action === "menu-close") setSelectionOpen(false);
    };
    
      // Styling
    const theme = useTheme();
    const customStyles = {
        option: (provided, state) => ({
            backgroundColor: state.isFocused ? theme.background.light : theme.background.dark ,
            borderBottom: theme.ae.panelBackgroundColor,
            color: state.isSelected ? theme.text.highlight : theme.text.mid,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            height: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0px 10px',
        }), 
        menu: (provided, state) => ({
            ...provided,
            backgroundColor: theme.background.dark ,
            border: theme.background.light,
            borderStyle: 'hidden solid solid solid',
            borderWidth: '1.5px',
            borderRadius: '0px',
            margin: '3px 0px 0px 0px',
            padding: '0px',
        }),
        group: (provided, state) => ({
            ...provided,
            margin: '0px 0px',
            padding: '0px 0px',
        }),
        menuList: (provided, state) => ({
            ...provided,
            padding: '0px',
            "::-webkit-scrollbar": {
                width: "10px",
                height: "0px",
            },
            "::-webkit-scrollbar-track": {
                background:  theme.background.dark,
            },
            "::-webkit-scrollbar-thumb": {
                background: theme.ae.panelBackgroundColor,
            },
            "::-webkit-scrollbar-corner": {
                background: theme.background.dark,
            },
        }),
        control: (provided, state) => ({
            ...provided,
            minHeight: '20px',
            height: '25px',
            borderRadius: '0px',
            color: theme.text.highlight,
            borderColor: theme.background.light,
            backgroundColor: theme.background.dark,
            boxShadow: '0 0 0 0px #2684FF',
        }),
        indicatorSeparator: (provided, state) => ({
            ...provided,
            opacity: 0,
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            // padding: '0px 10px',
            position: 'static',
            height: '100%',
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            position: 'static',
            height: '100%',
        }),
        singleValue: (provided, state) => ({
            ...provided, 
            color: !state.menuIsOpen ? theme.text.highlight : theme.text.mid,
            // backgroundColor : state.menuIsOpen ? 'red':'blue',
        }),
        groupHeading: (provided, state) => ({
            ...provided,
            // color: theme.colors.purple,
            // backgroundColor: state.isFocused ? theme.background.light : theme.background.dark,
            // padding: '0px 15px'
        }),
        input: (provided, state) => ({
            ...provided, 
            color: theme.colors.purple,
            // backgroundColor: state.isFocused ? theme.background.light : theme.background.dark,
            // padding: '0px 15px'
        }),
    }

    // Options
    function getOptions(templates){
        var templateArray = []
        if(templates.length == 0){
            templateArray.push(selectedOutput)
        }else{
            templates.map(template => {
                templateArray.push({value: template.template, label: template.template})
            })
        }

        return templateArray;
    }
    var selectionOptions = getOptions(outputTemplates)

    return(
        <SelectionContainerTwo>
            <Select
                styles={customStyles}
                value={selectedOutput}
                onChange={setSelectedOutput}
                options={selectionOptions}
                // onInputChange={onInputChange}
                // menuIsOpen={selectionOpen}
                isSearchable={false}
            />
        </SelectionContainerTwo>
    )
}

// Theme
const SelectionContainerTwo = styled.div`
    width: 50%;
    min-width: 200px;
    margin: 3px 0px;
`

export default SelectionOutputs