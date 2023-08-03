/**
 * 整合接口用于查询数据
 * 方便后续用于解耦
 * 临时处理，后续大概率重写 主要原因（懒）
 */
import GsCfg from "../gsCfg.js";

export default class apiTool {
    /**
     *
     * @param {用户uid} uid
     * @param {区服} server
     * @param {是否为星穹铁道或其他游戏? type(bool or string)} isSr
     */
    constructor(uid, server, isSr = false) {
        this.uid = uid
        this.isSr = isSr
        this.server = server
        this.game = 'genshin'
        if (isSr) this.game = 'honkaisr'
        if (typeof isSr !== 'boolean') {
            this.game = isSr
        }
        this.set = GsCfg.getConfig('mys', 'set')
    }


    getUrlMap = (data = {}) => {
        let host, hostRecord
        if (['cn_gf01', 'cn_qd01', 'prod_gf_cn', 'prod_qd_cn'].includes(this.server)) {
            host = 'https://api-takumi.mihoyo.com/'
        } else if (['os_usa', 'os_euro', 'os_asia', 'os_cht'].includes(this.server)) {
            host = 'https://api-os-takumi.mihoyo.com/'
        }
        let urlMap = {
            genshin: {
                /** 签到信息 */
                bbs_sign_info: {
                    url: `${host}event/bbs_sign_reward/info`,
                    query: `act_id=e202009291139501&region=${this.server}&uid=${this.uid}`,
                    sign: true
                },
                /** 签到奖励 */
                bbs_sign_home: {
                    url: `${host}event/bbs_sign_reward/home`,
                    query: `act_id=e202009291139501&region=${this.server}&uid=${this.uid}`,
                    sign: true
                },
                /** 签到 */
                bbs_sign: {
                    url: `${host}event/bbs_sign_reward/sign`,
                    body: {act_id: 'e202009291139501', region: this.server, uid: this.uid},
                    sign: true
                },
                validate: {
                    url: `${this.set.api.url}`,
                    query: `gt=${data.gt}&challenge=${data.challenge}&token=${data.token}`
                }
            },
            honkaisr: {
                /** 签到信息 */
                bbs_sign_info: {
                    url: `${host}event/luna/info`,
                    query: `act_id=e202304121516551&region=${this.server}&uid=${this.uid}`,
                    sign: true
                },
                /** 签到奖励 */
                bbs_sign_home: {
                    url: `${host}event/luna/home`,
                    query: `act_id=e202304121516551&region=${this.server}&uid=${this.uid}`,
                    sign: true
                },
                /** 签到 */
                bbs_sign: {
                    url: `${host}event/luna/sign`,
                    body: {act_id: 'e202304121516551', region: this.server, uid: this.uid},
                    sign: true
                },
                validate: {
                    url: `${this.set.api.url}`,
                    query: `gt=${data.gt}&challenge=${data.challenge}&token=${data.token}`
                }
            }
        }

        return urlMap[this.game]
    }
}
