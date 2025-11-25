type ESFile = {
  path: string
  outpath: string
  text: string
  out: string
}

type Token = {
  type: TokenType
  value: string
  start: number
  end: number
}
