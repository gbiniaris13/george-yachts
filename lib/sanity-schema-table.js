/**
 * Sanity Schema: Table Block for Portable Text
 *
 * Add this object type to your Sanity Studio schema, then reference it
 * inside the blog post body field's `of` array:
 *
 *   // In your post schema body field:
 *   defineField({
 *     name: 'body',
 *     type: 'array',
 *     of: [
 *       { type: 'block' },
 *       { type: 'image' },
 *       { type: 'table' },   // <-- add this
 *     ],
 *   })
 *
 * Copy the export below into your Studio's schema directory
 * (e.g. schemas/table.js) and register it in schema/index.js.
 */

export const tableSchema = {
  name: "table",
  title: "Table",
  type: "object",
  fields: [
    {
      name: "headerRow",
      title: "First Row is Header",
      type: "boolean",
      description: "Toggle on to style the first row as a header.",
      initialValue: true,
    },
    {
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional caption displayed below the table.",
    },
    {
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        {
          type: "object",
          name: "tableRow",
          title: "Row",
          fields: [
            {
              name: "cells",
              title: "Cells",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
          preview: {
            select: { cells: "cells" },
            prepare({ cells }) {
              return {
                title: cells ? cells.join(" | ") : "Empty row",
              };
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      rows: "rows",
      caption: "caption",
    },
    prepare({ rows, caption }) {
      const rowCount = rows ? rows.length : 0;
      const colCount =
        rows && rows[0] && rows[0].cells ? rows[0].cells.length : 0;
      return {
        title: caption || "Table",
        subtitle: `${rowCount} rows x ${colCount} columns`,
      };
    },
  },
};
