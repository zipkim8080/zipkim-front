<template>
  <div ref="autocompleteWrapper" class="input-group mb-3">
    <img src="@\assets\images\zipkimLogo.png" class="imgSize" />

    <input type="text" v-model="searchTerm" class=" searchBox " placeholder="아파트 또는 지역명으로 검색" @input="onInputChange"
      aria-label="Recipient's username" aria-describedby="button-addon2" />
    <button class="btn btn-outline-warning kb_btn" type="button" id="button-addon2">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>
  </div>
  <div>
    <button class="btn kb_btn btn-lg me-2">아파트</button><button class="btn btn-lg kb_btn me-2">오피스텔</button><button
      class="btn btn-lg kb_btn me-2">단독다가구</button><button class="btn kb_btn btn-lg">연립다세대</button>
  </div>
  <div class="complexSuggestion" v-if="complexSuggestion?.length > 0 && showDropdown">
    <h1>단지</h1>
    <ul>
      <li @click="selectItem(suggestion)" v-for="(suggestion, index) in complexSuggestion" :key="suggestion.complexId">
        <div class="suggestion-content">
          <div class="icon">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <p style="font-size: 20px; font-family: -apple-system" v-html="highlight(suggestion.name)"></p>
            <p style="font-size: 15px; color: #666; font-weight: 500" v-html="highlight(suggestion.addressName)"></p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';

const kakaoMapStore = useKakaoMapStore();
const searchTerm = ref(''); // 검색어
const complexSuggestion = ref([]); // 자동완성 목록
const timeout = ref(null); // 입력 지연 타이머
const showDropdown = ref(true);
const autocompleteWrapper = ref(null); // 자동완성 기능의 래퍼

// 다른 곳 클릭 시 드롭다운을 닫는 함수
const handleClickOutside = (event) => {
  // console.log(autocompleteWrapper.value)
  if (autocompleteWrapper.value && !autocompleteWrapper.value.contains(event.target)) {
    showDropdown.value = false; // 드롭다운 닫기
  } else {
    showDropdown.value = true;
  }
};

const highlight = (item) => {
  const regex = new RegExp(`(${searchTerm.value})`, 'gi');
  return item.replace(regex, '<mark>$1</mark>'); // 검색어 부분에 <mark> 태그 추가
};

const selectItem = (item) => {
  // console.log(item)
  // console.log(item.latitude, item.longitude)
  kakaoMapStore.reposition(item.latitude, item.longitude); // 아이템 좌표 전달
};

const onInputChange = async (e) => {
  searchTerm.value = e.target.value;
  complexSuggestion.value = await fetchcomplexSuggestion(searchTerm.value);
};
const fetchcomplexSuggestion = async (query) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/search?keyword=${query}&size=10`
    );
    return response.data.content;
  } catch (error) {
    console.error('Error fetching complexSuggestion:', error);
    return [];
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
</script>
<style scope>
.imgSize {
  width: 45px;
  height: 45px;
  margin-top: 5px;
  margin-bottom: 3px;
  margin-right: 10px;
  margin-left: 4px;
}

.searchBox {
  outline: none;
  border: var(--bs-border-width) solid var(--bs-border-color);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  flex: 1 1 auto;
}

.searchBox:focus {
  box-shadow: none;
  color: var(--bs-body-color);
  outline: 1px solid #f3b706;
  background-color: white;
  /* 그림자 효과 제거 (있을 경우) */
}

.icon {
  display: flex;
  height: 100%;
  color: #666;
  padding-bottom: 25px;
  margin-left: 10px;
  margin-right: 10px;
}

.suggestion-content {
  display: flex;
  align-items: center;
}

.complexSuggestion {
  margin-top: 10px;
  background-color: white;
  border: 1px solid #f3b706;
  max-height: 550px;
  border-radius: 5px;
  width: 100%;
  overflow-y: auto;
  /* 세로 방향 스크롤 허용 */
}

.kb_btn {
  background-color: #f3b706;
  border: none;
  color: white;
}

.kb_btn:hover,
:focus {
  background-color: #f2d383;
  color: white;
}

mark {
  background-color: transparent;
  color: #206ae5;
  padding: 0px;
  font-weight: normal;
}

.complexSuggestion ul {
  list-style-type: none;
  padding-left: 0;
}

.complexSuggestion li {
  padding-top: 10px;
}

.complexSuggestion p {
  margin-bottom: 2px;
  padding-left: 10px;
}

.complexSuggestion h1 {
  padding: 10px;
  color: rgb(34, 34, 34);
  font-size: 24px;
  line-height: 26px;
}

.search-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background-color: #ffecb3;
  padding: 10px;
  border-radius: 5px;
}
</style>
