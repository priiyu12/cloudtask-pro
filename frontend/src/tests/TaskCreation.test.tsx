import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router';
import CreateTaskPage from '../app/pages/app/tasks/CreateTaskPage';

describe('CreateTaskPage', () => {
  it('renders create task form', () => {
    render(
      <BrowserRouter>
        <CreateTaskPage />
      </BrowserRouter>
    );
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });
});
