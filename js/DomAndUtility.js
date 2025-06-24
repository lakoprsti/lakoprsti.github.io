function wrapWordsBetween(startEl, endEl) {
  const parent = startEl.parentNode;
  const nodes = Array.from(parent.childNodes);
  const inRangeNodes = [];

  let inRange = false;

  nodes.forEach(node => {
    if (node === startEl) {
      inRange = true;
      inRangeNodes.push(node);
      return;
    }
    if (node === endEl) {
      inRangeNodes.push(node);
      inRange = false;
      return;
    }
    if (!inRange) return;

    if (node.nodeType === 3) {
      const wordNodes = node.textContent.split(/(\s+)/).map(word => {
        const span = document.createElement("span");
        span.textContent = word;
        return span;
      });
      wordNodes.forEach(span => {
        parent.insertBefore(span, node);
        inRangeNodes.push(span);
      });
      parent.removeChild(node);
    } else {
      inRangeNodes.push(node);
    }
  });

  return inRangeNodes;
}
