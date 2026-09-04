export const BLOCK_SCHEMA_VERSION = "1.0";

export type Block =
  | { type: "hero"; props: Record<string, unknown> }
  | { type: "benefits"; props: Record<string, unknown> }
  | { type: "testimonials"; props: Record<string, unknown> }
  | { type: "faq"; props: Record<string, unknown> }
  | { type: "cta"; props: Record<string, unknown> };
