import React, { useState } from 'react';
import './UnitConverter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Add Font Awesome for icons
import { faArrowLeft, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons'; // Add specific icons

const UnitConverter = () => {
    const [value, setValue] = useState('');
    const [unitType, setUnitType] = useState('length');
    const [unit, setUnit] = useState('meters');
    const [convertedValue, setConvertedValue] = useState('');
    const [conversionText, setConversionText] = useState('');

    const handleChange = (e) => {
        const inputValue = e.target.value;
        setValue(inputValue);
        convertValue(inputValue);
    };

    const handleUnitChange = (e) => {
        setUnit(e.target.value);
        setValue('');
        setConvertedValue('');
    };

    const handleUnitTypeChange = (e) => {
        setUnitType(e.target.value);
        setUnit('meters'); // Reset to the default unit of the new type
        setValue('');
        setConvertedValue('');
        setConversionText('');
    };

    const convertValue = (inputValue) => {
        if (!inputValue) {
            setConvertedValue('');
            return; // Early return if input is empty
        }

        let result;
        let fromUnit = unit;
        let toUnit;

        if (unitType === 'length') {
            // Convert input value to meters first for uniformity
            const valueInMeters =
                fromUnit === 'meters' ? inputValue :
                fromUnit === 'kilometers' ? inputValue * 1000 :
                fromUnit === 'centimeters' ? inputValue / 100 :
                fromUnit === 'millimeters' ? inputValue / 1000 :
                fromUnit === 'feet' ? inputValue / 3.28084 : inputValue;

            // Now convert from meters to the target unit
            if (toUnit === 'feet') {
                result = (valueInMeters * 3.28084).toFixed(2);
                toUnit = 'feet';
            } else if (toUnit === 'kilometers') {
                result = (valueInMeters / 1000).toFixed(2);
                toUnit = 'kilometers';
            } else if (toUnit === 'centimeters') {
                result = (valueInMeters * 100).toFixed(2);
                toUnit = 'centimeters';
            } else if (toUnit === 'millimeters') {
                result = (valueInMeters * 1000).toFixed(2);
                toUnit = 'millimeters';
            } else {
                result = valueInMeters.toFixed(2);
                toUnit = 'meters';
            }

            setConversionText(`Converting ${inputValue} ${fromUnit} to ${toUnit}`);
        } else if (unitType === 'mass') {
            result = fromUnit === 'kilograms' ? (inputValue * 2.20462).toFixed(2) : (inputValue / 2.20462).toFixed(2);
            toUnit = fromUnit === 'kilograms' ? 'pounds' : 'kilograms';
            setConversionText(`Converting ${inputValue} ${fromUnit} to ${toUnit}`);
        } else if (unitType === 'temperature') {
            result = fromUnit === 'celsius' ? ((inputValue * 9 / 5) + 32).toFixed(2) : ((inputValue - 32) * 5 / 9).toFixed(2);
            toUnit = fromUnit === 'celsius' ? 'Fahrenheit' : 'Celsius';
            setConversionText(`Converting ${inputValue} ${fromUnit} to ${toUnit}`);
        } else if (unitType === 'volume') {
            result = fromUnit === 'liters' ? (inputValue * 0.264172).toFixed(2) : (inputValue / 0.264172).toFixed(2);
            toUnit = fromUnit === 'liters' ? 'gallons' : 'liters';
            setConversionText(`Converting ${inputValue} ${fromUnit} to ${toUnit}`);
        } else if (unitType === 'sound') {
            result = fromUnit === 'decibels' ? (inputValue / 10).toFixed(2) : (inputValue * 10).toFixed(2);
            toUnit = fromUnit === 'decibels' ? 'bels' : 'decibels';
            setConversionText(`Converting ${inputValue} ${fromUnit} to ${toUnit}`);
        } else if (unitType === 'electricity') {
            result = fromUnit === 'volts' ? (inputValue * 1000).toFixed(2) : (inputValue / 1000).toFixed(2);
            toUnit = fromUnit === 'volts' ? 'millivolts' : 'volts';
            setConversionText(`Converting ${inputValue} ${fromUnit} to ${toUnit}`);
        }

        setConvertedValue(result);
    };

    const clearInput = () => {
        setValue('');
        setConvertedValue('');
        setConversionText('');
    };

    return (
        <div className="unit-converter__toolkit__unitConverter animation__fadeIn">
        <div className="header__toolkit__unitConverter">
            <button className="back-button__toolkit__unitConverter" onClick={() => window.history.back()}>
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </button>
            <h1>Unit Converter</h1>
            <button className="clear-button__toolkit__unitConverter" onClick={clearInput}>
                <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
        </div>
        
        <div className="select__toolkit__unitConverter">
            <select onChange={handleUnitTypeChange}>
                <option value="length">Length</option>
                <option value="mass">Mass</option>
                <option value="temperature">Temperature</option>
                <option value="volume">Volume</option>
                <option value="sound">Sound</option>
                <option value="electricity">Electricity</option>
            </select>
        </div>
        
        <div className="select__toolkit__unitConverter">
            <select onChange={handleUnitChange}>
                {unitType === 'length' && (
                    <>
                        <option value="meters">Meters</option>
                        <option value="kilometers">Kilometers</option>
                        <option value="centimeters">Centimeters</option>
                        <option value="millimeters">Millimeters</option>
                        <option value="feet">Feet</option>
                    </>
                )}
                {unitType === 'mass' && (
                    <>
                        <option value="kilograms">Kilograms</option>
                        <option value="pounds">Pounds</option>
                    </>
                )}
                {unitType === 'temperature' && (
                    <>
                        <option value="celsius">Celsius</option>
                        <option value="fahrenheit">Fahrenheit</option>
                    </>
                )}
                {unitType === 'volume' && (
                    <>
                        <option value="liters">Liters</option>
                        <option value="gallons">Gallons</option>
                    </>
                )}
                {unitType === 'sound' && (
                    <>
                        <option value="decibels">Decibels</option>
                        <option value="bels">Bels</option>
                    </>
                )}
                {unitType === 'electricity' && (
                    <>
                        <option value="volts">Volts</option>
                        <option value="millivolts">Millivolts</option>
                    </>
                )}
            </select>
        </div>
        
        <div className="input__toolkit__unitConverter">
            <input
                type="number"
                value={value}
                onChange={handleChange}
                placeholder={`Enter ${unit}`}
            />
        </div>
        
        <div className="divider__toolkit__unitConverter"></div>
        
        {conversionText && <p>{conversionText}</p>}
        
        <div className="result__toolkit__unitConverter">
            {convertedValue && (
                <p>{convertedValue} {unit === 'meters' ? 'meters' : unit === 'kilograms' ? 'kilograms' : unit}</p>
            )}
        </div>
    </div>
    
    );
};

export default UnitConverter;
