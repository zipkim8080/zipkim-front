<template>
    <div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useLoginStore } from '@/stores/LoginStore';
import Cookies from 'js-cookie';
const route = useRoute();
const queryParams = route.query; // 쿼리 파라미터 추출


const saveToken = () => {
    const token = queryParams.token; // 쿼리 파라미터에서 token 추출
    if (token) {
        // 쿠키에 token 저장
        Cookies.set('Authorization', token);
    } else {
        console.log('토큰이 쿼리 파라미터에 없습니다.');
    }
    window.location.href = '/'
};

saveToken()

</script>

<style scoped>
h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
}
</style>