import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router';
import CreateProjectPage from '../app/pages/app/projects/CreateProjectPage';

describe('CreateProjectPage', () => {
  it('renders create project form', () => {
    render(
      <BrowserRouter>
        <CreateProjectPage />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
  });
});
