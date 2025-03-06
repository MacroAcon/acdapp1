import React from 'react';
import { screen } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './test-utils';

test('renders app without crashing', () => {
  renderWithProviders(<App />);
  expect(screen.getByRole('main')).toBeInTheDocument();
});
