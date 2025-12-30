/**
 * ESLint rule to enforce proper heading hierarchy in Angular templates.
 * Headings must not skip levels (e.g., h1 followed by h3 is invalid).
 */

const HEADING_REGEX = /^h([1-6])$/;

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce proper heading hierarchy (no skipped levels)',
      category: 'Accessibility',
      recommended: true,
    },
    messages: {
      skippedLevel:
        'Heading level skipped: expected h{{expected}} or lower, but found h{{actual}}. Headings should not skip levels for accessibility.',
    },
    schema: [],
  },

  create(context) {
    const headings = [];

    return {
      Element(node) {
        const tagName = node.name?.toLowerCase();
        if (!tagName) return;

        const match = HEADING_REGEX.exec(tagName);
        if (!match) return;

        const level = parseInt(match[1], 10);
        headings.push({ level, node });
      },

      'Program:exit'() {
        if (headings.length < 2) return;

        for (let i = 1; i < headings.length; i++) {
          const prev = headings[i - 1];
          const curr = headings[i];

          // Allow going to same level, lower level (e.g., h2 -> h1), or one level deeper
          // Disallow skipping levels (e.g., h1 -> h3)
          if (curr.level > prev.level + 1) {
            context.report({
              node: curr.node,
              messageId: 'skippedLevel',
              data: {
                expected: prev.level + 1,
                actual: curr.level,
              },
            });
          }
        }
      },
    };
  },
};
