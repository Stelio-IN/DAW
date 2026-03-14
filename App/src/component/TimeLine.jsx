import React, { useState } from 'react';
import '../assets/style/timeline.css'; // Assumindo que você tenha um arquivo de CSS separado

const Timeline = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1 = Shipping, 2 = Payment, 3 = Review

  const steps = ['Shipping', 'Payment', 'Review'];

  return (
    <div className="timeline-container">
      <ul className="timeline">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`timeline-step ${index + 1 <= currentStep ? 'active' : ''}`}
            onClick={() => setCurrentStep(index + 1)} // Opção de avançar ou retroceder (opcional)
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-label">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
