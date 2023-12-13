import { isLetter } from '@rtl-extensions/utils';
import { isPresented, isTextNode } from './dom';

const shouldLog = false;

interface Params {
  node: Node;
  isScored: (node: Node) => boolean;
  isRelevant: (node: Node) => boolean;
}

export function calculateScore({ node, isScored, isRelevant }: Params): number {
  if (!node.childNodes.length) {
    if (shouldLog) {
      if (isRelevant(node)) {
        console.log(node);
      }
      if (!isTextNode(node) && isLetter(node.textContent)) {
        console.error('problem', node);
      }
    }

    return isRelevant(node) ? (isScored(node) ? 1 : 0) : -1;
  }

  const relevantChildrenScores = Array.from(node.childNodes)
    .filter(isPresented)
    .map((child) =>
      calculateScore({
        node: child,
        isScored,
        isRelevant,
      })
    )
    .filter((childScore) => childScore > -1);

  const childrenScoresSum = relevantChildrenScores.reduce(
    (sum, childScore) => sum + childScore,
    0
  );

  return relevantChildrenScores.length === 0
    ? -1
    : childrenScoresSum / relevantChildrenScores.length;
}
