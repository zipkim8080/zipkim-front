<script setup>
import { ref } from 'vue';
import bookmark from '@/pages/auth/Bookmark.vue';
import forSale from '@/pages/auth/ForSale.vue';
import recent from '@/pages/auth/Recent.vue';
import sms from '@/pages/auth/SMS.vue';
import mypage from '@/pages/auth/MyPage.vue';

// 현재 열려 있는 항목을 저장하는 변수
const openSection = ref('mypage');

// 항목을 열고 닫는 함수
const toggleSection = (section) => {
  // 현재 열려 있는 항목과 클릭된 항목이 같으면 닫고, 다르면 새로운 항목을 연다.
  openSection.value = openSection.value === section ? '' : section;
};
</script>

<template>
  <div class="sidebar">
    <!-- <h1>마이 페이지</h1> -->
    <ul class="menu">
      <!-- 내 정보 항목 -->
      <li class="menu-item">
        <button
          @click="toggleSection('mypage')"
          class="menu-button"
          :class="{ active: openSection === 'mypage' }"
        >
          <i class="fa-regular fa-user"></i>
          내 정보
          <i v-if="openSection === 'mypage'" class="fa-solid fa-chevron-up"></i>
          <i v-else class="fa-solid fa-chevron-down"></i>
        </button>
        <transition name="slide-fade">
          <div v-show="openSection === 'mypage'" class="menu-content">
            <mypage @close="toggleSection('mypage')" />
          </div>
        </transition>
      </li>

      <!-- 즐겨찾기 항목 -->
      <li class="menu-item">
        <button
          @click="toggleSection('bookmark')"
          class="menu-button"
          :class="{ active: openSection === 'bookmark' }"
        >
          <i class="fa-regular fa-star"></i>
          즐겨찾기
          <i v-if="openSection === 'bookmark'" class="fa-solid fa-chevron-up"></i>
          <i v-else class="fa-solid fa-chevron-down"></i>
        </button>
        <transition name="slide-fade">
          <div v-show="openSection === 'bookmark'" class="menu-content">
            <bookmark @close="toggleSection('bookmark')" />
          </div>
        </transition>
      </li>

      <!-- 최근 본 매물 항목 -->
      <li class="menu-item">
        <button
          @click="toggleSection('recent')"
          class="menu-button"
          :class="{ active: openSection === 'recent' }"
        >
          <i class="fa-solid fa-clock-rotate-left"></i>
          최근 본 매물
          <i v-if="openSection === 'recent'" class="fa-solid fa-chevron-up"></i>
          <i v-else class="fa-solid fa-chevron-down"></i>
        </button>
        <transition name="slide-fade">
          <div v-show="openSection === 'recent'" class="menu-content">
            <recent @close="toggleSection('recent')" />
          </div>
        </transition>
      </li>

      <!-- 등록한 매물 항목 -->
      <li class="menu-item">
        <button
          @click="toggleSection('forSale')"
          class="menu-button"
          :class="{ active: openSection === 'forSale' }"
        >
          <i class="fa-solid fa-house"></i>
          등록한 매물
          <i v-if="openSection === 'forSale'" class="fa-solid fa-chevron-up"></i>
          <i v-else class="fa-solid fa-chevron-down"></i>
        </button>
        <transition name="slide-fade">
          <div v-show="openSection === 'forSale'" class="menu-content">
            <forSale @close="toggleSection('forSale')" />
          </div>
        </transition>
      </li>

      <!-- 휴대폰 본인인증 항목 -->
      <!-- <li class="menu-item">
        <button
          @click="toggleSection('sms')"
          class="menu-button"
          :class="{ active: openSection === 'sms' }"
        >
          <i class="fa-solid fa-mobile-screen"></i>
          휴대폰 본인인증
          <i v-if="openSection === 'sms'" class="fa-solid fa-chevron-up"></i>
          <i v-else class="fa-solid fa-chevron-down"></i>
        </button>
        <transition name="slide-fade">
          <div v-show="openSection === 'sms'" class="menu-content">
            <sms @close="toggleSection('sms')" />
          </div>
        </transition>
      </li> -->
    </ul>
  </div>
</template>

<style scoped>
/* sidebar 컨테이너 부분 */
.sidebar {
  position: fixed;
  top: 0%;
  right: 0%;
  width: 450px;
  height: 830px;
  background: #fff;
  /* padding: 20px; */
  border-radius: 10px;
  border: 1px solid #aaa;
}

.menu {
  position: fixed;
  left: 0%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  /* margin-bottom: 10px; */
  margin-left: 2px;
  width: 448px;
}

.menu-button {
  font-size: 1.2rem;
  width: 100%;
  height: 70px;
  text-align: left;
  padding: 10px;
  background: rgba(0, 0, 0, 0);
  border: 1px solid rgba(0, 0, 0, 0);
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
  border-radius: 10px;
}

.menu-button:hover {
  background-color: #f2d383;
}

.menu-button.active {
  font-weight: bold;
  background-color: #f3b706;
  /* color: #333; */
}

/* 버튼 글자 색 */
.menu-button:active,
.menu-button:focus {
  background-color: #f3b706;
  color: #333;
}

/* 클릭 시 content */
.menu-content {
  max-height: 548px;
  overflow-y: auto;
  padding: 20px 15px 20px 20px;
  /* border: 1px solid #ddd; */
  border-top: none;
  background: #fff;
}

/* 메뉴 스크롤 바 */
.menu-content::-webkit-scrollbar {
  height: auto;
  width: 6px;
}

.menu-content::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

/* 슬라이드와 페이드 효과 추가 */
.slide-fade-enter-active {
  transition: 0.7s;
}

.slide-fade-leave-to,
.slide-fade-enter-from {
  max-height: 0;
  /* opacity: 0; */
  padding: 0;
  /* .menu-content의 padding과 동일하게 설정해야 예쁨 */
  margin-left: 20px;
}
</style>
