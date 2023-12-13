import { calculateScore } from './calculate-score';

const scored = 'scored';
const relevant = 'relevant';

const isScored = (node: Node) => node.textContent === scored;
const isRelevant = (node: Node) => !!node.textContent;

function createNode(children: Node[] = []) {
  const node = document.createElement('div');
  node.append(...children);
  return node;
}

function createNonRelevant() {
  return document.createElement('div');
}

function createRelevant() {
  const node = document.createElement('div');
  node.textContent = relevant;
  return node;
}

function createScored() {
  const node = document.createElement('div');
  node.textContent = scored;
  return node;
}

describe('calculateScore', () => {
  describe('one hierarchy level', () => {
    it('non-relevant', () => {
      const node = createNode();
      expect(calculateScore({ node, isScored, isRelevant })).toBe(0);
    });
    it('relevant', () => {
      const node = createRelevant();
      expect(calculateScore({ node, isScored, isRelevant })).toBe(0);
    });
    it('scored', () => {
      const node = createScored();
      expect(calculateScore({ node, isScored, isRelevant })).toBe(1);
    });
  });
  describe('two hierarchy levels', () => {
    it('non-relevant', () => {
      const node = createNode([createNonRelevant()]);
      expect(calculateScore({ node, isScored, isRelevant })).toBe(0);
    });
    it('relevant', () => {
      const node = createNode([createRelevant()]);
      expect(calculateScore({ node, isScored, isRelevant })).toBe(0);
    });
    it('scored', () => {
      const node = createNode([createScored()]);
      expect(calculateScore({ node, isScored, isRelevant })).toBe(1);
    });
    it('non-relevant and relevant', () => {
      const node = createNode([createNonRelevant(), createRelevant()]);
      expect(calculateScore({ node, isScored, isRelevant })).toBe(0);
    });
    it('non-relevant and scored', () => {
      const node = createNode([createNonRelevant(), createScored()]);
      expect(calculateScore({ node, isScored, isRelevant })).toBe(1);
    });
    it('relevant and scored', () => {
      const node = createNode([createRelevant(), createScored()]);
      expect(calculateScore({ node, isScored, isRelevant })).toBe(0.5);
    });
  });
});
