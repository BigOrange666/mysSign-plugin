import plugin from '../../../lib/plugins/plugin.js'
import MysSign from "../model/mysSign.js";
import gsCfg from '../model/gsCfg.js'
import fs from 'node:fs'

gsCfg.cpCfg('mys', 'set')

export class mysSign extends plugin {
    constructor() {
        super({
            name: '米游社签到',
            dsc: '米游社签到',
            event: 'message',
            priority: 300,
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

    /** 初始化创建配置文件 */
    async init () {
        let file = './plugins/mysSign-plugin/config/mys.set.yaml'

        if (fs.existsSync(file)) return

        fs.copyFileSync('./plugins/mysSign-plugin/defSet/mys/set.yaml', file)
    }
}
