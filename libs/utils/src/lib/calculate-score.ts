interface Params {
  node: Node;
  isScored: (node: Node) => boolean;
  isRelevant: (node: Node) => boolean;
}

function calculateChildrenScore({ node, isScored, isRelevant }: Params): {
  scoreCount: number;
  childCount: number;
} {
  if (!node.childNodes.length) {
    const isNodeRelevant = isRelevant(node);
    return {
      childCount: isNodeRelevant ? 1 : 0,
      scoreCount: isNodeRelevant && isScored(node) ? 1 : 0,
    };
  }

  let childrenScore = 0;
  let childrenCount = 0;

  node.childNodes.forEach((child) => {
    const { childCount, scoreCount } = calculateChildrenScore({
      node: child,
      isScored,
      isRelevant,
    });

    childrenCount += childCount;
    childrenScore += scoreCount;
  });

  return {
    scoreCount: childrenScore,
    childCount: childrenCount,
  };
}

export function calculateScore({ node, isScored, isRelevant }: Params): number {
  const { scoreCount, childCount } = calculateChildrenScore({
    node,
    isScored,
    isRelevant,
  });

  return childCount === 0 ? 0 : scoreCount / childCount;
}
