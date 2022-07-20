import React, {useState,useEffect,useRef} from 'react';
import styled from 'styled-components';
import { useTheme } from 'styled-components';
import Select, { components } from 'react-select';
import presets from './presets'
import { render } from 'react-dom';

const Selection = ({presetOpen,setPresetOpen,selectedPreset,setSelectedPreset, moshModules,isTrial}) => {



    // Set selected open preset 
    const [presetGroupsOpen, setPresetGroupsOpen] = useState({
        default : false, 
        zoom : false, 
        sinCos : false, 
        average : false, 
        spatial : false, 
        random : false,
        mirror : false,
        sweep : false,
        experimental : false,
    });

    const reactSelectHeadingRef = useRef(null);
    const reactSelectNum = useRef(2);

    useEffect(()=>{
        if(presetOpen && moshModules.length != 0) {
            var groupId = reactSelectHeadingRef.current.firstChild.id;
            // Set the correct react-select num
            reactSelectNum.current = groupId.match(/\d+/).shift();
            setCollapsed()
        }
    },[presetGroupsOpen,presetOpen])


    // Adding expandibility funcitonality from https://www.chintanradia.com/blog/react-select-collapsible-group/   

    // Handle when the group header is clicked, collapses the group. Calls setCollapsed.
    const handleHeaderClick = id => {
        console.log(id)
        //Store open in state. 
        var num = reactSelectNum.current;
        if (id == `react-select-${num}-group-0-heading`){
            setPresetGroupsOpen({
                ...presetGroupsOpen,
                default : (!presetGroupsOpen.default),
            })
        }
        else if (id == `react-select-${num}-group-1-heading`){
            setPresetGroupsOpen({
                ...presetGroupsOpen,
                zoom : (!presetGroupsOpen.zoom)
            })
        }
        else if (id == `react-select-${num}-group-2-heading`){
            setPresetGroupsOpen({
                ...presetGroupsOpen,
                sinCos : (!presetGroupsOpen.sinCos)
            })
        }
        else if (id == `react-select-${num}-group-3-heading`){
            setPresetGroupsOpen({
                ...presetGroupsOpen,
                average : (!presetGroupsOpen.average)
            })
        }
        else if (id == `react-select-${num}-group-4-heading`){
            setPresetGroupsOpen({
                ...presetGroupsOpen,
                spatial : (!presetGroupsOpen.spatial)
            })
        }
        else if (id == `react-select-${num}-group-5-heading`){
            setPresetGroupsOpen({
                ...presetGroupsOpen,
                random : (!presetGroupsOpen.random)
            })
        }
        else if (id == `react-select-${num}-group-6-heading`){
            setPresetGroupsOpen({
                ...presetGroupsOpen,
                mirror : (!presetGroupsOpen.mirror)
            })
        }
        else if (id == `react-select-${num}-group-7-heading`){
            setPresetGroupsOpen({
                ...presetGroupsOpen,
                sweep : (!presetGroupsOpen.sweep)
            })
        }
        else if (id == `react-select-${num}-group-8-heading`){
            setPresetGroupsOpen({
                ...presetGroupsOpen,
                experimental : (!presetGroupsOpen.experimental)
            })
        }
    };
    // Set the preset groups open. Runs when header is clicked.
    function setCollapsed(){
        // Map through all of the groups
        groupOptions.map(group=>{
            var groupType = group.type;
            var shouldOpen = presetGroupsOpen[groupType]
            var num = reactSelectNum.current;
            var id
            console.log("num = "+num)

            if(groupType == 'default') id =`react-select-${num}-group-0-heading`;
            if(groupType == 'zoom') id =`react-select-${num}-group-1-heading`;
            if(groupType == 'sinCos') id =`react-select-${num}-group-2-heading`;
            if(groupType == 'average') id =`react-select-${num}-group-3-heading`;
            if(groupType == 'spatial') id =`react-select-${num}-group-4-heading`;
            if(groupType == 'random') id =`react-select-${num}-group-5-heading`;
            if(groupType == 'mirror') id =`react-select-${num}-group-6-heading`;
            if(groupType == 'sweep') id =`react-select-${num}-group-7-heading`;
            if(groupType == 'experimental') id =`react-select-${num}-group-8-heading`;

            const node = document.querySelector(`#${id}`).parentElement
                .nextElementSibling;
            const classes = node.classList;
            if (!shouldOpen && !classes.contains("collapsed")) {
                console.log('Collapse')
                node.classList.add("collapsed");
            }else if(shouldOpen && classes.contains("collapsed")) {
                console.log('Open')
                node.classList.remove("collapsed");
            }else{
                console.log('Nothing')
            }
        })

    }

    // Handle Menu open close
    const openMenu = (e) => {
        setPresetOpen(!presetOpen);
        if(presetOpen) setCollapsed()
    }
    const onInputChange = (props, { action }) => {
        if (action === "menu-close") setPresetOpen(false);
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
    // Custom react-select componenets to handle custom group setting 
    const CustomGroupHeading = props => {
        return (
            <GroupHeadingWrapper
                className="group-heading-wrapper"
                onClick={() => handleHeaderClick(props.id)}
                ref={reactSelectHeadingRef}
            >
                <components.GroupHeading {...props} />
            </GroupHeadingWrapper>
        );
        };
    const CustomControl = props => {
        return (
            <div
                onClick={() => openMenu()}
            >
                <components.Control {...props} />
            </div>
        );
        };

    // Options
    var sortedOptionsDefault = getOptions('default');
    var sortedOptionsZoom = getOptions('zoom');
    var sortedOptionsSinCos = getOptions('sinCos');
    var sortedOptionsAverage = getOptions('average');
    var sortedOptionsSpatial = getOptions('spatial');
    var sortedOptionsRandom = getOptions('random');
    var sortedOptionsMirror = getOptions('mirror');
    var sortedOptionsSweep = getOptions('sweep');
    var sortedOptionsExperimental = getOptions('experimental');
    function getOptions(type){
        var presetArray = []

        // let newObj = Object.assign(...Object.keys(presets).map(k => {
        //     if(presets[k])
        //     ({[k]: obj[k] * obj[k]})
        // }) );
        presets.map(obj => {
            if (obj.type == type){
                presetArray.push(obj)
            }
        })
        // const objectMap = (obj, fn) =>
        //     Object.fromEntries(
        //         Object.entries(obj).map(
        //             ([k, v], i) => [k, fn(v, k, i)]
        //     )
        // )
        // objectMap(presets, preset => {
        //     if(preset.type == type){
        //         presetArray.push(preset)
        //     }
        // })
        return presetArray;
    }
    // Combine all options

    function getAllOptionsString(){
        var logString = '';
        groupOptions.map(gOption =>{
            logString += ("\n"+gOption.label+"\n")
            gOption.options.map(preset=>{
                logString+= (preset.label+"\n")
            })
        })
        return(logString)

    }
    var groupOptions = [
        {
            label: "Default",
            type: "default",
            options: sortedOptionsDefault,
        },   
        {
            label: "Zoom",
            type: "zoom",
            options: sortedOptionsZoom,
        },   
        {
            label: "Sin and Cos",
            type: "sinCos",
            options: sortedOptionsSinCos,
        },   
        {
            label: "Average",
            type: "average",
            options: sortedOptionsAverage,
        },   
        {
            label: "Spatial",
            type: "spatial",
            options: sortedOptionsSpatial,
        },   
        {
            label: "Random",
            type: "random",
            options: sortedOptionsRandom,
        },   
        {
            label: "Mirror",
            type: "mirror",
            options: sortedOptionsMirror,
        },   
        {
            label: "Sweep",
            type: "sweep",
            options: sortedOptionsSweep,
        },   
        {
            label: "Experimental",
            type: "experimental",
            options: sortedOptionsExperimental,
        },   
    ];


    return(
        <SelectionContainer>
            <Select
                styles={customStyles}
                value={selectedPreset}
                onChange={setSelectedPreset}
                options={groupOptions}
                components={{ GroupHeading: CustomGroupHeading, Control: CustomControl }}
                onInputChange={onInputChange}
                // menuIsOpen={true}
                menuIsOpen={presetOpen}
                isSearchable={false}
            />
        </SelectionContainer>
    )
}

// Theme
const SelectionContainer = styled.div`
    width: 100%;
    margin: 0px 5px 0px 5px;
`
const GroupHeadingWrapper = styled.div`
    margin: 0px;
    border: ${props => props.theme.background.light};
    border-style: solid hidden hidden hidden;
    border-width: 1px;
    width: auto;
    font-family: "${props => props.theme.ae.baseFontFamily}", "Segoe UI", "San Francisco", sans-serif;
    color: ${props => props.theme.text.bright};
    background: ${props => props.theme.ae.panelBackgroundColor}};
    padding: 3px 0px 3px 0px;
    :hover {
        background: ${props => props.theme.colors.blue};
    },

`

export default Selection