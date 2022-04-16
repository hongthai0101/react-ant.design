export interface IMemorandum {
  id: string
  markdown: string
  sortIndex: number
  title: string
  createdAt: string

  // append
  html: string
}