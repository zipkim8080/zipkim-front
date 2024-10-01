<script setup>
import { ref, computed } from 'vue';
import { requestWithFile } from '@/api/Ocr';
import { defineEmits } from 'vue';

const emit = defineEmits(['ocrCompleted', 'close']);
const selectedFile = ref(null);
const isLoading = ref(false);
const fileName = ref('');

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedFile.value = file;
        fileName.value = file.name;
    }
};

const submitFile = async () => {
    if (!selectedFile.value) {
        alert('파일을 선택하세요.');
        return;
    }

    isLoading.value = true;
    try {
        const result = await requestWithFile(selectedFile.value);
        if (result) {
            emit('ocrCompleted', result);
        }
    } catch (error) {
        console.error('OCR 처리 중 오류 발생:', error);
    } finally {
        isLoading.value = false;
    }
};

const triggerFileInput = () => {
    document.getElementById('file-input').click();
};

const isFileSelected = computed(() => !!selectedFile.value);
</script>

<template>
    <div class="modal-backdrop">
        <div class="modal-container" @click.stop>
            <button class="close-btn" @click="$emit('close')">
                <i class="fa-solid fa-x"></i>
            </button>
            <br />
            <h1 style="text-align: center; color: #955a1f">
                <strong>내 등기 확인하기</strong>
            </h1>
            <br />
            <div>
                <form>
                    <div class="filebox">
                        <label
                            for="file-input"
                            class="choose"
                            @click.prevent="triggerFileInput"
                            >파일 선택</label
                        >
                        <input
                            class="upload-name"
                            :value="fileName"
                            readonly
                            placeholder="파일을 올려주세요"
                        />
                        <input
                            type="file"
                            id="file-input"
                            @change="handleFileChange"
                            accept=".pdf"
                        />
                    </div>
                    <div style="color: red; font-size: 1em; margin-left: 6px">
                        정확한 인식을 위해 원본 pdf를 넣어주세요
                    </div>
                    <button
                        type="button"
                        class="checkdoc fs-5 mt-3"
                        @click="submitFile"
                        :disabled="!selectedFile || isLoading"
                        :class="{ 'file-selected': isFileSelected }"
                    >
                        {{ isLoading ? '처리 중...' : '내 등기 확인하기' }}
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    z-index: 1000;
}
.modal-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 10px;
    z-index: 1001;
    box-shadow: rgba(0, 0, 0, 0.2);
}
.checkdoc {
    background-color: #ffecb3;
    border: none;
    color: white;
    width: 500px;
    height: 50px;
    border-radius: 10px;
    margin: 5px;
    margin-bottom: 10px;
}
.file-selected {
    background-color: #f3b706;
}
.close-btn {
    border: none;
    background: none;
    margin-top: 8px;
    margin-right: 10px;
    padding: 0px;
    float: right;
}
.filebox .choose {
    border-radius: 8px 0 0 8px;
    margin: 5px;
    line-height: 20px;
}
.filebox .upload-name {
    display: inline-block;
    height: 40px;
    padding: 0 10px;
    vertical-align: middle;
    border: 1px solid #dddddd;
    width: 77%;
    color: #676767;
}
.filebox label {
    display: inline-block;
    padding: 10px 20px;
    color: #fff;
    vertical-align: middle;
    background-color: #717070;
    cursor: pointer;
    height: 40px;
    margin-left: 10px;
}
.filebox input[type='file'] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
}
</style>
