
export default class base {
  constructor(e = {}) {
    this.e = e
    this.userId = e?.user_id
    this.model = 'genshin'
    this._path = process.cwd().replace(/\\/g, '/')
  }

  get prefix() {
    return `Yz:genshin:${this.model}:`
  }

}
