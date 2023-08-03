
export default class base {
  constructor(e = {}) {
    this.e = e
    this.userId = e?.user_id
    this.model = 'genshin'
    this._path = process.cwd().replace(/\\/g, '/')
  }

  get prefix_gs() {
    return `Yz:genshin:${this.model}:`
  }

  get prefix_sr(){
    return `Yz:honkaisr:${this.model}:`
  }

}
