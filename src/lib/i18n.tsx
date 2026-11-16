import { createContext, useContext } from 'react'
import { dict, type Dict, type Lang } from '../data'

export const LangCtx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({
  lang: 'fr',
  t: dict.fr,
  setLang: () => {},
})
export const useLang = () => useContext(LangCtx)
