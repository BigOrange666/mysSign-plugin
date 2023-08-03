import base from './base.js'
import NoteUser from './mys/NoteUser.js'
import MysUser from './mys/MysUser.js'


export default class User extends base {
  constructor (e) {
    super(e)
    this.model = 'bingCk'
    /** 绑定的uid */
    this.uidKey = `Yz:genshin:mys:qq-uid:${this.userId}`

    /** 多角色uid */
    this.allUid = []
    if (this.e.isSr) {
      /** 绑定的uid */
      this.uidKey = `Yz:srJson:mys:qq-uid:${this.userId}`
    }
  }

  // 获取当前user实例
  async user () {
    return await NoteUser.create(this.e)
  }

  /** 删除绑定ck */
  async delCk () {
    let user = await this.user()
    // 获取当前uid
    let uidData = user.getUidData('', this.e)
    if (!uidData || uidData.type !== 'ck' || !uidData.ltuid) {
      return `删除失败：当前的UID${uidData?.uid}无CK信息`
    }
    let mys = await MysUser.create(uidData.ltuid)
    if (!mys) {
      return `删除失败：当前的UID${uidData?.uid}无CK信息`
    }
    let msg = [`绑定cookie已删除`, mys.getUidInfo()]
    await user.delMysUser(uidData.ltuid)
    return msg.join('\n')
  }

}
