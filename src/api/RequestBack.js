import axios from 'axios';

const BASE_URL = '/api/property';
const headers = { 'Content-Type': 'multipart/form-data' }; // 매물 이미지 넘겨야 해서 설정

export default {
    async create(property) {
        // 아바타 파일 업로드 - multipart 인코딩 필요 -> FormData 객체 사용

        const formData = new FormData(); // DTO property 명
        formData.append('zipcode', property.zipcode); // 우편번호
        formData.append('roadName', property.roadName); // 도로명주소
        formData.append('bgdCd', property.bgdCd); // 법정동 코드
        formData.append('dong', property.dong); // 법정동명
        formData.append('addressName', property.addressName); // 상세주소
        formData.append('mainAddressNo', property.mainAddressNo); // 본번
        formData.append('subAddressNo', property.subAddressNo); // 부번
        formData.append('longitude', property.longitude); // 경도 _ api 요청해서 받아오기
        formData.append('latitude', property.latitude); // 위도 _ api 요청해서 받아오기
        formData.append('type', property.type); // 단지(건물) 유형 _
        formData.append('complexName', property.complexName); // 단지(건물) 이름
        formData.append('amount', property.amount); //매매가
        formData.append('deposit', property.deposit); //전세가
        formData.append('roomNo', property.roomNo); // 방개수
        formData.append('bathNo', property.bathNo); // 욕실개수
        formData.append('hasEv', property.hasEv); // 엘베유무
        formData.append('porch', property.porch); //현관타입
        formData.append('floor', property.floor); // 층
        formData.append('totalFloor', property.totalFloor); // 전체층
        formData.append('description', property.description); // 설명
        formData.append('parking', property.parking); //주차가능여부
        formData.append('recentAmount', property.recentAmount); // 최근실거래(매매)
        formData.append('recentDeposit', property.recentDeposit); // 최근실거래(전세)
        formData.append('hugNumber', property.hugNumber); // HUG 인증번호
        formData.append('brokerId', property.brokerId); // 중개인 아이디 _ 로그인에서 정보 뽑아오기
        formData.append('registerUniqueNum', property.registerUniqueNum); // 등기고유번호 _ ocr 처리 어디서 하는지 확인
        formData.append('hasSchool', property.hasSchool); // 학교 여부
        formData.append('hasConvenience', property.hasConvenience); // 편의점 여부

        if (property.images) {
            formData.append('images', property.images); // 파일 첨부
        }

        const { data } = await axios.post(BASE_URL, formData, headers);

        console.log('PROPERTY POST: ', data);
        return data;
    },
};
