module.exports={
    gtime: function (distanceTime) {

        let miliseconds = 1000 // 1000 miliseconds dalam 1 detik
        let secondInHours = 3600 // 1 jam sama dengan 3600 detik
        let hoursInDay = 24 // 24 jam dalam 1 hari
    
        let distanceYear = Math.floor(distanceTime/(miliseconds * secondInHours * hoursInDay * 365))
        let distanceMonth = Math.floor(distanceTime/(miliseconds * secondInHours * hoursInDay * 30))
        let distanceWeek = Math.floor(distanceTime/(miliseconds * secondInHours * hoursInDay * 7))
        let distanceDay = Math.floor(distanceTime / (miliseconds * secondInHours * hoursInDay))
        let distanceHours = Math.floor(distanceTime / (miliseconds * 60 * 60))
        let distanceMinutes = Math.floor(distanceTime / (miliseconds * 60))
        let distanceSeconds = Math.floor(distanceTime / miliseconds)
        
        
    
        if (distanceYear > 0) {
            return `${distanceYear} year`
        }else if(distanceMonth > 0) {
            return `${distanceMonth} month`
        } else if(distanceWeek > 0) {
            return `${distanceWeek} week`
        } else if (distanceDay > 0){
            return `${distanceDay} day`
        } else if(distanceHours > 0) {
            return `${distanceHours} hour`
        } else if(distanceMinutes > 0) {
            return `${distanceMinutes} minute`
        } else {
            return `${distanceSeconds} second`
        }

        
    },
    ftime : function (timeNow) {
        let month = ['Januari', 'Febuari', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'October','Nopember','December']        
        let number = timeNow.split("-")

        let year = number[0]
        let indexmonth = number[1]
        if (indexmonth.slice(0,1)=='0') {
            indexmonth = indexmonth.slice(1,2)
        }
        let date = number[2]
        
        return `${date} ${month[indexmonth]} ${year}`
    }
}
