<script setup>
import AddressSearch from '../components/tool/AddressSearch.vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import propertyApi from '../api/PropertyRegiAPI';
import { requestWithFile } from '@/api/Ocr';

const router = useRouter();
const images = ref(null);
const selectedFile = ref(null);

// const ocrData = reactive({
//     uniqueNumber: '', // 고유번호
//     openDate: '', // 열람일시
//     address: '', // 건물명 주소
//     attachment1: false, // 압류 여부
//     attachment2: false, // 가압류 여부
//     trust: false, // 신탁 여부
//     auction: false, // 경매 여부
//     loan: 0, // 근저당액 총액
//     leaseAmount: 0, // 전세권 총액
// });

// 파일 선택 핸들러
const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        await submitFile(); // 파일 선택시 OCR 시행
    }
};

// OCR 핸들러
const submitFile = async () => {
    if (!selectedFile.value) {
        alert('파일을 선택하세요.');
        return;
    }

    try {
        // console.time('OCR 시간 측정');
        const result = await requestWithFile(selectedFile.value);
        // console.timeEnd('OCR 시간 측정');

        if (result) {
            property.uniqueNumber = result.uniqueNumber;
            property.openDate = result.openDate;
            property.address = result.address;
            property.loan = result.loan;
            property.leaseAmount = result.leaseAmount;
            property.attachment1 = result.attachment1;
            property.attachment2 = result.attachment2;
            property.trust = result.trust;
            property.auction = result.auction;
        }

        console.log('OCR 결과: ', property);
    } catch (error) {
        console.error('OCR 처리 중 오류 발생:', error);
    }
};

// const disableSubmit = ref(true); // 필수 사항 입력 전 까지 submit 못하게

const property = reactive({
    brokerId: 0,
    zipcode: '',
    roadName: '',
    bgdCd: '',
    addressName: '',
    detailAddress: '',
    mainAddressNo: '',
    subAddressNo: '',
    longitude: '',
    latitude: '',
    amount: '',
    type: '',
    complexName: '',
    deposit: '',
    roomNo: '',
    bathNo: '',
    hasEv: '',
    porch: '',
    images: null,
    floor: '',
    totalFloor: '',
    description: '',
    parking: '',
    recentAmount: 0,
    recentDeposit: 0,
    hugNumber: '',
    hasSchool: false,
    hasConvenience: false,
    //
    mainAddressNo: '',
    subAddressNo: '',

    // ocrData
    uniqueNumber: '', // 고유번호
    openDate: '', // 열람일시
    address: '', // 건물명 주소
    attachment1: false, // 압류 여부
    attachment2: false, // 가압류 여부
    trust: false, // 신탁 여부
    auction: false, // 경매 여부
    loan: 0, // 근저당액 총액
    leaseAmount: 0, // 전세권 총액
});

const handleAddressSelected = (addressData) => {
    // Address 컴포넌트에서 emit된 데이터를 property에 저장
    property.zipcode = addressData.postcode;
    property.roadName = addressData.roadAddress;
    property.addressName = addressData.jibunAddress;
    property.subAddressNo = addressData.extraAddress;
    property.detailAddress = addressData.detailAddress;
    property.bgdCd = addressData.bcode;
    property.longitude = addressData.longitude;
    property.latitude = addressData.latitude;
    property.mainAddressNo = addressData.mainAddressNo;
    property.subAddressNo = addressData.subAddressNo;
    property.complexName = addressData.complexName;
    property.type = addressData.type;
    property.recentDeposit = addressData.recentDeposit;
    property.recentAmount = addressData.recentAmount;
};

const register = async () => {
    // 첨부파일
    if (images.value.files.length > 0) {
        property.images = images.value.files[0];
    }

    try {
        await propertyApi.create(property); // 매물 등록
        console.log(property);
        router.push({ name: 'Main' }); // 매물 등록 성공
    } catch (e) {
        console.error(e);
    }
};
</script>

