//获取申请数据
let applyCreateInfo = {};
let applyHistory = {};
window.onload = function () {
    $.ajax({
        url: "http://localhost:3000/", //https://ana.luthics.com/api/round
        crossDomain: true,
        type: "get",
        datatype: "json",
        success: function (data) {
            getApplyC(data.data);
        },
        error: function () {
            alert("申请数据获取失败");
        }
    })
    $.ajax({
        url: "http://localhost:3001/", //https://ana.luthics.com/api/case
        crossDomain: true,
        type: "get",
        datatype: "json",
        success: function (data) {
            applyHistory = data;
            console.log(applyHistory);
        },
        error: function () {
            alert("申请列表获取失败");
        }
    })
}
//将申请信息放入选项
function getApplyC(data) {
    // console.log(data);
    applyCreateInfo = data;
    const rounds = applyCreateInfo.rounds.filter(round => round.open === false); //判断轮次是否开放
    rounds.forEach(round => {
        const option = document.createElement('option');
        option.id = round.id;
        option.value = round.id;
        option.textContent = round.name;
        roundSelect.appendChild(option);
    });

}