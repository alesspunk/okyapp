import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const FIGMA_API_BASE = "https://api.figma.com/v1";
function getToken() {
    const token = process.env.FIGMA_TOKEN;
    if (!token)
        throw new Error("FIGMA_TOKEN environment variable is not set");
    return token;
}
async function figmaGet(path) {
    const response = await fetch(`${FIGMA_API_BASE}${path}`, {
        headers: { "X-FIGMA-TOKEN": getToken() },
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Figma API error ${response.status}: ${text}`);
    }
    return response.json();
}
// Extract file key from a Figma URL or return as-is if already a key
function parseFileKey(input) {
    const match = input.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
    return match ? match[1] : input;
}
const server = new McpServer({
    name: "figma-mcp",
    version: "1.0.0",
});
// ─── Tool: get_figma_file ───────────────────────────────────────────────────
server.tool("get_figma_file", "Get the top-level structure and metadata of a Figma file", {
    file: z
        .string()
        .describe("Figma file key or full Figma URL (e.g. https://www.figma.com/design/ABC123/...)"),
    depth: z
        .number()
        .int()
        .min(1)
        .max(5)
        .optional()
        .describe("How deep to traverse the document tree (1–5, default 2)"),
}, async ({ file, depth = 2 }) => {
    const key = parseFileKey(file);
    const data = await figmaGet(`/files/${key}?depth=${depth}`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
// ─── Tool: get_figma_nodes ──────────────────────────────────────────────────
server.tool("get_figma_nodes", "Get specific nodes from a Figma file by their node IDs", {
    file: z
        .string()
        .describe("Figma file key or full Figma URL"),
    node_ids: z
        .array(z.string())
        .describe("Array of node IDs to fetch (e.g. ['72353-22501', '72353-22502']). Node IDs can be found in the Figma URL after 'node-id='"),
    depth: z
        .number()
        .int()
        .min(1)
        .max(5)
        .optional()
        .describe("How deep to traverse each node's tree (1–5, default 3)"),
}, async ({ file, node_ids, depth = 3 }) => {
    const key = parseFileKey(file);
    const ids = node_ids.join(",");
    const data = await figmaGet(`/files/${key}/nodes?ids=${encodeURIComponent(ids)}&depth=${depth}`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
// ─── Tool: get_figma_components ────────────────────────────────────────────
server.tool("get_figma_components", "List all published components in a Figma file, including their names, descriptions, and IDs", {
    file: z
        .string()
        .describe("Figma file key or full Figma URL"),
}, async ({ file }) => {
    const key = parseFileKey(file);
    const data = await figmaGet(`/files/${key}/components`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
// ─── Tool: get_figma_component_sets ────────────────────────────────────────
server.tool("get_figma_component_sets", "List all component sets (variants) in a Figma file", {
    file: z
        .string()
        .describe("Figma file key or full Figma URL"),
}, async ({ file }) => {
    const key = parseFileKey(file);
    const data = await figmaGet(`/files/${key}/component_sets`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
// ─── Tool: get_figma_styles ─────────────────────────────────────────────────
server.tool("get_figma_styles", "Get all styles (colors, text, effects, grids) defined in a Figma file", {
    file: z
        .string()
        .describe("Figma file key or full Figma URL"),
}, async ({ file }) => {
    const key = parseFileKey(file);
    const data = await figmaGet(`/files/${key}/styles`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
// ─── Tool: export_figma_nodes ───────────────────────────────────────────────
server.tool("export_figma_nodes", "Export one or more Figma nodes as image URLs (PNG, SVG, JPG, or PDF)", {
    file: z
        .string()
        .describe("Figma file key or full Figma URL"),
    node_ids: z
        .array(z.string())
        .describe("Array of node IDs to export"),
    format: z
        .enum(["png", "svg", "jpg", "pdf"])
        .optional()
        .describe("Export format (default: png)"),
    scale: z
        .number()
        .min(0.01)
        .max(4)
        .optional()
        .describe("Export scale factor for PNG/JPG (0.01–4, default: 1)"),
    svg_include_id: z
        .boolean()
        .optional()
        .describe("Include node IDs as data attributes in SVG output"),
}, async ({ file, node_ids, format = "png", scale = 1, svg_include_id = false }) => {
    const key = parseFileKey(file);
    const ids = node_ids.join(",");
    const params = new URLSearchParams({
        ids,
        format,
        scale: String(scale),
        ...(format === "svg" ? { svg_include_id: String(svg_include_id) } : {}),
    });
    const data = await figmaGet(`/images/${key}?${params}`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
// ─── Tool: get_figma_image_fills ───────────────────────────────────────────
server.tool("get_figma_image_fills", "Get download URLs for all images used as fills in a Figma file", {
    file: z
        .string()
        .describe("Figma file key or full Figma URL"),
}, async ({ file }) => {
    const key = parseFileKey(file);
    const data = await figmaGet(`/files/${key}/images`);
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
});
// ─── Start server ───────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
