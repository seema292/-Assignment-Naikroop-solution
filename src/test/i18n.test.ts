import { describe, it, expect, beforeEach } from 'vitest';
import i18n from '../i18n';

describe('Internationalization (i18n)', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('should initialize with English by default', () => {
    expect(i18n.language).toBe('en');
    expect(i18n.t('brand.name')).toBe('FormCraft');
    expect(i18n.t('dashboard.createNew')).toBe('Create Form');
  });

  it('should switch to Hindi and return accurate localized translations', async () => {
    await i18n.changeLanguage('hi');
    expect(i18n.language).toBe('hi');
    expect(i18n.t('brand.name')).toBe('फ़ॉर्मक्राफ्ट');
    expect(i18n.t('dashboard.createNew')).toBe('नया फ़ॉर्म बनाएं');
  });

  it('should persist selected language across changes', async () => {
    await i18n.changeLanguage('hi');
    expect(window.localStorage.getItem('formcraft_language')).toBe('hi');

    await i18n.changeLanguage('en');
    expect(window.localStorage.getItem('formcraft_language')).toBe('en');
  });
});
