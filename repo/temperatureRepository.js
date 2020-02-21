class TemperatureRepository {
    constructor() {
        this.knex = require('knex')({
            client : "mysql",
            version : "8.0.18",
            connection: {
                host : "127.0.0.1",
                user : "curse",
                password :"knex",
                database : "weather_db"
            }
        })
    }
    getTemperature(fromDate, toDate) {
        return new Promise((resolve, reject) => {
            this.knex('weather').whereBetween('date',[fromDate, toDate]).then(result => {
                const updatedResult = result.map(elem => {
                    let day = elem.date.getDate()
                    let month = elem.date.getMonth() + 1
                    if(day < 10) {
                        day = '0' + day
                    }
                    if(month < 10) {
                       month = '0' + month
                   }
                    const newDate =day + '-' + month + '-' + elem.date.getFullYear()
                    return [newDate, elem.value]
                })
                resolve(updatedResult)
            })
        })
    }
    async getAverageTemperature(step ,fromDate, toDate) {
        let data = []
        if(fromDate && toDate) {
           data = await  this.knex('weather').whereBetween('date',[fromDate, toDate])
        } else {
            data = await this.knex('weather').select()
        }
        if (step == 'week') {
            return this.sortAverageByWeek(data)
        }
        if (step == 'month') {
            return this.sortAverageByMonth(data)
        }
        if (step == 'year') {
            return this.sortAverageByYear(data)
        } else {
            return []
        }
    }
    getAllTemperature() {
        return new Promise((resolve, reject) => {
            this.knex('weather').select().then(result => {
             const updatedResult = result.map(elem => {
                 let day = elem.date.getDate()
                 let month = elem.date.getMonth() + 1
                 if(day < 10) {
                     day = '0' + day
                 }
                 if(month < 10) {
                    month = '0' + month
                }
                 const newDate =day + '-' + month + '-' + elem.date.getFullYear()
                 return [ newDate, elem.value]
             })
             resolve(updatedResult)
        })
        })
    }
    sortAverageByYear(data) {
        let newData = []
        let i = 0
        while (i < data.length - 1) {
            let year = data[i].date.getFullYear()
            let sum = 0
            let count = 0
            while(data[i].date.getFullYear() == year && i < data.length-1){
                sum += data[i].value
                count++
                i++
            }
            newData.push([ year.toString(), sum/count])
        }
        return newData
    }
    sortAverageByWeek(data) {
        let newData = []
        let i = 0
        while (i < data.length - 1) {
            let week = data[i].date.getWeekNumber()
            let year = data[i].date.getFullYear()
            let sum = 0
            let count = 0
            do {
                sum += data[i].value
                count++
                i++
            }while(data[i].date.getWeekNumber() == week && i < data.length - 1)
            newData.push([week + ' неделя ' + year, sum/count])
        }
        return newData
    }

    sortAverageByMonth(data) {
        let newData = []
        let i = 0
        while (i < data.length-1) {
        let month = data[i].date.getMonth()
        let year = data[i].date.getFullYear() 
        let sum = 0
        let count = 0
        while(data[i].date.getMonth() == month && i < data.length-1){
            sum += data[i].value
            count++
            i++
        }
        newData.push([(month +1)  + '-' + year, sum/count])
    } 
    return newData
    }
}
 

Date.prototype.getWeekNumber = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
  };


module.exports = TemperatureRepository