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
                }
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

}
