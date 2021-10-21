import React from 'react';
import { PropertiesContainer, PropertiesWrapper } from './Properties.elements';
import Gem from './options/gem/Gem';
import MetalColor from './options/metalColor/MetalColor';
import RingTexture from './options/ringTexture/RingTexture';

const Properties = ({ setCurrentGem, setCurrentRingColor, setCurrentRingTexture }) => {
    return (
        <PropertiesContainer>
            <PropertiesWrapper>
                <h1>Custom Rings</h1>
                <Gem setCurrentGem={setCurrentGem} />
                <MetalColor setCurrentRingColor={setCurrentRingColor} />
                <RingTexture setCurrentRingTexture={setCurrentRingTexture} />
            </PropertiesWrapper>
        </PropertiesContainer>
    )
}

export default Properties
