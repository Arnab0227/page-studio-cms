import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/builder/Button';
import { Card } from '@/components/builder/Card';
import { Text } from '@/components/builder/Text';
import { Section } from '@/components/builder/Section';
import { Hero } from '@/components/builder/Hero';
import { Grid } from '@/components/builder/Grid';
import { Container } from '@/components/builder/Container';

describe('Builder Components', () => {
  describe('Button Component', () => {
    it('should render with label', () => {
      render(<Button label="Click me" />);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render with different variants', () => {
      const { container: primaryContainer } = render(
        <Button label="Primary" variant="primary" />
      );
      expect(primaryContainer.querySelector('.bg-blue-600')).toBeInTheDocument();

      const { container: outlineContainer } = render(
        <Button label="Outline" variant="outline" />
      );
      expect(outlineContainer.querySelector('.border-2')).toBeInTheDocument();
    });

    it('should render as link when href is provided', () => {
      render(<Button label="Link Button" href="https://example.com" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should render as button when no href provided', () => {
      render(<Button label="Click Button" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should handle different sizes', () => {
      const { container: smContainer } = render(
        <Button label="Small" size="sm" />
      );
      expect(smContainer.querySelector('.px-3')).toBeInTheDocument();

      const { container: lgContainer } = render(
        <Button label="Large" size="lg" />
      );
      expect(lgContainer.querySelector('.px-6')).toBeInTheDocument();
    });
  });

  describe('Card Component', () => {
    it('should render with title', () => {
      render(<Card title="Card Title" />);
      expect(screen.getByText('Card Title')).toBeInTheDocument();
    });

    it('should render with title and description', () => {
      render(
        <Card
          title="Card Title"
          description="Card description text"
        />
      );
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card description text')).toBeInTheDocument();
    });

    it('should render image when provided', () => {
      render(
        <Card
          title="Card"
          image={{
            src: 'https://example.com/image.jpg',
            alt: 'Test image',
          }}
        />
      );
      const img = screen.getByAltText('Test image');
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should render footer when provided', () => {
      render(
        <Card
          title="Card"
          footer="Footer text"
        />
      );
      expect(screen.getByText('Footer text')).toBeInTheDocument();
    });

    it('should render as article element', () => {
      const { container } = render(<Card title="Card" />);
      expect(container.querySelector('article')).toBeInTheDocument();
    });
  });

  describe('Text Component', () => {
    it('should render with content', () => {
      render(
        <Text
          content="Test content"
          variant="p"
        />
      );
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should render different heading variants', () => {
      const { container: h1Container } = render(
        <Text content="Heading 1" variant="h1" />
      );
      expect(h1Container.querySelector('h1')).toBeInTheDocument();

      const { container: h2Container } = render(
        <Text content="Heading 2" variant="h2" />
      );
      expect(h2Container.querySelector('h2')).toBeInTheDocument();
    });

    it('should apply text alignment styles', () => {
      const { container } = render(
        <Text
          content="Centered text"
          variant="p"
          textAlign="center"
        />
      );
      expect(container.querySelector('.text-center')).toBeInTheDocument();
    });

    it('should apply color variants', () => {
      const { container } = render(
        <Text
          content="Colored text"
          variant="p"
          color="primary"
        />
      );
      expect(container.querySelector('.text-blue-600')).toBeInTheDocument();
    });
  });

  describe('Section Component', () => {
    it('should render with children', () => {
      render(
        <Section layout="single">
          <div>Child content</div>
        </Section>
      );
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(
        <Section layout="single" title="Section Title">
          <div>Content</div>
        </Section>
      );
      expect(screen.getByText('Section Title')).toBeInTheDocument();
    });

    it('should render different layouts', () => {
      const { container: singleCol } = render(
        <Section layout="single">
          <div>Content</div>
        </Section>
      );
      expect(singleCol.querySelector('.flex')).toBeInTheDocument();

      const { container: twoCol } = render(
        <Section layout="two-column">
          <div>Content</div>
        </Section>
      );
      expect(twoCol.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
    });

    it('should render as section element', () => {
      const { container } = render(<Section layout="single"><div>Content</div></Section>);
      expect(container.querySelector('section')).toBeInTheDocument();
    });
  });

  describe('Hero Component', () => {
    it('should render headline', () => {
      render(
        <Hero headline="Welcome to Page Studio" />
      );
      expect(screen.getByText('Welcome to Page Studio')).toBeInTheDocument();
    });

    it('should render headline and description', () => {
      render(
        <Hero
          headline="Welcome"
          description="Hero description text"
        />
      );
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('Hero description text')).toBeInTheDocument();
    });

    it('should render CTA button when provided', () => {
      render(
        <Hero
          headline="Welcome"
          cta={{
            label: 'Get Started',
            href: 'https://example.com',
          }}
        />
      );
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('should apply height classes', () => {
      const { container: smallContainer } = render(
        <Hero headline="Small Hero" height="sm" />
      );
      expect(smallContainer.querySelector('.min-h-\\[300px\\]')).toBeInTheDocument();

      const { container: fullContainer } = render(
        <Hero headline="Full Hero" height="full" />
      );
      expect(fullContainer.querySelector('.min-h-screen')).toBeInTheDocument();
    });
  });

  describe('Grid Component', () => {
    it('should render children in grid', () => {
      render(
        <Grid columns={3} gap={16}>
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
        </Grid>
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('should apply responsive column classes', () => {
      const { container } = render(
        <Grid columns={2} gap={16}>
          <div>Item</div>
        </Grid>
      );
      expect(container.querySelector('.grid')).toHaveClass('md:grid-cols-2');
    });

    it('should apply gap styles', () => {
      const { container: smallGap } = render(
        <Grid columns={2} gap="sm">
          <div>Item</div>
        </Grid>
      );
      expect(smallGap.querySelector('.grid')).toHaveClass('gap-3');

      const { container: largeGap } = render(
        <Grid columns={2} gap="lg">
          <div>Item</div>
        </Grid>
      );
      expect(largeGap.querySelector('.grid')).toHaveClass('gap-6');
    });
  });

  describe('Container Component', () => {
    it('should render children', () => {
      render(
        <Container>
          <div>Container content</div>
        </Container>
      );
      expect(screen.getByText('Container content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Container className="custom-class">
          <div>Content</div>
        </Container>
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should render as div element', () => {
      const { container } = render(
        <Container>
          <div>Content</div>
        </Container>
      );
      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('Button should have aria-label or accessible name', () => {
      render(<Button label="Accessible Button" />);
      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName('Accessible Button');
    });

    it('Card should render as article for semantic HTML', () => {
      const { container } = render(<Card title="Card" />);
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('Text heading should render correct semantic element', () => {
      const { container: h1 } = render(
        <Text content="Title" variant="h1" />
      );
      expect(h1.querySelector('h1')).toBeInTheDocument();
    });

    it('Image alt text should be present', () => {
      render(
        <Card
          title="Card"
          image={{
            src: 'https://example.com/image.jpg',
            alt: 'Descriptive alt text',
          }}
        />
      );
      expect(screen.getByAltText('Descriptive alt text')).toBeInTheDocument();
    });
  });
});
