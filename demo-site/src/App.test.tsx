import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders header', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/TSV Parser/i);
    expect(linkElement).toBeInTheDocument();
});
