/**
 * 整合接口用于查询数据
 * 方便后续用于解耦
 * 临时处理，后续大概率重写 主要原因（懒）
 */
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
    }


    getUrlMap = (data = {}) => {
        let host, hostRecord
        if (['cn_gf01', 'cn_qd01', 'prod_gf_cn', 'prod_qd_cn'].includes(this.server)) {
            host = 'https://api-takumi.mihoyo.com/'
            hostRecord = 'https://api-takumi-record.mihoyo.com/'
        } else if (['os_usa', 'os_euro', 'os_asia', 'os_cht'].includes(this.server)) {
            host = 'https://api-os-takumi.mihoyo.com/'
            hostRecord = 'https://bbs-api-os.mihoyo.com/'
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
                    url: `https://api.peel.eu.org/get`,
                    query: `gt=${data.gt}&challenge=${data.challenge}&token=Pomelo666`
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
                    url: `https://api.peel.eu.org/get`,
                    query: `gt=${data.gt}&challenge=${data.challenge}&token=Pomelo666`
                }
            }
        }

        if (this.server.startsWith('os')) {
            urlMap.genshin.detail.url = 'https://sg-public-api.hoyolab.com/event/calculateos/sync/avatar/detail'// 角色天赋详情
            urlMap.genshin.detail.query = `lang=zh-cn&uid=${this.uid}&region=${this.server}&avatar_id=${data.avatar_id}`
            urlMap.genshin.avatarSkill.url = 'https://sg-public-api.hoyolab.com/event/calculateos/avatar/skill_list'// 查询未持有的角色天赋
            urlMap.genshin.avatarSkill.query = `lang=zh-cn&avatar_id=${data.avatar_id}`
            urlMap.genshin.compute.url = 'https://sg-public-api.hoyolab.com/event/calculateos/compute'// 已支持养成计算
            urlMap.genshin.blueprint.url = 'https://sg-public-api.hoyolab.com/event/calculateos/furniture/blueprint'
            urlMap.genshin.blueprint.query = `share_code=${data.share_code}&region=${this.server}&lang=zh-cn`
            urlMap.genshin.blueprintCompute.url = 'https://sg-public-api.hoyolab.com/event/calculateos/furniture/compute'
            urlMap.genshin.blueprintCompute.body = {lang: 'zh-cn', ...data}
            urlMap.genshin.ys_ledger.url = 'https://hk4e-api-os.mihoyo.com/event/ysledgeros/month_info'// 支持了国际服札记
            urlMap.genshin.ys_ledger.query = `lang=zh-cn&month=${data.month}&uid=${this.uid}&region=${this.server}`
            urlMap.genshin.useCdk.url = 'https://sg-hk4e-api.hoyoverse.com/common/apicdkey/api/webExchangeCdkey'
            urlMap.genshin.useCdk.query = `uid=${this.uid}&region=${this.server}&lang=zh-cn&cdkey=${data.cdk}&game_biz=hk4e_global`
        }
        return urlMap[this.game]
    }
}
