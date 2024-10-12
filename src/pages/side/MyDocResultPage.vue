<script setup>
import { reactive, ref, computed, defineProps } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const props = defineProps(['ocrData']);

const price = ref(0); // 현 매물 매매가
const rentalPrice = ref(0); // 현 매물 전세가

// 계산된 근저당액(77%) 적용 - 1금융 120%, 2금융 130~140% 계산법 고려
const realLoan = computed(() => ocrData.loan * 0.77);

const emit = defineEmits(['close']);

// 위험도 계산
const result = computed(() => {
    if (price.value == 0 || rentalPrice.value == 0) {
        return 0;
    }
    return Math.floor(
        ((rentalPrice.value + realLoan.value) / price.value) * 100
    );
});

// 기본
const ocrData = reactive({ ...props.ocrData });

const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const onPriceInput = (event) => {
    const inputValue = event.target.value;

    if (!/^\d*$/.test(inputValue.replace(/,/g, ''))) {
        toast('숫자만 입력할 수 있어요!', {
            theme: 'auto', // 테마(auto, light, dark, colored)
            type: 'error', // 타입(info, success, warning, error, default)
            position: 'top-center', //토스트 생성위치
            pauseOnHover: false, //마우스오버시 멈춤 제거
            autoClose: 1000, //자동닫기
            hideProgressBar: true, //로딩바제거
        });
        event.target.value = '';
        return;
    }

    // 숫자일 경우
    price.value = parseInt(inputValue.replace(/[^\d]/g, '')) || 0; // 숫자만 유지
    event.target.value = formatNumber(price.value); // 포맷팅된 값을 다시 필드에 반영
};

const onRentalPriceInput = (event) => {
    const inputValue = event.target.value;

    if (!/^\d*$/.test(inputValue.replace(/,/g, ''))) {
        toast('숫자만 입력할 수 있어요!', {
            theme: 'auto', // 테마(auto, light, dark, colored)
            type: 'error', // 타입(info, success, warning, error, default)
            position: 'top-center', //토스트 생성위치
            pauseOnHover: false, //마우스오버시 멈춤 제거
            autoClose: 1000, //자동닫기
            hideProgressBar: true, //로딩바제거
        });
        event.target.value = '';
        return;
    }

    // 숫자일 경우
    rentalPrice.value = parseInt(inputValue.replace(/[^\d]/g, '')) || 0; // 숫자만 유지
    event.target.value = formatNumber(rentalPrice.value); // 포맷팅된 값을 다시 필드에 반영
};
</script>

