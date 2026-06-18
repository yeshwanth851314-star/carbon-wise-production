import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VideoBackground from '../VideoBackground';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('VideoBackground Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<VideoBackground />);
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video?.getAttribute('autoPlay')).not.toBeNull();
  });
});
