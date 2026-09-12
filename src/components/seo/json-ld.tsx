/**
 * Renders JSON-LD into the page.
 *
 * One component so every block on the site is serialised the same way, and so
 * `null` entries — the builders return `null` when a page has nothing genuine
 * to describe — drop out instead of emitting an empty script tag.
 *
 * `<` is escaped because a `</script>` sequence inside the data would
 * otherwise close the tag early; the value stays valid JSON either way.
 */
type Block = Record<string, unknown> | null;

export function JsonLd({ schema }: { schema: Block | Block[] }) {
  const blocks = (Array.isArray(schema) ? schema : [schema]).filter(
    (block): block is Record<string, unknown> => block !== null,
  );
  if (!blocks.length) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(blocks.length === 1 ? blocks[0] : blocks).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}
