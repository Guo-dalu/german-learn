export function parseFrontmatter(raw: string): { title: string; tags: string[]; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) return { title: '', tags: [], body: raw }
  const fm = match[1]
  const title = (fm.match(/title:\s*"?([^"\n]+)"?/) ?? [])[1] ?? ''
  const tagStr = (fm.match(/tags:\s*\[([^\]]+)\]/) ?? [])[1] ?? ''
  const tags = tagStr.split(',').map(s => s.trim().replace(/"/g, ''))
  const body = raw.slice(match[0].length).trim()
  return { title, tags, body }
}
