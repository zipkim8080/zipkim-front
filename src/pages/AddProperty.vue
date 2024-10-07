<script setup>
import AddressSearch from '../components/tool/AddressSearch.vue';
import AptOpiAddress from '../components/AptOpiAddress.vue';
import { reactive, ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import propertyApi from '../api/PropertyRegiAPI';
import { requestWithFile } from '@/api/Ocr';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
const router = useRouter();
const images = ref(null);
const selectedFile = ref(null);
const previews = ref([]); // 이미지 미리보기 URL 배열 초기화
const fileName = ref('');

// 파일 선택 핸들러
const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type !== 'application/pdf') {
        toast('PDF 파일만 업로드할 수 있어요!', {
            theme: 'auto', // 테마(auto, light, dark, colored)
            type: 'error', // 타입(info, success, warning, error, default)
            position: 'top-center', //토스트 생성위치
            pauseOnHover: false, //마우스오버시 멈춤 제거
            autoClose: 1000, //자동닫기
            hideProgressBar: true, //로딩바제거
        });
        event.target.value = '';
        fileName.value = '';
    } else if (file) {
        selectedFile.value = file;
        fileName.value = file.name;
    }
};

// 파일 이미지 미리보기
const handleImageUpload = (event) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
        toast('파일을 선택해주세요!', {
            theme: 'auto', // 테마(auto, light, dark, colored)
            type: 'error', // 타입(info, success, warning, error, default)
            position: 'top-center', //토스트 생성위치
            pauseOnHover: false, //마우스오버시 멈춤 제거
            autoClose: 1000, //자동닫기
            hideProgressBar: true, //로딩바제거
        });
        return;
    }

    const allowedType = ['image/png', 'image/jpg', 'image/jpeg'];
    previews.value = []; // 기존 미리보기 초기화
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!allowedType.includes(file.type)) {
            toast('이미지 파일만 업로드할 수 있어요!', {
                theme: 'auto', // 테마(auto, light, dark, colored)
                type: 'error', // 타입(info, success, warning, error, default)
                position: 'top-center', //토스트 생성위치
                pauseOnHover: false, //마우스오버시 멈춤 제거
                autoClose: 1000, //자동닫기
                hideProgressBar: true, //로딩바제거
            });
            event.target.value = ''; // 파일 초기화
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            previews.value.push(e.target.result); // 파일의 URL을 배열에 추가
        };
        reader.readAsDataURL(files[i]); // 파일을 읽고 URL 생성
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