<template>
    <div class="mt-5 mx-auto" style="width: 500px">
        <h1 class="my-5">매물등록 페이지</h1>

        <form @submit.prevent="register">
            <div class="m-3 p-2 cover">
                <div>
                    <div class="mb-3">
                        HUG 인증 번호
                        <input
                            type="text"
                            name="hugNumber"
                            id="hugNumber"
                            v-model="property.hugNumber"
                        />
                    </div>
                    <div class="mb-3">
                        건물등기
                        <form @submit.prevent="submitFile">
                            <input type="file" @change="handleFileChange" />
                            <!-- <button type="submit">OCR 분석 요청</button> -->
                        </form>
                    </div>
                    <!-- OCR 처리후 등기 고유번호 가져오기 -->
                    <div class="mb-3">
                        가격
                        <input
                            type="text"
                            name="amount"
                            id="amount"
                            placeholder="테스트시 int형태로 필수입력!!"
                            v-model="property.amount"
                        />
                        <span class="ms-2">(만원)</span
                        ><input
                            type="text"
                            name="deposit"
                            id="deposit"
                            placeholder="테스트시 int형태로 필수입력!!"
                            v-model="property.deposit"
                        /><span class="ms-2">(만원)</span>
                    </div>
                    <div class="mb-3">
                        주소
                        <AddressSearch
                            @addressSelected="handleAddressSelected"
                        />
                        <input
                            type="text"
                            id="detailAddress"
                            name="detailAddress"
                            v-model="property.detailAddress"
                            placeholder="상세주소"
                        />
                    </div>

                    <!-- <div class="mb-3">
          전용/공급면적 <input type="text" text-align="" placeholder="" />
          <span class="me-4"></span><input type="text" placeholder="" />
        </div> -->
                    <div class="mb-3"></div>
                    <div>
                        매물 사진
                        <input
                            type="file"
                            name="images"
                            ref="images"
                            id="images"
                            accept="image/png, image/jpeg"
                            multiple
                        />
                    </div>
                    <div class="mb-3">
                        방/욕실개수
                        <input
                            type="text"
                            name="roomNo"
                            id="roomNo"
                            placeholder="방"
                            v-model="property.roomNo"
                        />
                        <span class="me-4"></span
                        ><input
                            type="text"
                            name="bathNo"
                            id="bathNo"
                            placeholder="욕실"
                            v-model="property.bathNo"
                        />
                    </div>
                    <div class="mb-3">
                        해당층/전체층
                        <input
                            type="text"
                            name="floor"
                            id="floor"
                            placeholder="해당층"
                            v-model="property.floor"
                        />
                        <span class="me-4"></span
                        ><input
                            type="text"
                            name="totalFloor"
                            id="totalFloor"
                            placeholder="전체층"
                            v-model="property.totalFloor"
                        />
                    </div>
                </div>
                <!-- 오른쪽 -->
                <div class="">
                    <div class="mb-3">
                        주차가능여부
                        <label
                            class="form-check-label ms-5 me-3"
                            for="parkingY"
                        >
                            유
                        </label>
                        <input
                            class="form-check-input me-5"
                            type="radio"
                            name="parking"
                            id="parkingY"
                            value="true"
                            v-model="property.parking"
                        />
                        <label class="form-check-label me-3" for="parkingN">
                            무
                        </label>
                        <input
                            class="form-check-input"
                            type="radio"
                            name="parking"
                            id="parkingN"
                            value="false"
                            v-model="property.parking"
                        />
                    </div>
                    <!--  -->
                    <div class="mb-3">
                        엘리베이터 유무
                        <label class="form-check-label ms-5 me-3" for="hasEvY">
                            유
                        </label>
                        <input
                            class="form-check-input me-5"
                            type="radio"
                            name="hasEv"
                            id="hasEvY"
                            value="true"
                            v-model="property.hasEv"
                        />
                        <label class="form-check-label me-3" for="hasEvN">
                            무
                        </label>
                        <input
                            class="form-check-input"
                            type="radio"
                            name="hasEv"
                            id="hasEvN"
                            value="false"
                            v-model="property.hasEv"
                        />
                    </div>
                    <div class="mb-3">
                        현관 유형
                        <input
                            type="text"
                            name="porch"
                            id="porch"
                            v-model="property.porch"
                        />
                    </div>
                    <!-- checkBox -->
                    <div class="mb-3">
                        주변정보
                        <div>
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    name="hasConvenience"
                                    value="hasConvenience"
                                    id="hasConvenience"
                                    v-model="property.hasConvenience"
                                />
                                <label
                                    class="form-check-label"
                                    for="hasConvenience"
                                >
                                    편의점
                                </label>
                            </div>
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    name="hasSchool"
                                    value="hasSchool"
                                    id="hasSchool"
                                    v-model="property.hasSchool"
                                />
                                <label class="form-check-label" for="hasSchool">
                                    학교
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        설명<br /><textarea
                            class="textarea"
                            name="description"
                            id="description"
                            placeholder="내용을 입력해 주세요."
                            v-model="property.description"
                        ></textarea>
                    </div>
                    <div>
                        <button
                            type="submit"
                            class="btn btn-primary mt-4 right"
                        >
                            <i class="fa-solid fa-house-circle-check"></i>
                            등 록
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.cover {
    display: flex;
    justify-content: space-around;
}
.textarea {
    width: 100%;
    height: 6.25em;
    resize: none;
}
.right {
    float: right;
}
</style>
