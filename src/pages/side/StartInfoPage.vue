<script setup>
// import { useRouter, useRoute } from 'vue-router';
import { onMounted, watch } from 'vue';
import axios from 'axios';
</script>

<template>
    <div>
        <div class="cInfo-overlay">
            <div class="wrapWhite">
                <div>
                    <img
                        src="../../assets/images/fullLogo.png"
                        alt="내집킴이"
                        height="95px"
                        width="300px"
                    />
                </div>

                <!-- 1번 -->
                <div class="grayContent">
                    <div class="p-2" style="text-align: center">
                        <h5>전세가율? 한눈에 확인해요!</h5>
                    </div>
                    <div class="center">
                        <img
                            class="icondesc"
                            src="../../assets/images/icondesc.png"
                            alt="아이콘설명"
                        />
                    </div>
                    <div class="pt-4" style="text-align: center">
                        집킴이는 전세가율을 쉽게 보여줘요! <br />
                        실거래와 현매물의 전세가율을 한눈에 확인할 수 있어요
                    </div>
                    <div class="textBox" style="text-align: left">
                        전세가율이란? <br />
                        집의 매매 가격 대비 전세 보증금의 비율을 말해요
                        <br />깡통전세를 막기위해 70% 이상은 주의가 필요해요
                    </div>
                </div>

                <!-- 2번 -->
                <div class="grayContent">
                    <div class="p-1" style="text-align: center">
                        <h5>부동산 등기? 이제 어렵지 않아요!</h5>
                    </div>
                    <div>
                        <!-- 첫줄 -->
                        <div
                            class="d-flex justify-content-center align-items-center p-2"
                            style="gap: 15px; flex-wrap: wrap"
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
                                    style="margin-top: 5px; text-align: center"
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
                                    style="margin-top: 5px; text-align: center"
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
                                    style="margin-top: 5px; text-align: center"
                                >
                                    신탁
                                </div>
                            </div>
                        </div>
                        <div
                            class="d-flex justify-content-center align-items-center"
                            style="gap: 15px; flex-wrap: wrap"
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
                                        src="../../assets/images/auction.png"
                                        alt="경매개시결정"
                                        class="img-fluid"
                                    />
                                </div>
                                <div
                                    style="margin-top: 5px; text-align: center"
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
                                    style="margin-top: 5px; text-align: center"
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
                                    style="margin-top: 5px; text-align: center"
                                >
                                    근저당
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pt-4" style="text-align: center">
                        집킴이의 등기확인 기능을 통해 이제는 쉽게 <br />등기를
                        읽을 수 있어요
                    </div>
                    <div class="textBox" style="text-align: left">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        주의 <br />
                        집킴이는 성장중이라 100% 신뢰는 아직 어려워요 <br />
                        조금만 기다려주세요!
                    </div>
                </div>

                <!-- 1번 -->
                <div class="grayContent">
                    <div class="p-2" style="text-align: center">
                        <h5>부동산 매물? 한번 더 확인해요!</h5>
                    </div>
                    <div class="center">
                        <img
                            class="hugdesc"
                            src="../../assets/images/hugInfo.png"
                            alt="허그인증"
                        />
                    </div>
                    <div class="pt-4" style="text-align: center">
                        집킴이는 자세한 매물 정보를 제공해요! <br />
                        등기부와 HUG 인증번호를 통해 더 꼼꼼하게 알아봐요!
                    </div>
                    <div class="textBox" style="text-align: left">
                        HUG 인증번호란? <br />
                        주택도시보증공사에서 임대인에게 부여하는 번호로,
                        전세보증가입이 가능한 임대인임을 인증하는 번호에요
                    </div>
                </div>
                <div class="footer">
                    ⓒ 2024.KB_IT's_YOUR LIFE_8080 <br />
                    All rights reserved.
                </div>
            </div>
        </div>
    </div>
</template>

<style scope>
.footer {
    align-items: center;
    text-align: center;
    padding-top: 10px;
}
.hugdesc {
    height: 300px;
    /* padding: 20px; */
    border-radius: 15px;
}
.textBox {
    margin-top: 10px;
    padding-top: 20px;
    padding: 6px;
    border-radius: 10px;
    border: 5px solid white;
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
.icondesc {
    border-radius: 10px;
    height: 140px;
    width: 100%;
}
.grayContent {
    background-color: #f4f4f4;
    border-radius: 5%;
    width: 95%;
    padding: 5%;
    margin: 5px;
    align-items: center;
}

.wrapWhite {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px;
    background-color: white;
    width: 100%;
    height: 100%;
    padding: 5px;
    overflow-y: scroll;
}
.result-container::-webkit-scrollbar {
    display: none;
}

.cInfo-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10%;
    position: absolute;
    top: 168px;
    left: 20px;
    z-index: 10;
    background-color: #ffecb3;
    padding: 10px;
    border-radius: 5px;
    width: 471px;
    height: 82%;
}

.title {
    display: flex;
    justify-content: space-between;
    margin: 0;
}

.close-btn {
    border: none;
    background: none;
    margin-right: 10px;
    padding: 0px;
}

.login-title {
    flex: 1;
    text-align: center;
    margin: 0;
    padding-left: 30px;
    color: #955a1f;
}
</style>
