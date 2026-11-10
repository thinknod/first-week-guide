/*
  첫 주 안내 페이지 · 내용 파일 (사수가 고치는 곳)

  할 일 하나 = { id, day, order, text, topic }
    id    : 겹치지 않는 이름. 'd일차-순서' 모양 (예: 'd1-1'). 한 번 정하면 바꾸지 않는다.
            (바꾸면 신규 입사자 브라우저에 저장된 '다 했어요' 표시가 사라진다)
    day   : 입사 몇 일차인지 (1~5)
    order : 그날 안에서 보여 줄 순서 (1부터)
    text  : 할 일 문장
    topic : 막히면 볼 주제 아이디 (비워 두려면 '')

  - 사람은 역할로만 쓴다: 인사 담당, 경영지원 담당, IT 지원 담당, 내 사수.
  - 실제 이름·연락처·사번은 넣지 않는다.
  - 아래 목록은 03_화면흐름.md 표 1의 예시다. 실제 1~5일차 할 일로 채워 주세요.
*/
window.CONTENT = {
  tasks: [
    { id: 'd1-1', day: 1, order: 1, text: '그룹웨어 첫 로그인 후 비밀번호 바꾸기', topic: 'it-password' },
    { id: 'd1-2', day: 1, order: 2, text: '그룹웨어 > 근태 > 출근 눌러 보기',     topic: 'hr-attendance' },
    { id: 'd1-3', day: 1, order: 3, text: '메일 서명을 팀 양식으로 맞추기',       topic: 'it-mail' },
    { id: 'd2-1', day: 2, order: 1, text: '필수 교육 두 과정 신청하기',           topic: 'hr-training' },
    { id: 'd3-1', day: 3, order: 1, text: '팀장 결재 받고 법인카드 신청하기',     topic: 'ga-card' },
  ],

  /*
    주제 하나 = { id, group, name, role, wiki, answer, questions }
      id        : 겹치지 않는 이름. 할 일의 topic 칸이 이 이름을 가리킨다.
      group     : 화면 ②의 묶음 (총무 / IT / 인사 / 기타)
      name      : 주제 이름 (버튼에 크게 보임)
      role      : 담당 역할만. 이름·연락처·사번 금지
      wiki      : 위키 위치. 위키에 없으면 ''
      answer    : 짧은 답. 위키에 없으면 '확인 필요' (지어내지 않는다)
      questions : 실제로 받은 질문. 거르기 칸이 이 문장도 찾는다
      words     : (없어도 됨) 같은 것을 부르는 다른 말. 거르기 칸이 이 말도 찾는다
                  예: 프린터 → ['인쇄']. 신규 입사자가 검색했는데 못 찾은 말을 여기에 더한다

    답과 담당은 내업무/질문과답.md (10/24 주, 10/31 주)에서 그대로 옮겼다.
  */
  topics: [
    { id: 'ga-card', group: '총무', name: '법인카드', role: '경영지원 담당', wiki: '총무 > 법인카드',
      answer: '팀장 결재를 받은 뒤 경영지원 신청서. 보통 사흘',
      questions: ['법인카드는 어디서, 누구한테 신청해요?'] },
    { id: 'ga-trip', group: '총무', name: '출장비', role: '경영지원 담당', wiki: '총무 > 출장비',
      answer: '다녀온 뒤 일주일 안에 영수증 사진과 함께 경비 청구',
      questions: ['출장비 영수증은 어디에 올려요?', '출장비 처리 기한이 있어요?'] },
    { id: 'ga-room', group: '총무', name: '회의실', role: '경영지원 담당', wiki: '총무 > 회의실',
      answer: '그룹웨어 > 자원 예약 > 회의실. 30분 단위',
      questions: ['회의실은 어떻게 예약해요?'] },
    { id: 'ga-namecard', group: '총무', name: '명함', role: '경영지원 담당', wiki: '총무 > 명함',
      answer: '경영지원 신청서. 영문 표기를 함께 적음',
      questions: ['명함은 어디서 신청해요?'] },

    { id: 'it-password', group: 'IT', name: '비밀번호', role: 'IT 지원 담당', wiki: 'IT > 비밀번호',
      answer: "그룹웨어 첫 화면 > 내 정보 > 비밀번호. 잊었으면 로그인 화면의 '비밀번호 찾기'",
      questions: ['그룹웨어 비밀번호는 어디서 바꿔요?', '그룹웨어 비밀번호를 잊었어요'] },
    { id: 'it-printer', group: 'IT', name: '프린터', role: 'IT 지원 담당', wiki: 'IT > 프린터',
      answer: '층마다 프린터 이름이 다름. 프린터 옆에 붙은 이름을 IT 지원에 알림',
      questions: ['프린터가 안 잡혀요'],
      words: ['인쇄'] },
    { id: 'it-mail', group: 'IT', name: '메일', role: '내 사수', wiki: 'IT > 메일',
      answer: '메일 > 설정 > 서명. 팀 양식은 사수에게',
      questions: ['메일 서명 팀 양식 있어요?'] },

    { id: 'hr-attendance', group: '인사', name: '근태', role: '인사 담당', wiki: '인사 > 근태',
      answer: '그룹웨어 > 근태 > 출근. 늦을 것 같으면 팀 메신저 방에 먼저 남기고 사유를 적음',
      questions: ['출근은 어디서 찍어요?', '늦을 것 같으면 누구한테 알려요?'] },
    { id: 'hr-leave', group: '인사', name: '휴가', role: '인사 담당', wiki: '인사 > 휴가',
      answer: '그룹웨어 > 근태 > 휴가 신청, 팀장 결재. 입사 달부터 쓸 수 있음',
      questions: ['휴가 신청은 누구 결재예요?'] },
    { id: 'hr-training', group: '인사', name: '필수 교육', role: '인사 담당', wiki: '인사 > 필수 교육',
      answer: '입사 한 달 안에 두 과정. 교육 시스템에서 신청',
      questions: ['필수 교육은 언제까지 들어야 해요?'] },

    { id: 'etc-parcel', group: '기타', name: '택배', role: '확인 필요', wiki: '',
      answer: '확인 필요',
      questions: ['택배는 어디로 받아요?'] },
  ],
};
