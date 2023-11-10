import {
  filterHTMLElements,
  isHTMLElement,
  isHTMLInputElement,
  isHTMLTextAreaElement,
  queryHTMLElements,
  toggleClass,
} from './dom';

describe('isHTMLElement', () => {
  it('should return true for an HTMLElement', () => {
    const element = document.createElement('div');
    expect(isHTMLElement(element)).toBe(true);
  });

  it('should return false for a non-HTMLElement', () => {
    const node = document.createTextNode('text');
    expect(isHTMLElement(node)).toBe(false);
  });
});

describe('isHTMLInputElement', () => {
  it('should return true for an HTMLInputElement', () => {
    const element = document.createElement('input');
    expect(isHTMLInputElement(element)).toBe(true);
  });

  it('should return false for a non-HTMLInputElement', () => {
    const element = document.createElement('div');
    expect(isHTMLInputElement(element)).toBe(false);
  });
});

describe('isHTMLTextAreaElement', () => {
  it('should return true for an HTMLTextAreaElement', () => {
    const element = document.createElement('textarea');
    expect(isHTMLTextAreaElement(element)).toBe(true);
  });

  it('should return false for a non-HTMLTextAreaElement', () => {
    const element = document.createElement('div');
    expect(isHTMLTextAreaElement(element)).toBe(false);
  });
});

describe('toggleClass', () => {
  it('should add the class when enabled is true', () => {
    const element = document.createElement('div');
    toggleClass({ element, className: 'test', enabled: true });
    expect(element.classList.contains('test')).toBe(true);
  });

  it('should remove the class when enabled is false', () => {
    const element = document.createElement('div');
    element.classList.add('test');
    toggleClass({ element, className: 'test', enabled: false });
    expect(element.classList.contains('test')).toBe(false);
  });
});

describe('filterHTMLElements', () => {
  it('should filter out non-HTMLElement nodes', () => {
    const htmlList = [
      document.createElement('div'),
      document.createElement('span'),
      document.createElement('p'),
    ];

    const additionalNodes = [
      document.createTextNode('Text Node'),
      document.createComment('Comment Node'),
    ];

    const nodeList = [...htmlList, ...additionalNodes] as unknown as NodeList;

    const result = filterHTMLElements(nodeList);

    expect(result).toStrictEqual(htmlList);
  });
});

describe('queryHTMLElements', () => {
  it('should return an array of matching HTMLElements', () => {
    const foo = 'foo';
    const container = document.createElement('div');

    const divElement = document.createElement('div');
    divElement.classList.add(foo);
    container.appendChild(divElement);

    const spanElement = document.createElement('span');
    spanElement.classList.add(foo);
    container.appendChild(spanElement);

    const pElement = document.createElement('p');
    pElement.classList.add('bar');

    container.append(divElement, spanElement, pElement);

    const results = queryHTMLElements({
      element: container,
      selector: `.${foo}`,
    });

    expect(results).toStrictEqual([divElement, spanElement]);
  });

  it('should filter out non-HTMLElement nodes', () => {
    const container = document.createElement('div');

    const htmlList = [
      document.createElement('div'),
      document.createElement('span'),
      document.createElement('p'),
    ];

    const additionalNodes = [
      document.createTextNode('Text Node'),
      document.createComment('Comment Node'),
    ];

    container.append(...htmlList, ...additionalNodes);

    const results = queryHTMLElements({
      element: container,
      selector: '*',
    });

    expect(results).toStrictEqual(htmlList);
  });
});
