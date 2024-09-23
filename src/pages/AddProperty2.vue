<template>
    <div>
        <h2>부동산 정보 추가</h2>
        <form @submit.prevent="submitFile">
            <input type="file" @change="handleFileChange" />
            <button type="submit">OCR 분석 요청</button>
        </form>

        <pre>uniqueNumber : {{ uniqueNumber }}</pre>
        <pre>openDate : {{ openDate }}</pre>
        <pre>address : {{ address }}</pre>
        <pre>loan : {{ loan }}</pre>
    </div>
</template>

<script>
import { requestWithFile } from '@/api/Ocr';

export default {
    data() {
        return {
            selectedFile: null,
            uniqueNumber: '', // 고유번호
            openDate: '', // 열람일시
            address: '', // 주소
            loan: '', // 근저당액 총액
            leaseAmount: '', // 전세권 총액
        };
    },
    methods: {
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedFile = file;
            }
        },
        async submitFile() {
            if (!this.selectedFile) {
                alert('파일을 선택하세요.');
                return;
            }

            try {
                // 고유번호와 열람일시만 받아옴
                const result = await requestWithFile(this.selectedFile);
                this.uniqueNumber = result.uniqueNumber;
                this.openDate = result.openDate;
                this.address = result.address;
                this.loan = result.loan;
                this.leaseAmount = result.leaseAmount;
                console.log('고유번호:', this.uniqueNumber);
                console.log('열람일시:', this.openDate);
                console.log('주소:', this.address);
                console.log('근저당총액', this.loan);
                console.log('전세권총액', this.leaseAmount);
            } catch (error) {
                console.error('OCR 처리 중 오류 발생:', error);
            }
        },
        async sendDataToServer() {
            try {
                if (this.uniqueNumber && this.openDate) {
                    const dataToSend = {
                        uniqueNumber: this.uniqueNumber,
                        openDate: this.openDate,
                    };
                    const response = await axios.post(
                        'http://localhost:8080/api/ocr-data',
                        dataToSend
                    );
                    console.log('서버로 전송된 데이터:', response.data);
                }
            } catch (error) {
                console.error('서버 전송 중 오류 발생:', error);
            }
        },
    },
};
</script>

<style scoped></style>
