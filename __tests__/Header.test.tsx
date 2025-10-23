import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header', () => {
  it('renders the site title and register link', () => {
    render(<Header />);
    expect(screen.getByText('MDS Mailer')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});
