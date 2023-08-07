import plugin from '../../../lib/plugins/plugin.js'
import MysSign from "../model/mysSign.js";
import gsCfg from '../model/gsCfg.js'


gsCfg.cpCfg('mys', 'set')

export class mysSign extends plugin {
    constructor() {
        super({
            name: '米游社签到',
            dsc: '米游社签到',
            event: 'message',
            priority: 100,
            rule: [
                {
                    reg: '^(原神|星铁)?(#签到|#*米游社(自动)*签到)(force)*$',
                    fnc: 'sign'
                },
                {
                    reg: '^#*(原神|星铁)?(全部签到|签到任务)(force)*$',
                    permission: 'master',
                    fnc: 'signTask'
                },
                {
                    reg: '^#*(设置)(url|token)?(:)(.*)$',
                    permission: 'master',
                    fnc: 'setAPI'
                },

            ]
        })

        this.set = gsCfg.getConfig('mys', 'set')

        /** 定时任务 */
        this.task = {
            cron: this.set.signTime,
            name: '米游社原神签到任务',
            fnc: () => this.signTask()
        }

    }

    /** #签到 */
    async sign() {
        await MysSign.sign(this.e)
    }

    /** 签到任务 */
    async signTask() {
        let mysSign = new MysSign(this.e)
        await mysSign.signTask(!!this?.e?.msg)
    }

    async setAPI(e){
        // 获取
        let test = e.msg.replace(/#*(设置)?(url|token):/,'')

        //
        let type = e.msg.includes('url') ? 'url':'token'

        switch (type){
            case 'url':     // 修改URL
                this.set.api.url = test
                break

            case 'token':   // 修改Token
                this.set.api.token = test
                break
        }
        let tips = []

        tips.push(`接口:${this.set.api.url}`)
        tips.push(`令牌:${this.set.api.token}`)

        e.reply(tips)

    }

}
