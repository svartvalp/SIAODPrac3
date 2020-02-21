const express = require('express')
const app = express()
const TemperatureRepository = require('./repo/temperatureRepository')
const temperatureRepository = new TemperatureRepository()

app.use(express.json())
app.use('/', express.static('public'))

app.get('/api/temp', (request, responce) => {
    let from = request.query.from
    let to = request.query.to
    let step = request.query.step
    if(step) {
        return temperatureRepository.getAverageTemperature(step, from, to).then( result => {
            responce.status(200).json({data : result})
        }).catch(e => console.log(e.message))
    }
    if(from && to) {
        console.log(from + ' ' + to)
        temperatureRepository.getTemperature(from, to).then(result => {
            responce.status(200).json({data : result})
        }).catch(e => responce.status(500).json({msg : "somethig went wrong"}))
    } else {
        temperatureRepository.getAllTemperature().then(result => {
            responce.status(200).json({data : result})
        })
    }
})

app.listen(8080, () => console.log('Run'))