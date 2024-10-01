<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginButton from '../components/button/LoginButton.vue';
import SearchFilter from '../pages/side/SearchFilter.vue';
import KakaoMap from '../components/tool/KaKaoMap.vue';
import XXDongButton from '../components/button/xxDongButton.vue';
import CheckMyDoc from '@/pages/side/CheckMyDoc.vue';
import MyDocResultPage from '@/pages/side/MyDocResultPage.vue';

const router = useRouter();
//기본
const ocrData = ref(null);
const showModal = ref(false);

// 단순 페이지 이동 //
const regi = () => {
    router.push({
        path: '/add',
    });
};

const handleOcrCompleted = (result) => {
    ocrData.value = result;
    showModal.value = false;
};
</script>
<template>
    <div class="search-overlay">
        <SearchFilter />
    </div>
    <LoginButton />
    <XXDongButton />
    <!-- 매물 등록 버튼 -->
    <div class="register-overlay">
        <input class="kb_btn" type="button" value="매물 등록" @click="regi()" />
    </div>
    <!-- 등기 확인 버튼 -->
    <div class="register-overlay2">
        <input
            class="kb_btn"
            type="button"
            value="등기 확인"
            @click="showModal = true"
        />
    </div>

    <!-- 모달 백드롭 -->
    <div
        v-if="showModal"
        class="modal-backdrop"
        @click="showModal = false"
    ></div>

    <!-- CheckMyDoc 모달 -->
    <CheckMyDoc
        v-if="showModal"
        @ocrCompleted="handleOcrCompleted"
        @close="showModal = false"
    />

    <!-- MyDocResultPage 모달 -->
    <MyDocResultPage
        v-if="ocrData"
        :ocrData="ocrData"
        @close="ocrData = null"
    />

    <KakaoMap class="kakao-map" />
</template>

<style scoped>
.register-overlay {
    position: absolute;
    bottom: 2%;
    right: 1%;
    z-index: 9;
}

.register-overlay2 {
    position: absolute;
    bottom: 2%;
    right: 1%;
    transform: translateX(-110%);
    z-index: 9;
}

.modal-backdrop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 15;
}
</style>
