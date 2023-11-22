import { isRTLText } from './is-rtl-text';

describe('isRTLText', () => {
  it('should return true for Arabic text', () => {
    const text = 'مرحبا بالعالم';
    expect(isRTLText(text)).toBe(true);
  });

  it('should return true for English and Arabic text', () => {
    const text = 'Hello world مرحبا بالعالم';
    expect(isRTLText(text)).toBe(true);
  });

  it('should return true for Hebrew text', () => {
    const text = 'שלום עולם';
    expect(isRTLText(text)).toBe(true);
  });

  it('should return true for English and Hebrew text', () => {
    const text = 'Hello world שלום עולם';
    expect(isRTLText(text)).toBe(true);
  });

  it('should return false for English text', () => {
    const text = 'Hello world';
    expect(isRTLText(text)).toBe(false);
  });

  it('should return false for empty string', () => {
    const text = '';
    expect(isRTLText(text)).toBe(false);
  });
});
