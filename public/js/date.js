
var todayDate = new Date();
var month = todayDate.getMonth() + 1;
var year = todayDate.getUTCFullYear() - 0;
var tdate = todayDate.getDate() + 1;
if (month < 10) {
    month = "0" + month;
}
if (tdate < 10) {
    tdate = "0" + tdate;
}
var maxDate = year + "-" + month + "-" + tdate;
document.getElementById("date").setAttribute("min", maxDate);
console.log(maxDate);
