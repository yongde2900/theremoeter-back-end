const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore()
const history = db.collection('history')


function Cache(fn, type) {
    const cache = []
    let breakTimestamp = 0

    function updateBreakTimestamp(type) {

        const date = new Date()
        const day = date.getDate()
        const hour = date.getHours()
        const minutes = date.getMinutes()
        switch (type) {
            case 'quarter':
                const goalTime = Math.floor(minutes / 15)
                if (goalTime === 3) {
                    date.setMinutes(0)
                    date.setHours(hour + 1)
                }
                else {
                    date.setMinutes((goalTime + 1) * 15)
                }
                break
            case 'hour':
                date.setHours(hour + 1)
                date.setMinutes(0)
                break
            case 'day':
                date.setDate(day + 1)
                date.setHours(18)
                date.setMinutes(0)
                break
        }
        date.setSeconds(15)
        return breakTimestamp = date.valueOf() 
    }

    function compareCache() {
        const nowTimestamp = Date.now()
        if (nowTimestamp > breakTimestamp) return null
        return cache
    }
    this.getData = function () {
        return data.concat
    }
    this.useCache = async function () {
        let datas = compareCache()
        if (!datas) {
            datas = await fn(type)
            cache.splice(0, cache.length)
            datas.forEach(item => {
                cache.push(item)
            })
            updateBreakTimestamp(type)
        }

        return datas
    }


}


async function getDataFromHistory(type) {
    const amount = {
        quarter: 4,
        hour: 24,
        day: 7
    }

    const snapshot = await history.where('type', '=', type).limit(amount[type]).orderBy('earliest_timestamp', 'desc').get()
    let datas = []
    snapshot.forEach(doc => {
        const data = doc.data()
        data.humidity_avg = Math.floor(data.humidity_avg, -2)
        data.temperature_avg = Math.floor(data.temperature_avg, -2)
        datas.push(data)
    })
    datas.reverse()
    return datas
}

const quarterCache = new Cache(getDataFromHistory, 'quarter')
const hourCache = new Cache(getDataFromHistory, 'hour')
const dayCache = new Cache(getDataFromHistory, 'day')

function getCache(type) {
    switch (type) {
        case 'quarter':
            return quarterCache
        case 'hour':
            return hourCache
        case 'day':
            return dayCache
    }
}
module.exports = getCache