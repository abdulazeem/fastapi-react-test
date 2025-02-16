import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const CalculatorContainer = styled.div`
  max-width: 320px;
  margin: 2rem auto;
  padding: 20px;
  background: #2a2a2a;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
`;

const Display = styled.div`
  background: #1a1a1a;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  text-align: right;
  font-size: 2em;
  color: #fff;
  min-height: 60px;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const Button = styled.button`
  padding: 20px;
  font-size: 1.2em;
  border: none;
  border-radius: 5px;
  background: ${props => props.operator ? '#ff9500' : '#4a4a4a'};
  color: white;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.operator ? '#ffaa33' : '#5a5a5a'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [firstNumber, setFirstNumber] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondNumber, setWaitingForSecondNumber] = useState(false);

  const handleNumber = (num) => {
    if (waitingForSecondNumber) {
      setDisplay(num);
      setWaitingForSecondNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = async (operationType) => {
    const inputNumber = parseFloat(display);

    if (firstNumber === null) {
      setFirstNumber(inputNumber);
      setOperation(operationType);
      setWaitingForSecondNumber(true);
    } else {
      try {
        const response = await axios.get(`http://localhost:8000/calculate/${operation}`, {
          params: {
            num1: firstNumber,
            num2: inputNumber
          }
        });

        if (response.data.status === 'success') {
          setDisplay(response.data.result.toString());
          setFirstNumber(response.data.result);
          setOperation(operationType === 'equals' ? null : operationType);
          setWaitingForSecondNumber(operationType !== 'equals');
        } else {
          alert(response.data.error);
          clear();
        }
      } catch (error) {
        alert('Error performing calculation');
        clear();
      }
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstNumber(null);
    setOperation(null);
    setWaitingForSecondNumber(false);
  };

  return (
    <CalculatorContainer>
      <Display>{display}</Display>
      <ButtonGrid>
        <Button onClick={clear} style={{ gridColumn: 'span 2' }}>C</Button>
        <Button operator onClick={() => handleOperation('divide')}>÷</Button>
        <Button operator onClick={() => handleOperation('multiply')}>×</Button>

        {[7, 8, 9].map(num => (
          <Button key={num} onClick={() => handleNumber(num.toString())}>{num}</Button>
        ))}
        <Button operator onClick={() => handleOperation('subtract')}>-</Button>

        {[4, 5, 6].map(num => (
          <Button key={num} onClick={() => handleNumber(num.toString())}>{num}</Button>
        ))}
        <Button operator onClick={() => handleOperation('add')}>+</Button>

        {[1, 2, 3].map(num => (
          <Button key={num} onClick={() => handleNumber(num.toString())}>{num}</Button>
        ))}
        <Button operator onClick={() => handleOperation('equals')}>=</Button>

        <Button style={{ gridColumn: 'span 2' }} onClick={() => handleNumber('0')}>0</Button>
        <Button onClick={() => handleNumber('.')}>.</Button>
      </ButtonGrid>
    </CalculatorContainer>
  );
};

export default Calculator;