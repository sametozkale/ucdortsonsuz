/** JSON-LD script içinde `</script>` kaçışı */
export function safeJsonLdStringify(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
