import React, { useState } from 'react';
import { GeneralContainer, Wrapper } from './Menu.elements';
import Properties from '../properties/Properties';
import Ring from '../ring/Ring';

const Menu = () => {
    const [ currentGem, setCurrentGem]  = useState({ name: '' });
    const [ currentRingColor, setCurrentRingColor ] = useState({ color: '' });
    const [ currentRingTexture, setCurrentRingTexture ] = useState({ 
        base: '',
        normal: '',
        roughness: '' 
    });

    return (
        <GeneralContainer>
            <Wrapper>
                <Properties
                    setCurrentGem={setCurrentGem}
                    setCurrentRingColor={setCurrentRingColor}
                    setCurrentRingTexture={setCurrentRingTexture}
                />
                <Ring
                    currentGem={currentGem}
                    currentRingColor={currentRingColor}
                    currentRingTexture={currentRingTexture}
                />
            </Wrapper>
        </GeneralContainer>
    )
}

export default Menu