<template>
    <div v-if="ocrData" class="modal-backdrop">
        <div class="result-container">
            <div class="mt-5 mx-auto" style="height: 80%; width: 500px">
                <div>
                    <div class="fs-1 text-center" style="color: #955a1f">
                        등기에서 확인된 내용이에요!
                    </div>
                    <br />
                    <div>
                        주소: <strong>{{ ocrData.address }}</strong>
                    </div>
                    <div>
                        등기번호: <strong>{{ ocrData.uniqueNumber }}</strong>
                    </div>
                    <div>
                        열람일시: <strong>{{ ocrData.openDate }}</strong>
                    </div>
                    <br />

                    <!-- 아무것도 없을 경우  -->
                    <div
                        v-if="
                            ocrData.attachment1 === false &&
                            ocrData.attachment2 === false &&
                            ocrData.trust === false &&
                            ocrData.auction === false &&
                            ocrData.loan === 0 &&
                            ocrData.leaseAmount === 0
                        "
                        class="row align-items-center p-3 rounded-start-5 rounded-end-5 mb-2"
                        style="background-color: #f4f4f4"
                    >
                        <div class="p-3">
                            <h4 class="text-center">
                                이 집의 등기는 깨끗해요!
                            </h4>
                            <h6 class="text-center">
                                우리 '집킴이'는 다음 내용들을 검사해요
                            </h6>
                            <br />
                            <div
                                class="d-flex justify-content-center align-items-center"
                                style="gap: 5px; flex-wrap: wrap"
                            >
                                <div
                                    class="d-flex flex-column align-items-center"
                                    style="width: 70px"
                                >
                                    <div
                                        class="rounded-circle overflow-hidden"
                                        style="width: 70px; height: 70px"
                                    >
                                        <img
                                            src="../../assets/images/attachment1.png"
                                            alt="압류"
                                            class="img-fluid"
                                        />
                                    </div>
                                    <div
                                        style="
                                            margin-top: 5px;
                                            text-align: center;
                                        "
                                    >
                                        압류
                                    </div>
                                </div>

                                <div
                                    class="d-flex flex-column align-items-center"
                                    style="width: 70px"
                                >
                                    <div
                                        class="rounded-circle overflow-hidden"
                                        style="width: 70px; height: 70px"
                                    >
                                        <img
                                            src="../../assets/images/attachment2.png"
                                            alt="가압류"
                                            class="img-fluid"
                                        />
                                    </div>
                                    <div
                                        style="
                                            margin-top: 5px;
                                            text-align: center;
                                        "
                                    >
                                        가압류
                                    </div>
                                </div>

                                <div
                                    class="d-flex flex-column align-items-center"
                                    style="width: 70px"
                                >
                                    <div
                                        class="rounded-circle overflow-hidden"
                                        style="width: 70px; height: 70px"
                                    >
                                        <img
                                            src="../../assets/images/trust.png"
                                            alt="신탁"
                                            class="img-fluid"
                                        />
                                    </div>
                                    <div
                                        style="
                                            margin-top: 5px;
                                            text-align: center;
                                        "
                                    >
                                        신탁
                                    </div>
                                </div>

                                <div
                                    class="d-flex flex-column align-items-center"
                                    style="width: 70px"
                                >
                                    <div
                                        class="rounded-circle overflow-hidden"
                                        style="width: 70px; height: 70px"
                                    >
                                        <img
                                            src="../../assets/images/auction.png"
                                            alt="경매개시결정"
                                            class="img-fluid"
                                        />
                                    </div>
                                    <div
                                        style="
                                            margin-top: 5px;
                                            text-align: center;
                                        "
                                    >
                                        경매
                                    </div>
                                </div>

                                <div
                                    class="d-flex flex-column align-items-center"
                                    style="width: 70px"
                                >
                                    <div
                                        class="rounded-circle overflow-hidden"
                                        style="width: 70px; height: 70px"
                                    >
                                        <img
                                            src="../../assets/images/leaseAmount.png"
                                            alt="전세권"
                                            class="img-fluid"
                                        />
                                    </div>
                                    <div
                                        style="
                                            margin-top: 5px;
                                            text-align: center;
                                        "
                                    >
                                        전세권
                                    </div>
                                </div>

                                <div
                                    class="d-flex flex-column align-items-center"
                                    style="width: 70px"
                                >
                                    <div
                                        class="rounded-circle overflow-hidden"
                                        style="width: 70px; height: 70px"
                                    >
                                        <img
                                            src="../../assets/images/loan.png"
                                            alt="근저당"
                                            class="img-fluid"
                                        />
                                    </div>
                                    <div
                                        style="
                                            margin-top: 5px;
                                            text-align: center;
                                        "
                                    >
                                        근저당
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="text-center p-2">
                            <p>
                                해당 등기에서는 위의 항목과 관련된 내용이
                                없어요!
                            </p>
                        </div>
                    </div>
                    <!-- 경매개시 내역 -->
                    <div
                        v-if="ocrData.auction === true"
                        class="row align-items-center p-3 rounded-start-5 rounded-end-5 mb-2"
                        style="
                            background-color: #f4f4f4;
                            border: 4px solid red;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        "
                    >
                        <div class="col-auto d-flex align-items-center">
                            <div
                                class="rounded-circle overflow-hidden"
                                style="width: 70px; height: 70px"
                            >
                                <img
                                    src="../../assets/images/auction.png"
                                    alt="경매"
                                    class="img-fluid"
                                />
                            </div>
                        </div>
                        <div class="col-7">
                            <p class="mb-0">
                                <span class="fw-bold"
                                    >경매개시결정 내역 발견!</span
                                >
                                <br />
                                경매를 진행한다는 것을 의미해요<br /><u
                                    >계약 자체를 고려하지 않는 것이 안전해요</u
                                >
                            </p>
                        </div>
                        <div class="col-auto d-flex align-items-center">
                            <div class="danger">주의!</div>
                        </div>
                    </div>

                    <!-- 압류 내역 -->
                    <div
                        v-if="ocrData.attachment1 === true"
                        class="row align-items-center p-3 rounded-start-5 rounded-end-5 mb-2"
                        style="background-color: #f4f4f4"
                    >
                        <div class="col-auto">
                            <div
                                class="rounded-circle overflow-hidden"
                                style="width: 70px; height: 70px"
                            >
                                <img
                                    src="../../assets/images/attachment1.png"
                                    alt="압류"
                                    class="img-fluid"
                                />
                            </div>
                        </div>
                        <div class="col">
                            <p class="mb-0">
                                <span class="fw-bold">압류 내역 발견!</span>
                                <br />
                                채무자의 재산이 밧줄로 꽁꽁 묶인 상태를
                                의미해요<br />경매에 넘어가기 직전이라
                                <u>계약을 피하는게 안전해요</u>
                            </p>
                        </div>
                    </div>

                    <!-- 가압류 내역 -->
                    <div
                        v-if="ocrData.attachment2 === true"
                        class="row align-items-center p-3 rounded-start-5 rounded-end-5 mb-2"
                        style="background-color: #f4f4f4"
                    >
                        <div class="col-auto">
                            <div
                                class="rounded-circle overflow-hidden"
                                style="width: 70px; height: 70px"
                            >
                                <img
                                    src="../../assets/images/attachment2.png"
                                    alt="가압류"
                                    class="img-fluid"
                                />
                            </div>
                        </div>
                        <div class="col">
                            <p class="mb-0">
                                <span class="fw-bold">가압류 내역 발견!</span>
                                <br />
                                채무자의 재산이 임시적으로 묶인 상태를
                                의미해요<br />경매로 넘어갈 수 있어
                                <u>계약을 피하는게 안전해요</u>
                            </p>
                        </div>
                    </div>

                    <!-- 신탁 내역 -->
                    <div
                        v-if="ocrData.trust === true"
                        class="row align-items-center p-3 rounded-start-5 rounded-end-5 mb-2"
                        style="background-color: #f4f4f4"
                    >
                        <div class="col-auto">
                            <div
                                class="rounded-circle overflow-hidden"
                                style="width: 70px; height: 70px"
                            >
                                <img
                                    src="../../assets/images/trust.png"
                                    alt="신탁"
                                    class="img-fluid"
                                />
                            </div>
                        </div>
                        <div class="col">
                            <p class="mb-0">
                                <span class="fw-bold">신탁 내역 발견!</span>
                                <br />
                                관리 편의를 위해 소유권을 신탁회사로 넘긴 것을
                                의미해요<br />신탁회사와 계약한다면 문제 없어요
                            </p>
                        </div>
                    </div>

                    <!-- 전세권 내역 -->
                    <div
                        v-if="ocrData.leaseAmount !== 0"
                        class="row align-items-center p-3 rounded-start-5 rounded-end-5 mb-2"
                        style="background-color: #f4f4f4"
                    >
                        <div class="col-auto">
                            <div
                                class="rounded-circle overflow-hidden"
                                style="width: 70px; height: 70px"
                            >
                                <img
                                    src="../../assets/images/leaseAmount.png"
                                    alt="전세권"
                                    class="img-fluid"
                                />
                            </div>
                        </div>
                        <div class="col">
                            <p class="mb-0">
                                <span class="fw-bold"
                                    >전세권
                                    {{ ocrData.leaseAmount.toLocaleString() }}원
                                    발견!</span
                                >
                                <br />
                                보증금을 지키기위해 설정하는 권리를 의미해요
                                <br />계약시 <u>전세권 말소 조건</u>을
                                확인해야해요
                            </p>
                        </div>
                    </div>

                    <!-- 근저당권 내역 -->
                    <div
                        v-if="ocrData.loan !== 0"
                        class="row align-items-center p-3 rounded-start-5 rounded-end-5 mb-2"
                        style="background-color: #f4f4f4"
                    >
                        <div class="col-auto">
                            <div
                                class="rounded-circle overflow-hidden"
                                style="width: 70px; height: 70px"
                            >
                                <img
                                    src="../../assets/images/loan.png"
                                    alt="경매"
                                    class="img-fluid"
                                />
                            </div>
                        </div>
                        <div class="col">
                            <p class="mb-0">
                                <span class="fw-bold"
                                    >근저당액
                                    {{ ocrData.loan.toLocaleString() }}
                                    원 발견!</span
                                >
                                <br />
                                이 집을 담보로 대출을 받은 금액을 의미해요<br />
                                <u>근저당액을 고려한 매매가 대비 전세가</u>를
                                확인해야해요
                            </p>
                        </div>

                        <div>
                            <br /><br />
                            <strong> 근저당액이 안전한지 확인해봐요!</strong
                            ><br />
                            <span style="color: red"
                                >정확한 계산을 위해 근저당액의 77%를
                                적용했어요</span
                            ><br /><br />

                            <form>
                                이 집 매매가는
                                <input
                                    class="input-box"
                                    type="text"
                                    placeholder="매매가"
                                    :value="price ? price.toLocaleString() : ''"
                                    @input="onPriceInput"
                                />
                                원 이에요. <br />
                                제시된 전세가는
                                <input
                                    class="input-box"
                                    type="text"
                                    placeholder="예상되는 전세가"
                                    :value="
                                        rentalPrice
                                            ? rentalPrice.toLocaleString()
                                            : ''
                                    "
                                    @input="onRentalPriceInput"
                                />
                                원 이에요.
                            </form>
                            <hr />
                            <div v-if="price !== 0 && rentalPrice !== 0">
                                <!-- 근저당액 비율 다시 생각하기  -->
                                <div v-if="result >= 70">
                                    <span style="color: red"
                                        >{{ result }}%</span
                                    >
                                    <br />
                                    <strong>위험성이 높아요!</strong><br />
                                    매매가 대비 대출이 많아서 전세금을 돌려받지
                                    못할 확률이 커요..
                                </div>
                                <div v-else-if="result > 50 && result < 70">
                                    <span style="color: orange"
                                        >{{ result }}%</span
                                    >
                                    <br />
                                    <strong>주의가 필요해요!</strong><br />
                                    아직은 괜찮지만 근저당이 추가될 경우
                                    위험성이 증가될 수 있어요
                                </div>
                                <div v-else>
                                    <span style="color: green"
                                        >{{ result }}%</span
                                    >
                                    <br />
                                    <strong>안정적인 상태에요! </strong><br />
                                    언제든지 근저당이 추가될수 있으니 항상
                                    주의해야해요!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 닫기 버튼 -->
            <button
                @click="$emit('close')"
                class="kb_btn m-4"
                style="width: 550px"
            >
                <strong>확인했어요!</strong>
            </button>
        </div>
    </div>
</template>

<style scoped>
.danger {
    text-align: center;
    background-color: red;
    color: white;
    padding: 10px 20px;
    font-size: 1.3em;
    font-weight: bold;
    white-space: nowrap;
    border-radius: 10px;
}
/* 1조 길이 */
.input-box {
    width: 165px;
}
.modal-backdrop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 15;
    display: flex;
}
/* 모달 크기 */
.result-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    max-width: 650px;
    max-height: 85%;
    margin: auto; /* 가운데 정렬 */
    overflow-y: scroll;
}
.result-container::-webkit-scrollbar {
    display: none;
}
/* 이미지 컨테이너 */
.rounded-circle {
    border: 2px solid #d0d0d0; /* 테두리 */
}
/* 텍스트 스타일 */
p {
    font-size: 16px; /* 텍스트 크기 */
    color: #333; /* 텍스트 색상 */
}
</style>
