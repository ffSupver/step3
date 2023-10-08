//导航栏切换页面
for (let i = 0; i <= 2; i++) {
    document.querySelector("#page" + i + "btn").addEventListener('click', (function (page) {
        return function () {
            for (let k = 0; k <= 2; k++) {
                document.getElementById("page" + k).style.display = "none";
                document.getElementById("page" + page).style.display = "block";
                document.getElementById("page" + k + "btn").classList.remove('nav-item-selected');
                document.getElementById("page" + k + "btn").classList.add('nav-item');
                var btn = document.getElementById("page" + page + "btn");
                btn.classList.remove('nav-item');
                btn.classList.add('nav-item-selected');
            }
        };
    })(i));
}
//弹窗
document.getElementById("hitBox").addEventListener('click', function () {
    document.getElementById("hitBox").style.display = "none";
    document.getElementById("win").style.display = "none";
})

function alert(data) {
    document.getElementById("hitBox").style.display = "block";
    document.getElementById("win").style.display = "block";
    document.getElementById("win").innerHTML = data;
}
//获取创建申请的选项元素
const roundSelect = document.getElementById('roundSelect');
const clubSelect = document.getElementById('clubSelect');
const depSelect = document.getElementById('depSelect');
const caseType = document.getElementById('caseType');
//更新对应组织选项
function updateOrgSelects() {
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
}
// 更新对应部门选项
function updateDepSelect() {
    var selectedRoundId = roundSelect.value;
    const round = applyCreateInfo.rounds.find(round => round.id === selectedRoundId);
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

function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            applyCreateInfo = JSON.parse(xhr.responseText);
            updateDepSelect();
        }
    }
}

setTimeout(loadData, 50); // 延迟50ms加载数据
//监听组织选择变化和轮次选择变化
roundSelect.addEventListener('change', function () {
    updateOrgSelects();
});

roundSelect.addEventListener('click', function () {
    updateOrgSelects();
});
clubSelect.addEventListener('change', function () {
    updateDepSelect();
});

clubSelect.addEventListener('click', function () {
    updateDepSelect();
});
let userID = "62fbbf83766b8d99998136a7" //已有的身份信息
//创建申请表单
function applyCreate() {
    if (!(roundSelect.value === '' || clubSelect.value === '' || depSelect.value === '')) {
        let newApply = {}
        newApply.round = roundSelect.value;
        newApply.organization = clubSelect.value;
        newApply.department = depSelect.value;
        newApply.userID = userID;
        newApply.caseType = Number(caseType.value);
        newApply = JSON.stringify(newApply);
        console.log(newApply);
        fetch('https://ana.yidian.studio/api/apply', {
                method: 'POST',
                body: newApply,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.code === 0) {
                    alert("成功创建申请")
                } else {
                    const msg = data.msg;
                    alert(msg);
                }
            })
            .catch(error => console.error(error))
    } else {
        alert("请选择所有选项")
    }
}
//获取申请列表
function getApplyHistory() {
    $.ajax({
        url: "https://ana.luthics.com/api/case", //https://ana.luthics.com/api/case<==http://localhost:3001/
        crossDomain: true,
        type: "get",
        datatype: "json",
        success: function (data) {
            let applyHistory = data.data;
            // console.log(applyHistory);
            displayApplyList(applyHistory);
        },
        error: function () {
            alert("申请列表获取失败,再次点击“申请列表”以重新获取");
        }
    })
}

//渲染申请列表
function displayApplyList(data) {
    const applyList = document.getElementById('applyList');
    applyList.innerHTML = "";
    for (i = 0; i < data.cases.length; i++) {
        const caseNow = data.cases[i];
        const voidDiv = document.createElement('div');
        voidDiv.classList = "void";
        const info = document.createElement('div')
        info.classList = "applyList";
        applyList.appendChild(info);
        applyList.appendChild(voidDiv);
        // console.log(applyCreateInfo.rounds.filter(round => round.id === caseNow.round)[0].organizations.filter(org => org.id === caseNow.organization))
        info.innerHTML = "<br>" + "<p>申请轮次 : " + applyCreateInfo.rounds.filter(round => round.id === caseNow.round)[0].name + "</p>" +
            "<p>申请者 : " + caseNow.username + "</p>" +
            "<p>组织/部门 : " + applyCreateInfo.rounds.filter(round => round.id === caseNow.round)[0].organizations.filter(org => org.id === caseNow.organization)[0].name + "/" + applyCreateInfo.rounds.filter(round => round.id === caseNow.round)[0].organizations.filter(org => org.id === caseNow.organization)[0].department.filter(dep => dep.id === caseNow.department)[0].name + "</p>" +
            "<p>申请时间 : " + caseNow.create_at.replace("T", " ").replace("Z", "") + "</p>" +
            "<p>第" + caseNow.caseType + "志愿</p>" +
            "<p>申请状态" + caseNow.status.name + "</p>" +
            "<p>" + caseNow.message + "</p>" + "<br>" + "<div class='deleteBtn' onclick='deleteApply(event)' data-id=" + caseNow.id + ">放弃申请</div>" + "<br>"
        listLoad = true;
    }
    if (applyList.innerHTML === "") {
        const noHistory = document.createElement("div");
        noHistory.innerHTML = "目前没有申请记录!";
        noHistory.className = "noHistory";
        applyList.appendChild(noHistory);
    }
}
//放弃申请
function deleteApply(event) {
    const deleteApplyId = event.target.dataset.id;
    // console.log(deleteApplyId);
    const url = `https://ana.yidian.studio/api/apply/${deleteApplyId}`
    fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.code === 0) {
                alert("已放弃申请");
                getApplyHistory();
            } else {
                alert(data.msg);
            }
        })
        .catch(error => console.error(error))
}