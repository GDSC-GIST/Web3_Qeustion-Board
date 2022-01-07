// 로그인 했는지 확인
function userSessionCheck() {

    // 로그인 되어 있으면 user을 인자값으로 넘김
    firebaseEmailAuth.onAuthStateChanged(function (user) {

        if (user) {
            // 조회 - 데이터베이스에 저장된 닉네임을 현재 접속되어있는 user의 pk key 값을 이용해 가져오기
            firebaseDatabase.ref("users/" + user.uid).once('value').then(function (snapshot) {

                // 자바스크림트 dom 선택자를 통해 네비게이션 매뉴의 엘리먼트 변경
                document.getElementById("loginmenu").textContent = "로그아웃";
                document.getElementById("loginmenu").href = "/logout.html";

                name = snapshot.val().name; 
                loginUserKey = snapshot.key; // 로그인한 유저의 key도 계속 쓸거라 전역변수
                userInfo = snapshot.val();

                // mypage에서 호출
                if(document.getElementById("titleCheck").textContent=="mypage"){
                    // 1. 닉네임 변경하기
                    document.getElementById("nicname").textContent = name;

                    // 2. 이미지가 존재하면, 이미지 Url을 가져와서 img 태그에 넣어준다
                    if (snapshot.val().imgUrl) {
                        document.getElementById("myimage").src = snapshot.val().imgUrl;
                        console.log("이미지가 저장되어 있습니다");
                    } else {
                        // 없으면 다른 이미지 대체
                        document.getElementById("myimage").src = "https://www.w3schools.com/bootstrap/img_avatar3.png";
                        console.log("이미지가 없습니다");
                    }

                    // 3. 글이 있으면 가져와서 넣는다
                    if (snapshot.val().comment) {
                        document.getElementById("statetxt").textContent = snapshot.val().comment;
                        console.log("글이 저장되어 있습니다");
                    } else {
                        // 없으면 더미 데이터
                        document.getElementById("statetxt").textContent = "글을 작성해주세요";
                        console.log("글이 없습니다");
                    }

                } else {
                    // index.html에서 호출이라면
                    cmtList();
                    return true
                }
            });

        } else {
            alert("먼저 로그인을 해주세요! :)");
            window.location = '/signup.html'
            return;
        }
        });
    }