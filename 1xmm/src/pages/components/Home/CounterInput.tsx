import React from "react";

interface CounterInputProps {
  value: number;
  onChange: (value: number) => void;
  isLeverage?: boolean; // Add a flag to distinguish between leverage and amount
}

const allowedLeverages = [0, 1, 2, 3, 5, 7, 10]; // Define allowed leverage values

const CounterInput: React.FC<CounterInputProps> = ({
  value,
  onChange,
  isLeverage = false,
}) => {
  const handleIncrement = () => {
    if (isLeverage) {
      const currentIndex = allowedLeverages.indexOf(value); // Find the current index of value
      if (currentIndex !== -1 && currentIndex < allowedLeverages.length - 1) {
        // Move to the next allowed value for leverage
        onChange(allowedLeverages[currentIndex + 1]);
      }
    } else {
      // Increase the amount by 250
      console.log(value);
      onChange(value + 250);
    }
  };

  const handleDecrement = () => {
    if (isLeverage) {
      const currentIndex = allowedLeverages.indexOf(value); 
      if (currentIndex > 0) {
        onChange(allowedLeverages[currentIndex - 1]);
      }
    } else {
      if (value > 0 && value - 250 >= 0) {
        onChange(value - 250);
      }
    }
  };
  

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(isNaN(newValue) ? 0 : newValue);
  };

  return (
    <div className="flex items-center mt-1">
      <button
        onClick={handleDecrement}
        className="px-2 w-6 h-6 text-white rounded"
        style={{
          background: `linear-gradient(180deg, #35389E 0%, #1C2848 98%)`,
        }}
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        className="w-24 h-6 text-center bg-[#000] rounded mx-1 border-black text-sm"
        min={0}
      />
      <button
        onClick={handleIncrement}
        className="px-2 w-6 h-6 text-white rounded"
        style={{
          background: `linear-gradient(180deg, #35389E 0%, #1C2848 98%)`,
        }}
      >
        +
      </button>
    </div>
  );
};

export default CounterInput;
