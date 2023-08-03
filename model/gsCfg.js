import YAML from 'yaml'
import chokidar from 'chokidar'
import fs from 'node:fs'
import lodash from 'lodash'
import NoteUser from './mys/NoteUser.js'

/** 配置文件 */
class GsCfg {
    constructor() {
        this.isSr = false
        /** 默认设置 */
        this.defSetPath = './plugins/mysSign-plugin/defSet/'
        this.defSet = {}

        /** 用户设置 */
        this.configPath = './plugins/mysSign-plugin/config/'
        this.config = {}

        /** 监听文件 */
        this.watcher = {config: {}, defSet: {}}

        this.ignore = ['mys.pubCk', 'gacha.set', 'bot.help', 'role.name']
    }

    /**
     * @param app  功能
     * @param name 配置文件名称
     */
    getdefSet(app, name) {
        return this.getYaml(app, name, 'defSet')
    }

    /** 用户配置 */
    getConfig(app, name) {
        if (this.ignore.includes(`${app}.${name}`)) {
            return this.getYaml(app, name, 'config')
        }

        return {...this.getdefSet(app, name), ...this.getYaml(app, name, 'config')}
    }

    /**
     * 获取配置yaml
     * @param app 功能
     * @param name 名称
     * @param type 默认跑配置-defSet，用户配置-config
     */
    getYaml(app, name, type) {
        let file = this.getFilePath(app, name, type)
        let key = `${app}.${name}`

        if (this[type][key]) return this[type][key]

        try {
            this[type][key] = YAML.parse(
                fs.readFileSync(file, 'utf8')
            )
        } catch (error) {
            logger.error(`[${app}][${name}] 格式错误 ${error}`)
            return false
        }

        this.watch(file, app, name, type)

        return this[type][key]
    }

    getFilePath(app, name, type) {
        if (type === 'defSet') return `${this.defSetPath}${app}/${name}.yaml`
        else return `${this.configPath}${app}.${name}.yaml`
    }

    /** 监听配置文件 */
    watch(file, app, name, type = 'defSet') {
        let key = `${app}.${name}`

        if (this.watcher[type][key]) return

        const watcher = chokidar.watch(file)
        watcher.on('change', path => {
            delete this[type][key]
            logger.mark(`[修改配置文件][${type}][${app}][${name}]`)
            if (this[`change_${app}${name}`]) {
                this[`change_${app}${name}`]()
            }
        })

        this.watcher[type][key] = watcher
    }

    /** 读取所有用户绑定的ck */
    async getBingCk(game = 'gs') {
        let ck = {}
        let ckQQ = {}
        let noteCk = {}

        await NoteUser.forEach(async function (user) {
            let qq = user.qq + ''
            let tmp = {}
            lodash.forEach(user.mysUsers, (mys) => {
                let uids = mys.getUids(game)
                lodash.forEach(uids, (uid) => {
                    let ckData = mys.getCkInfo(game)
                    ckData.qq = qq
                    if (!ck[uid]) {
                        ck[uid] = ckData
                        ckQQ[qq] = ckData
                    }
                    tmp[uid] = ckData
                })
            })
            noteCk[qq] = tmp
        })
        return {ck, ckQQ, noteCk}
    }

    /** 获取qq号绑定ck */
    async getBingCkSingle(e) {
        let cks = {}

        let user = await NoteUser.create(e)
        if (!user.hasCk) return {}
        let Users = user.mysUsers
        let ltuids = lodash.map(Users, 'ltuid')

        for (let ltuid of ltuids) {
            ltuid = Users[ltuid]
            for (let game in ltuid.uids) {
                let uids = ltuid.uids[game]
                for (let uid of uids) {
                    cks[uid] = {
                        'ck': ltuid.ck,
                        'uid': uid,
                        'game': game,
                        'device_id': ltuid.device
                    }
                }
            }
        }
        // console.log(cks)
        return cks
    }

    cpCfg(app, name) {
        if (!fs.existsSync('./plugins/mysSign-plugin/config')) {
            fs.mkdirSync('./plugins/mysSign-plugin/config')
        }

        let set = `./plugins/mysSign-plugin/config/${app}.${name}.yaml`
        if (!fs.existsSync(set)) {
            fs.copyFileSync(`./plugins/mysSign-plugin/defSet/${app}/${name}.yaml`, set)
        }
    }

}

export default new GsCfg()
