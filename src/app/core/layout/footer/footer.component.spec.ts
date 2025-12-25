import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('currentYear', () => {
    it('should return the current year', () => {
      const expectedYear = new Date().getFullYear();
      expect(component.currentYear()).toBe(expectedYear);
    });
  });

  describe('githubUrl', () => {
    it('should have the correct GitHub URL', () => {
      expect(component.githubUrl).toBe('https://github.com/MoodyJW/angular-enterprise-blueprint');
    });
  });

  describe('angularVersion', () => {
    it('should have Angular version 21', () => {
      expect(component.angularVersion).toBe('21');
    });
  });

  describe('template rendering', () => {
    it('should display the current year in copyright', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const copyright = compiled.querySelector('.footer__copyright');
      expect(copyright?.textContent).toContain(component.currentYear().toString());
    });

    it('should display the GitHub link', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const link = compiled.querySelector('.footer__link') as HTMLAnchorElement;
      expect(link).toBeTruthy();
      expect(link.href).toBe(component.githubUrl);
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
    });

    it('should display the Angular version badge', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const badge = compiled.querySelector('.footer__badge-text');
      expect(badge?.textContent).toContain('Angular v21');
    });
  });
});
