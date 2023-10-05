//导航栏切换页面
for (let i = 0; i <= 2; i++) {
    document.querySelector("#page" + i + "btn").addEventListener('click', (function (page) {
        return function () {
            for (let k = 0; k <= 2; k++) {
                document.getElementById("page" + k).style.display = "none";
            }
            document.getElementById("page" + page).style.display = "block";
        };
    })(i));
}
//获取创建申请的选项元素
const roundSelect = document.getElementById('roundSelect');
const clubSelect = document.getElementById('clubSelect');
const depSelect = document.getElementById('depSelect');
const caseType = document.getElementById('caseType');
//监听轮次选择变化并显示对应组织选项
roundSelect.addEventListener('change', function () {
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
});
roundSelect.addEventListener('click', function () {
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
});
// 监听组织选择变化并显示对应部门选项
clubSelect.addEventListener('change', function () {
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
});
clubSelect.addEventListener('click', function () {
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
});
let userID = "62fbbf83766b8d99998136a7" //已有的身份信息
//创建申请表单
function applyCreate() {
    if (!(roundSelect.value === '' || clubSelect.value === '' || depSelect.value === '')) {
        let newApply = {}
        newApply.round = roundSelect.value;
        newApply.organizations = clubSelect.value;
        newApply.department = depSelect.value;
        newApply.userID = userID;
        newApply.caseType = caseType.value;
        // console.log(newApply);
        fetch('https://ana.yidian.studio/api/apply', {
                method: 'POST',
                body: newApply,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error))
    } else {
        alert("请选择所有选项")
    }
}
//渲染申请列表
let listLoad = false;

function getApplyHistory(data) {
    if (listLoad == false) {
        const applyList = document.getElementById('applyList');
        for (i = 0; i < data.cases.length; i++) {
            const caseNow = data.cases[i];
            const voidDiv = document.createElement('div');
            voidDiv.classList = "void";
            const info = document.createElement('div')
            info.classList = "applyList";
            applyList.appendChild(voidDiv);
            applyList.appendChild(info);
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
    }
}
//放弃申请
function deleteApply(event) {
    const deleteApplyId = event.target.dataset.id;
    // console.log(deleteApplyId);
    fetch("https://ana.yidian.studio/api/apply/{" + deleteApplyId + "}", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error))
}