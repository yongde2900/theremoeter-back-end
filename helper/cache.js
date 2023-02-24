const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore()
const history = db.collection('history')



function Cache(fn, type) {
    const cache = []

    function dataIndicator(type) {

        const date = new Date()
        const day = date.getDate()
        const hour = date.getHours()
        const minutes = date.getMinutes()
        switch (type) {
            case 'quarter':
                const goalTime = Math.floor(minutes / 15)
                if (goalTime !== 0) {
                    date.setMinutes(goalTime * 15)
                }
                else {
                    date.setMinutes(0)
                    date.setHours(hour - 1)
                }
                return date
            case 'hour':
                date.setHours(hour - 1)
                return date
            case 'day':
                date.setDate(day - 1)
                return date
        }
    }

    function compareCache(type) {
        if (!cache[0]) return null
        const indicator = dataIndicator(type)
        const indicatorDay = indicator.getDate()
        const indicatorHour = indicator.getHours()
        const indicatorMinutes = indicator.getMinutes()
        const cacheDate = new Date(cache[cache.length - 1].earliest_timestamp)
        const cacheDay = cacheDate.getDate()
        const cacheHour = cacheDate.getHours()
        const cacheMinutes = cacheDate.getMinutes()
        switch (type) {
            case 'quarter':
                if (cacheDay === indicatorDay)
                    if (cacheHour === indicatorHour)
                        if (cacheMinutes === indicatorMinutes) {
                            return cache
                        }
            case 'hour':
                if (cacheDay === indicatorDay)
                    if (cacheHour === indicatorHour) {
                        return cache
                    }
            case 'day':
                if (cacheDay === indicatorDay) {
                    return cache
                }
        }
    }
    this.getData = function () {
        return data.concat
    }
    this.useCache = async function () {
        let datas = compareCache(type)
        if (!datas) {
            datas = await fn(type)
            cache.splice(0, cache.length)
            datas.forEach(item => {
                cache.push(item)
            })
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