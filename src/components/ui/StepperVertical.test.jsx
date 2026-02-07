import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import StepperVertical from './StepperVertical.jsx';

describe('StepperVertical', () => {
  it('renders steps and marks current step with aria-current', () => {
    render(<StepperVertical items={['One', 'Two', 'Three']} current={1} />);

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();

    const activeBadge = screen.getByText('2');
    expect(activeBadge).toHaveAttribute('aria-current', 'step');
  });
});
