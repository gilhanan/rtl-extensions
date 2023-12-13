import { calculateScore } from './calculate-score';

jest.mock('./dom', () => ({
  isPresented: jest.fn().mockReturnValue(true),
}));

const scored = 'scored';

const isScored = ({ textContent }: Node) => textContent === scored;
const isRelevant = ({ nodeType, textContent }: Node) =>
  nodeType === Node.TEXT_NODE && !!textContent;

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
  node.append('relevant');
  return node;
}

function createScored() {
  const node = document.createElement('div');
  node.append(scored);
  return node;
}

describe('calculateScore', () => {
  describe('one hierarchy level', () => {
    it('non-relevant', () => {
      const node = createNode();
      expect(calculateScore({ node, isScored, isRelevant })).toBe(-1);
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
    describe('one leaf', () => {
      it('non-relevant', () => {
        const node = createNode([createNonRelevant()]);
        expect(calculateScore({ node, isScored, isRelevant })).toBe(-1);
      });
      it('relevant', () => {
        const node = createNode([createRelevant()]);
        expect(calculateScore({ node, isScored, isRelevant })).toBe(0);
      });
      it('scored', () => {
        const node = createNode([createScored()]);
        expect(calculateScore({ node, isScored, isRelevant })).toBe(1);
      });
    });
    describe('two leaves', () => {
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
  describe('three hierarchy levels', () => {
    it('relevant and parent of 2 scored', () => {
      const node = createNode([
        createRelevant(),
        createNode([createScored(), createScored()]),
      ]);
      expect(calculateScore({ node, isScored, isRelevant })).toBe(0.5);
    });
  });
});
