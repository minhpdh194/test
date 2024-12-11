import React from 'react';

const numberFormat = (value: number, decimals = 0, decPoint = '.', thousandsSep = ',') => {
    value = parseFloat(String(value));
    if (!isFinite(value)) return value;
    const n = Math.abs(value);
    const dec = n.toFixed(decimals);
    const [integer, decimal] = dec.split('.');
    const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return decimals ? formatted + (decimal ? decPoint + decimal : '') : formatted;
};

interface NumberFormatProps {
    value: number;
    decimals?: number;
    decPoint?: string;
    thousandsSep?: string;
}

const NumberFormat: React.FC<NumberFormatProps> = ({ value, decimals = 0, decPoint = '.', thousandsSep = ',' }) => {
    if (value == null || isNaN(value)) {
        return <span>N/A</span>; 
    }
    const formattedValue = numberFormat(value, decimals, decPoint, thousandsSep);

    return <span>{formattedValue}</span>;
};

export default NumberFormat;
