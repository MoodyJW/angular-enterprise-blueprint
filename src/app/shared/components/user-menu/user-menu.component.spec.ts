import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { heroArrowRightOnRectangle, heroUserCircle } from '@ng-icons/heroicons/outline';
import { vi } from 'vitest';

import { User } from '@core/auth';
import { UserMenuComponent } from './user-menu.component';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    roles: ['user'],
  } as User;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenuComponent, OverlayModule, A11yModule],
      providers: [provideIcons({ heroUserCircle, heroArrowRightOnRectangle })],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', mockUser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user name and email in menu', () => {
    component.toggleMenu();
    fixture.detectChanges();

    const nameEl = document.querySelector('.user-menu__name');
    const emailEl = document.querySelector('.user-menu__email');

    expect(nameEl?.textContent).toContain(mockUser.username);
    expect(emailEl?.textContent).toContain(mockUser.email);
  });

  it('should emit logout event when logout button clicked', () => {
    const logoutSpy = vi.spyOn(component.logout, 'emit');

    component.toggleMenu();
    fixture.detectChanges();

    const logoutBtn = document.querySelector('.user-menu__logout button') as HTMLButtonElement;
    logoutBtn.click();

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should close menu when logout clicked', () => {
    component.toggleMenu();
    fixture.detectChanges();
    expect(component.isOpen()).toBe(true);

    const logoutBtn = document.querySelector('.user-menu__logout button') as HTMLButtonElement;
    logoutBtn.click();
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
  });
});
