module.exports={
    gtime: function (distanceTime) { //untuk mnghitung durasi waktu

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
    ftime : function (timeNow = new Date()) { //untuk format fultime tanggal
        let month = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'October','Nopember','December']        
        
        let date = timeNow.getDate()
        console.log(date);
    
        let monthIndex = timeNow.getMonth()
        console.log(month[monthIndex]);
    
        let year = timeNow.getFullYear()
        console.log(year);
        
        return `${date} ${month[monthIndex]} ${year}`
    }
}
