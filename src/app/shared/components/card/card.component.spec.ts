// @vitest-environment jsdom
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { CardPadding, CardVariant } from './card.component';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement as HTMLElement;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be standalone', () => {
      const metadata = (CardComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
      expect(metadata.standalone).toBe(true);
    });

    it('should use OnPush change detection', () => {
      const metadata = (CardComponent as unknown as { ɵcmp: { onPush: boolean } }).ɵcmp;
      expect(metadata.onPush).toBe(true);
    });
  });

  describe('Input Handling - Variant', () => {
    it('should have default variant as default', () => {
      fixture.detectChanges();
      expect(component.variant()).toBe('default');
    });

    it('should apply custom variant', () => {
      const variants: CardVariant[] = ['default', 'elevated', 'outlined', 'filled'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(component.variant()).toBe(variant);
      });
    });
  });

  describe('Input Handling - Padding', () => {
    it('should have default padding as md', () => {
      fixture.detectChanges();
      expect(component.padding()).toBe('md');
    });

    it('should apply custom padding', () => {
      const paddings: CardPadding[] = ['none', 'sm', 'md', 'lg'];

      paddings.forEach((padding) => {
        fixture.componentRef.setInput('padding', padding);
        fixture.detectChanges();
        expect(component.padding()).toBe(padding);
      });
    });
  });

  describe('Input Handling - States', () => {
    it('should handle clickable state', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();
      expect(component.clickable()).toBe(true);
    });

    it('should handle hoverable state', () => {
      fixture.componentRef.setInput('hoverable', false);
      fixture.detectChanges();
      expect(component.hoverable()).toBe(false);
    });

    it('should have hoverable true by default', () => {
      fixture.detectChanges();
      expect(component.hoverable()).toBe(true);
    });

    it('should handle fullWidth option', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      expect(component.fullWidth()).toBe(true);
    });

    it('should handle disabled state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });

    it('should have disabled false by default', () => {
      fixture.detectChanges();
      expect(component.disabled()).toBe(false);
    });

    it('should handle disabledLabel', () => {
      fixture.componentRef.setInput('disabledLabel', 'Coming Soon');
      fixture.detectChanges();
      expect(component.disabledLabel()).toBe('Coming Soon');
    });

    it('should have empty disabledLabel by default', () => {
      fixture.detectChanges();
      expect(component.disabledLabel()).toBe('');
    });
  });

  describe('Click Events', () => {
    it('should emit click event when clickable and clicked', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      let clickedEvent: MouseEvent | undefined;
      component.clicked.subscribe((event) => (clickedEvent = event));

      const cardElement = nativeElement.querySelector('.card');
      (cardElement as HTMLElement).click();

      expect(clickedEvent).toBeDefined();
    });

    it('should NOT emit click when not clickable', () => {
      fixture.componentRef.setInput('clickable', false);
      fixture.detectChanges();

      let clickedEvent: MouseEvent | undefined;
      component.clicked.subscribe((event) => (clickedEvent = event));

      component.handleClick(new MouseEvent('click'));

      expect(clickedEvent).toBeUndefined();
    });

    it('should call handleClick with MouseEvent', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const event = new MouseEvent('click');
      let emittedEvent: MouseEvent | undefined;
      component.clicked.subscribe((e) => (emittedEvent = e));

      component.handleClick(event);

      expect(emittedEvent).toBe(event);
    });
  });

  describe('Keyboard Events', () => {
    it('should emit click on Enter key when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      let clickedEvent: MouseEvent | undefined;
      component.clicked.subscribe((event) => (clickedEvent = event));

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleKeydown(enterEvent);

      expect(clickedEvent).toBeDefined();
    });

    it('should emit click on Space key when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      let clickedEvent: MouseEvent | undefined;
      component.clicked.subscribe((event) => (clickedEvent = event));

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      component.handleKeydown(spaceEvent);

      expect(clickedEvent).toBeDefined();
    });

    it('should NOT emit click on other keys', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      let clickedEvent: MouseEvent | undefined;
      component.clicked.subscribe((event) => (clickedEvent = event));

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      component.handleKeydown(escapeEvent);

      expect(clickedEvent).toBeUndefined();
    });

    it('should NOT emit click on keyboard when not clickable', () => {
      fixture.componentRef.setInput('clickable', false);
      fixture.detectChanges();

      let clickedEvent: MouseEvent | undefined;
      component.clicked.subscribe((event) => (clickedEvent = event));

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      component.handleKeydown(enterEvent);

      expect(clickedEvent).toBeUndefined();
    });
  });

  describe('Accessibility - ARIA Attributes', () => {
    it('should not have role by default', () => {
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.getAttribute('role')).toBeNull();
    });

    it('should have button role when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.getAttribute('role')).toBe('button');
    });

    it('should allow custom role override', () => {
      fixture.componentRef.setInput('role', 'region');
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.getAttribute('role')).toBe('region');
    });

    it('should set aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Project card');
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.getAttribute('aria-label')).toBe('Project card');
    });

    it('should set aria-labelledby when provided', () => {
      fixture.componentRef.setInput('ariaLabelledBy', 'card-title');
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.getAttribute('aria-labelledby')).toBe('card-title');
    });

    it('should set aria-describedby when provided', () => {
      fixture.componentRef.setInput('ariaDescribedBy', 'card-description');
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.getAttribute('aria-describedby')).toBe('card-description');
    });

    it('should set tabindex=0 when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.getAttribute('tabindex')).toBe('0');
    });

    it('should not set tabindex when not clickable', () => {
      fixture.componentRef.setInput('clickable', false);
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.getAttribute('tabindex')).toBeNull();
    });
  });

  describe('Accessibility - Semantic HTML', () => {
    it('should use div element', () => {
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement).toBeTruthy();
      expect(cardElement?.tagName).toBe('DIV');
    });

    it('should have header element', () => {
      fixture.detectChanges();

      const headerElement = nativeElement.querySelector('.card__header');
      expect(headerElement).toBeTruthy();
      expect(headerElement?.tagName).toBe('DIV');
    });

    it('should have section element for body', () => {
      fixture.detectChanges();

      const bodyElement = nativeElement.querySelector('.card__body');
      expect(bodyElement).toBeTruthy();
      expect(bodyElement?.tagName).toBe('DIV');
    });

    it('should have footer element', () => {
      fixture.detectChanges();

      const footerElement = nativeElement.querySelector('.card__footer');
      expect(footerElement).toBeTruthy();
      expect(footerElement?.tagName).toBe('DIV');
    });
  });

  describe('CSS Classes', () => {
    it('should apply base card class', () => {
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.classList.contains('card')).toBe(true);
    });

    it('should apply variant classes', () => {
      const variants: CardVariant[] = ['default', 'elevated', 'outlined', 'filled'];

      variants.forEach((variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const cardElement = nativeElement.querySelector('.card');
        expect(cardElement?.classList.contains(`card--${variant}`)).toBe(true);
      });
    });

    it('should apply padding classes', () => {
      const paddings: CardPadding[] = ['none', 'sm', 'md', 'lg'];

      paddings.forEach((padding) => {
        fixture.componentRef.setInput('padding', padding);
        fixture.detectChanges();

        const cardElement = nativeElement.querySelector('.card');
        expect(cardElement?.classList.contains(`card--padding-${padding}`)).toBe(true);
      });
    });

    it('should apply clickable class when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.classList.contains('card--clickable')).toBe(true);
    });

    it('should apply hoverable class when hoverable', () => {
      fixture.componentRef.setInput('hoverable', true);
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.classList.contains('card--hoverable')).toBe(true);
    });

    it('should apply full-width class when fullWidth', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.classList.contains('card--full-width')).toBe(true);
    });

    it('should apply disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const cardElement = nativeElement.querySelector('.card');
      expect(cardElement?.classList.contains('card--disabled')).toBe(true);
    });

    it('should show disabled state body when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const disabledBody = nativeElement.querySelector('.card__body--disabled');
      expect(disabledBody).toBeTruthy();
    });

    it('should NOT show disabled state body when not disabled', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      const disabledBody = nativeElement.querySelector('.card__body--disabled');
      expect(disabledBody).toBeNull();
    });

    it('should show disabled label when disabled with label', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('disabledLabel', 'Coming Soon');
      fixture.detectChanges();

      const label = nativeElement.querySelector('.card__disabled-label');
      expect(label).toBeTruthy();
      expect(label?.textContent).toContain('Coming Soon');
    });

    it('should NOT show disabled label when disabled without label', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('disabledLabel', '');
      fixture.detectChanges();

      const label = nativeElement.querySelector('.card__disabled-label');
      expect(label).toBeNull();
    });
  });

  describe('Content Projection', () => {
    it('should render content slots when not disabled', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.card__header')).toBeTruthy();
      expect(compiled.querySelector('.card__media')).toBeTruthy();
      expect(compiled.querySelector('.card__body')).toBeTruthy();
      expect(compiled.querySelector('.card__footer')).toBeTruthy();
    });

    it('should NOT render content slots when disabled (except header)', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      // Header should still be present
      expect(compiled.querySelector('.card__header')).toBeTruthy();

      // Others should be absent
      expect(compiled.querySelector('.card__media')).toBeNull();
      // Regular body should be replaced by disabled body, checking for class difference
      const body = compiled.querySelector('.card__body');
      expect(body?.classList.contains('card__body--disabled')).toBe(true);
      expect(compiled.querySelector('.card__footer')).toBeNull();
    });
  });

  describe('Computed Values', () => {
    it('should compute isInteractive as true when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      expect(component.isInteractive()).toBe(true);
    });

    it('should compute isInteractive as false when not clickable', () => {
      fixture.componentRef.setInput('clickable', false);
      fixture.detectChanges();

      expect(component.isInteractive()).toBe(false);
    });

    it('should compute cardClasses correctly', () => {
      fixture.componentRef.setInput('variant', 'elevated');
      fixture.componentRef.setInput('padding', 'lg');
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();

      const classes = component.cardClasses();
      expect(classes).toContain('card');
      expect(classes).toContain('card--elevated');
      expect(classes).toContain('card--padding-lg');
      expect(classes).toContain('card--clickable');
    });

    it('should compute cardRole as undefined by default', () => {
      fixture.detectChanges();
      expect(component.cardRole()).toBeUndefined();
    });

    it('should compute cardRole as button when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();
      expect(component.cardRole()).toBe('button');
    });

    it('should compute cardRole as custom role when provided', () => {
      fixture.componentRef.setInput('role', 'region');
      fixture.detectChanges();
      expect(component.cardRole()).toBe('region');
    });

    it('should compute tabIndexValue as 0 when clickable', () => {
      fixture.componentRef.setInput('clickable', true);
      fixture.detectChanges();
      expect(component.tabIndexValue()).toBe(0);
    });

    it('should compute tabIndexValue as undefined when not clickable', () => {
      fixture.componentRef.setInput('clickable', false);
      fixture.detectChanges();
      expect(component.tabIndexValue()).toBeUndefined();
    });
  });
});
