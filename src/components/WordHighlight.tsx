type WordType = 'noun' | 'verb' | 'adj'

export default function WordHighlight({ word, type }: { word: string; type: WordType }) {
  return <span className={type}>{word}</span>
}
