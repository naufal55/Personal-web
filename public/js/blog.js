let blogs = []
console.log(blogs);

function addProject(event) {

    event.preventDefault()

    let nProject = document.getElementById('input-project').value
    let sDate = document.getElementById('input-start').value
    let eDate = document.getElementById('input-end').value
    let desc = document.getElementById('input-description').value
    let uImage = document.getElementById('input-image').files
    
    let bs = document.getElementById('input-bootstrap').checked
    let js = document.getElementById('input-js').checked
    let react = document.getElementById('input-react').checked
    let node = document.getElementById('input-node').checked

    if (nProject == '') {
        return alert("Nama Project Wajib Diisi!")
    } else if (sDate == '') {
        return alert("Tanggal Mulai Wajib Diisi!")
    } else if (eDate == '') {
        return alert("Tanggal Akhir Wajib Diisi!")
    } else if (desc == '') {
        return alert("Deskripsi Wajib Diisi!")
    } else if (!bs&&!js&&!react&&!node) {
        return alert("Technologi Wajib Diisi Minimal 1!")
    } else if(!uImage[0]){
        return alert("Image Wajib Dimasukkan!")
    }

    // if (uImage[0]) {
        
    // }

    if(bs){
        bs = document.getElementById('input-bootstrap').value
    } else {
        bs = ''
    }
    if(js){
        js = document.getElementById('input-js').value
    } else {
        js = ''
    }
    if(react){
        react = document.getElementById('input-react').value
    } else {
        react = ''
    }
    if(node){
        node = document.getElementById('input-node').value
    } else {
        node = ''
    }

    let distan = new Date(eDate) - new Date(sDate) 
    
    uImage = URL.createObjectURL(uImage[0]) // untuk menampilkan gambar agar tampil
    

    // if (uImage=='') {
        
    // }
    let blog = {
        namaProject: nProject,
        startDate: sDate,
        endDate: eDate,
        distance:distan,
        description:desc,
        ImageUpload:uImage,
        bootstrap: bs,
        javascript: js,
        reactjs: react,
        nodejs: node
    }

    

    blogs.push(blog)
    console.log(blogs);

    renderProject()
}

firstCardDetail=`
    <div class="frame-detail">
        <div class="foto">
            <img src="assets/img/blog-img.png">
        </div>
        <div class="label-foto">
            <h3>Dumbways Mobile apps - 2021</h3>
            <h5>durasi 3 bulan</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil eius, numquam accusamus ipsa unde totam?...</p>
        </div>
        <div class="icon-tech">
            <i class="fa-brands fa-bootstrap"></i>
            <i class="fa-brands fa-js"></i>
            <i class="fa-brands fa-react"></i>
            <i class="fa-brands fa-node-js"></i>
        </div>
        <div class="edit-btn">
            <button>Edit</button>
            <button>Delete</button>
        </div>
    </div>

`

function renderProject() {

    document.getElementById('card-detail').innerHTML = firstCardDetail

    for (let i = 0; i < blogs.length; i++) {
        
        // array[keberapa].property object
        document.getElementById('card-detail').innerHTML +=
        `
        <a href="detail-blog.html" style="text-decoration: none; color:black">
        <div class="frame-detail">
            <div class="foto">
                <img src=${blogs[i].ImageUpload}>
            </div>
            <div class="label-foto">
                <h3>${blogs[i].namaProject}</h3>
                <h5>durasi ${getDistanceTime(blogs[i].distance)}</h5>
                <p>${blogs[i].description.slice(0,100)}...</p>
            </div>
            <div class="icon-tech">
                <i class="${blogs[i].bootstrap}"></i>
                <i class="${blogs[i].javascript}"></i>
                <i class="${blogs[i].reactjs}"></i>
                <i class="${blogs[i].nodejs}"></i>
            </div>
            <div class="edit-btn">
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </div>
        </a>
        `
    }

}

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
            return `${distanceYear} tahun lalu`
        }else if(distanceMonth > 0) {
            return `${distanceMonth} bulan lalu`
        } else if(distanceWeek > 0) {
            return `${distanceWeek} minggu lalu`
        } else if (distanceDay > 0){
            return `${distanceDay} hari lalu`
        } else if(distanceHours > 0) {
            return `${distanceHours} jam lalu`
        } else if(distanceMinutes > 0) {
            return `${distanceMinutes} menit lalu`
        } else {
            return `${distanceSeconds} detik lalu`
        }
    }
}