const property = reactive({
    complexId: '',
    roadName: '',
    bgdCd: '',
    addressName: '',
    detailAddress: '',
    mainAddressNo: '',
    subAddressNo: '',
    longitude: '',
    latitude: '',
    amount: '',
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
    hugNumber: '',
    hasSchool: false,
    hasConvenience: false,
    type: 'apt',
    // ocrData
    uniqueNumber: '7', // 고유번호
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
    property.roadName = addressData.roadAddress;
    property.addressName = addressData.jibunAddress;
    property.bgdCd = addressData.bcode;
    property.longitude = addressData.longitude;
    property.latitude = addressData.latitude;
    property.mainAddressNo = addressData.mainAddressNo;
    property.subAddressNo = addressData.subAddressNo;
    property.detailAddress = addressData.detailAddress;
    property.complexId = addressData.complexId;
};

const validationNumber = (event) => {
    const inputValue = event.target.value;

    if (!/^\d*$/.test(inputValue)) {
        toast(`숫자만 입력할 수 있어요!`, {
            theme: 'auto',
            type: 'error',
            position: 'top-center',
            pauseOnHover: false,
            autoClose: 1000,
            hideProgressBar: true,
        });
        event.target.value = '';
        return '';
    }

    if (parseInt(inputValue, 10) <= 0) {
        toast(`0 보다 큰 수만 입력할 수 있어요!`, {
            theme: 'auto',
            type: 'error',
            position: 'top-center',
            pauseOnHover: false,
            autoClose: 1000,
            hideProgressBar: true,
        });
        event.target.value = '';
        return '';
    }

    return inputValue;
};
const onRoomNoInput = (event) => {
    property.roomNo = validationNumber(event);
};

const onBathNoInput = (event) => {
    property.bathNo = validationNumber(event);
};

const onFloorInput = (event) => {
    property.floor = validationNumber(event);
};

const onTotalFloorInput = (event) => {
    property.totalFloor = validationNumber(event);
};

// 숫자를 3자리마다 쉼표를 추가하여 포맷하는 함수
const formatNumber = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 매매가 입력 처리 함수
const onAmountInput = (event) => {
    const inputValue = event.target.value;

    if (!/^\d*$/.test(inputValue.replace(/,/g, ''))) {
        toast('숫자만 입력할 수 있어요!', {
            theme: 'auto',
            type: 'error',
            position: 'top-center',
            pauseOnHover: false,
            autoClose: 1000,
            hideProgressBar: true,
        });
        event.target.value = ''; // 잘못된 입력 초기화
        return;
    }

    // 숫자일 경우
    property.amount = parseInt(inputValue.replace(/[^\d]/g, '')) || 0;
    event.target.value = formatNumber(property.amount); // 3자리 쉼표 포맷 적용
};

// 전세가 입력 처리 함수
const onDepositInput = (event) => {
    const inputValue = event.target.value;

    if (!/^\d*$/.test(inputValue.replace(/,/g, ''))) {
        toast('숫자만 입력할 수 있어요!', {
            theme: 'auto',
            type: 'error',
            position: 'top-center',
            pauseOnHover: false,
            autoClose: 1000,
            hideProgressBar: true,
        });
        event.target.value = ''; // 잘못된 입력 초기화
        return;
    }

    // 숫자일 경우
    property.deposit = parseInt(inputValue.replace(/[^\d]/g, '')) || 0;
    event.target.value = formatNumber(property.deposit); // 3자리 쉼표 포맷 적용
};

// 등록 버튼 클릭시
const register = async () => {
    // 첨부파일
    if (images.value.files.length > 0) {
        property.images = Array.from(images.value.files);
    }

    try {
        await propertyApi.create(property); // 매물 등록
        router.push({ name: 'Main' }); // 매물 등록 성공
        console.log(property);
    } catch (e) {
        console.log(property);
        console.error(e);
    }
};

// 창 닫기
const close = () => {
    router.push({ name: 'Main' });
};
</script>

<template>
    <div class="modal-content">
        <div class="mt-3 container">
            <div
                class="mb-5 cover"
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                "
            >
                <h1 style="text-align: center; color: #955a1f; flex-grow: 1">
                    <strong>매물 등록</strong>
                </h1>
                <button
                    style="
                        font-weight: bold;
                        font-size: 25px;

                        background-color: white;
                        height: 34px;
                        border: none;
                    "
                    @click="close"
                >
                    <i class="fa-solid fa-x"></i>
                </button>
            </div>

            <form @submit.prevent="register">
                <!--  -->
                <div class="cover mb-3">
                    <label class="subTitle">매물 유형</label>
                    <div>
                        <label class="form-check-label me-2" for="apt">
                            아파트
                        </label>
                        <input
                            class="form-check-input me-5"
                            type="radio"
                            name="type"
                            id="apt"
                            value="apt"
                            checked
                            v-model="property.type"
                        />
                        <label class="form-check-label me-2" for="opi">
                            오피스텔
                        </label>
                        <input
                            class="form-check-input me-5"
                            type="radio"
                            name="type"
                            id="opi"
                            value="opi"
                            v-model="property.type"
                        />
                        <label class="form-check-label me-2" for="dd">
                            단독다가구
                        </label>
                        <input
                            class="form-check-input me-5"
                            type="radio"
                            name="type"
                            id="dd"
                            value="dd"
                            v-model="property.type"
                        />
                        <label class="form-check-label me-2" for="yr">
                            연립다세대
                        </label>
                        <input
                            class="form-check-input"
                            type="radio"
                            name="type"
                            id="yr"
                            value="yr"
                            v-model="property.type"
                        />
                    </div>
                </div>
                <!--  -->
                <div class="cover mb-3">
                    <label class="subTitle">매물 주소</label>
                    <div>
                        <AptOpiAddress
                            v-if="
                                property.type === 'apt' ||
                                property.type === 'opi'
                            "
                            @addressSelected="handleAddressSelected"
                        />
                        <AddressSearch
                            v-else
                            @addressSelected="handleAddressSelected"
                        />
                    </div>
                </div>
                <!--  -->
                <!-- 여기 HUG인증번호가 뭔지 대략 설명하는 페이지 띄우는 버튼 있으면 좋겠다 -->
                <div class="cover mb-3">
                    <label for="hugNumber" class="subTitle"
                        >HUG 인증 번호</label
                    >
                    <div>
                        <input
                            type="text"
                            class="form-control"
                            name="hugNumber"
                            id="hugNumber"
                            placeholder="(선택 사항)"
                            v-model="property.hugNumber"
                        />
                    </div>
                </div>
                <!--  -->
                <div class="mb-3">
                    <form @submit.prevent="submitFile">
                        <label class="subTitle">건물 등기</label>
                        <input
                            type="file"
                            @change="handleFileChange"
                            accept=".pdf"
                        />
                        <!-- <button type="submit">OCR 분석 요청</button> -->
                    </form>
                </div>
                <!-- OCR 처리후 등기 고유번호 가져오기 -->
                <!--  -->
                <div class="mb-3">
                    <label class="subTitle">가격 정보</label>
                    <input
                        style="display: inline"
                        type="text"
                        class="form-control test"
                        name="amount"
                        id="amount"
                        placeholder="매매가"
                        @input="onAmountInput"
                        :value="
                            property.amount ? formatNumber(property.amount) : ''
                        "
                    />
                    <span class="ms-1 me-4" style="font-size: larger"
                        >(만원)</span
                    ><input
                        type="text"
                        style="display: inline"
                        class="form-control test"
                        name="deposit"
                        id="deposit"
                        placeholder="전세가"
                        @input="onDepositInput"
                        :value="
                            property.deposit
                                ? formatNumber(property.deposit)
                                : ''
                        "
                    />
                    <span class="ms-1" style="font-size: larger">(만원)</span>
                </div>
                <!--  -->
                <div class="cover twoText mb-3">
                    <div class="subTitle">
                        <label class="subTitle">해당/전체 층</label>
                    </div>
                    <div class="input-group">
                        <input
                            class="form-control"
                            type="text"
                            name="floor"
                            id="floor"
                            maxlength="5"
                            placeholder="해당층"
                            @input="onFloorInput"
                            :value="property.floor"
                        />
                        <input
                            class="form-control"
                            type="text"
                            name="totalFloor"
                            id="totalFloor"
                            placeholder="전체층"
                            @input="onTotalFloorInput"
                            :value="property.totalFloor"
                        />
                    </div>
                </div>
                <!--  -->
                <div class="cover twoText">
                    <div class="subTitle">
                        <label class="subTitle">방/욕실 개수</label>
                    </div>
                    <div class="input-group mb-3">
                        <input
                            class="form-control"
                            type="text"
                            name="roomNo"
                            id="roomNo"
                            placeholder="방"
                            @input="onRoomNoInput"
                            :value="property.roomNo"
                        />
                        <input
                            class="form-control"
                            type="text"
                            name="bathNo"
                            id="bathNo"
                            placeholder="욕실"
                            @input="onBathNoInput"
                            :value="property.bathNo"
                        />
                    </div>
                </div>
                <!--  -->
                <div class="cover mb-3">
                    <label class="subTitle">현관 타입</label>
                    <div>
                        <div class="cover mb-3">
                            <div>
                                <input
                                    class="form-check-input me-1"
                                    type="radio"
                                    name="porch"
                                    id="porch1"
                                    value="계단식"
                                    v-model="property.porch"
                                />
                                <label
                                    class="form-check-label me-4"
                                    for="porch1"
                                >
                                    계단식
                                </label>

                                <input
                                    class="form-check-input me-1"
                                    type="radio"
                                    name="porch"
                                    id="porch2"
                                    value="복도식"
                                    v-model="property.porch"
                                />
                                <label
                                    class="form-check-label me-4"
                                    for="porch2"
                                >
                                    복도식
                                </label>

                                <input
                                    class="form-check-input me-1"
                                    type="radio"
                                    name="porch"
                                    id="porch3"
                                    value="복합식"
                                    v-model="property.porch"
                                />
                                <label
                                    class="form-check-label me-4"
                                    for="porch3"
                                >
                                    복합식
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="cover mb-3">
                    <label class="subTitle">주차 가능 여부</label>
                    <div>
                        <input
                            class="form-check-input me-2"
                            type="radio"
                            name="parking"
                            id="parkingY"
                            value="true"
                            v-model="property.parking"
                        />
                        <label class="form-check-label me-5" for="parkingY">
                            유
                        </label>
                        <input
                            class="form-check-input me-2"
                            type="radio"
                            name="parking"
                            id="parkingN"
                            value="false"
                            v-model="property.parking"
                        />
                        <label class="form-check-label me-5" for="parkingN">
                            무
                        </label>
                    </div>
                </div>
                <!--  -->
                <div class="cover mb-3">
                    <label class="subTitle">엘리베이터 유무</label>
                    <div>
                        <input
                            class="form-check-input me-2"
                            type="radio"
                            name="hasEv"
                            id="hasEvY"
                            value="true"
                            v-model="property.hasEv"
                        />
                        <label class="form-check-label me-5" for="hasEvY">
                            유
                        </label>
                        <input
                            class="form-check-input me-2"
                            type="radio"
                            name="hasEv"
                            id="hasEvN"
                            value="false"
                            v-model="property.hasEv"
                        />
                        <label class="form-check-label me-5" for="hasEvN">
                            무
                        </label>
                    </div>
                </div>
                <!--  -->
                <div class="cover mb-3">
                    <label class="subTitle">주변 정보</label>
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
                            class="form-check-label ms-2 me-4"
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
                        <label
                            class="form-check-label ms-2 me-4"
                            for="hasSchool"
                        >
                            학교
                        </label>
                    </div>
                </div>
                <!--  -->
                <!-- 매물 사진 올리는 설명 있으면 좋을듯 -->
                <div class="cover mb-3 a">
                    <label class="subTitle">매물 사진</label>
                    <label class="imgPart me-5" for="images">사진 추가</label>
                    <input
                        type="file"
                        name="images"
                        id="images"
                        ref="images"
                        accept="image/png, image/jpeg, image/jpg"
                        multiple
                        @change="handleImageUpload"
                    />
                </div>
                <div class="cover mb-3">
                    <label class="subTitle"></label>
                    <div v-if="previews.length > 0" class="image-grid">
                        <div
                            v-for="(preview, index) in previews"
                            :key="index"
                            class="grid-item"
                        >
                            <img
                                :src="preview"
                                alt="미리보기 이미지"
                                class="preview-img"
                            />
                        </div>
                    </div>
                </div>

                <!--  -->
                <div class="cover">
                    <label class="subTitle">상세 설명</label
                    ><textarea
                        class="form-control textarea"
                        name="description"
                        id="description"
                        placeholder="내용을 입력해 주세요."
                        v-model="property.description"
                    ></textarea>
                </div>
                <!--  -->
                <div class="cover">
                    <span style="width: 567px"></span>
                    <button type="submit" class="btn btn-warning mt-4">
                        <i class="fa-solid fa-house-circle-check"></i>
                        등 록
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.cover {
    display: flex;
    /* flex-direction: column; */
}
.textarea {
    width: 478px;
    height: 240px;
    resize: none;
}
.subTitle {
    width: 170px;
    font-size: 18px;
    font-weight: bold;
}
.test {
    width: 177px;
}
.twoText {
    width: 310px;
}
.plus {
    font-size: 105px;
    text-align: center;
    padding: -100px;
}
.a .imgPart {
    text-align: center;
    font-size: 25px;
    border-radius: 10px;
    width: 150px;
    background-color: #f3b706;
}
.a input[type='file'] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
}
.image-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    border: 2px solid #f2d383;
    border-radius: 7px;
    padding: 7px;
}

.grid-item {
    width: 100px;
    height: 100px;
    overflow: relative;
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.modal-content {
    max-height: 815px; /* 최대 높이를 화면 높이의 80%로 설정 */
    overflow-y: auto; /* 세로 스크롤바가 필요할 때 생성 */
    padding: 20px; /* 패딩 추가 */
}
</style>
