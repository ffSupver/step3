//获取申请数据
let applyCreateInfo = {};
window.onload = function () {
    $.ajax({
        url: "https://ana.luthics.com/api/round", //https://ana.luthics.com/api/round<==http://localhost:3000/
        crossDomain: true,
        type: "get",
        datatype: "json",
        success: function (data) {
            getApplyC(data.data);
            change();
        },
        error: function () {
            alert("申请数据获取失败");
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
//第一次渲染所有申请信息选项
function change() {
    var selectedRoundId = roundSelect.value;
    const round = applyCreateInfo.rounds.find(round => round.id === selectedRoundId);
    if (round) {
        clubSelect.innerHTML = '';
        depSelect.innerHTML = '';
        round.organizations.forEach(org => {
            const option = document.createElement('option');
            option.id = org.id;
            option.value = org.id;
            option.textContent = org.name;
            clubSelect.appendChild(option);
        });
    }
    var selectedClubId = clubSelect.value;
    const club = round.organizations.find(club => club.id === selectedClubId);
    if (club) {
        depSelect.innerHTML = '';
        club.department.forEach(dep => {
            const option = document.createElement('option');
            option.id = dep.id;
            option.value = dep.id;
            option.textContent = dep.name;
            depSelect.appendChild(option);
        });
    }
}