import React, { useState } from 'react';

type ColorPickerPropsType = {
    onChange?:(v:string)=>void;
    value?:string;
}

const ColorPicker = ({value = "#bba399", onChange }:ColorPickerPropsType) => {
  const [selectedColor, setSelectedColor] = useState(value);
  const [customColor, setCustomColor] = useState('');

  const colors = [
    '#bba399',
    '#c580e6',
    '#f17ead',
    '#e78845',
    '#f9be34',
    '#64c6a2',
    '#3fb1b2',
    '#40a6e5',
    '#6a85ff',
    '#8077f1',
  ];

  const handleColorChange = (color:string) => {
    setSelectedColor(color);
    if(onChange){
        onChange(color)
    }
  };

  const handleCustomColorChange = (event) => {
    const color = event.target.value;
    setCustomColor(color);
    setSelectedColor(color);
  };

  return (
    <div className="board-color-picker flex flex-row gap-3 py-2">
      {colors.map((color) => (
        <label key={color}>
          <input
            className="hidden peer"
            type="radio"
            name="COLOR"
            value={color}
            checked={selectedColor === color}
            onChange={() => handleColorChange(color)}
          />
          <div
            className={`bg-current color_representation cursor-pointer h-4 w-4 rounded-full outline-current peer-checked:outline peer-checked:outline-offset-1`}
            style={{ backgroundColor: color, color }}
          ></div>
        </label>
      ))}

      {/* Custom Color Picker */}
      {/* <label>
        <input
          className="hidden peer"
          type="radio"
          name="COLOR"
          value={customColor}
          checked={customColor && selectedColor === customColor}
          onChange={() => handleColorChange(customColor)}
        />
        <div className="relative">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="cursor-pointer h-8 w-8 rounded-full border border-gray-300 p-0"
          />
        </div>
      </label> */}
    </div>
  );
};

export default ColorPicker;