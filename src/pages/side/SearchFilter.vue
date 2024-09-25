<template>
  <div class="input-group mb-3 ">
    <img src="@\assets\images\zipkimLogo.png" class="imgSize" />

    <input type="text" v-model="searchTerm" class="form-control" placeholder="아파트 또는 지역명으로 검색" @input="onInputChange"
      aria-label="Recipient's username" aria-describedby="button-addon2" />
    <button class="btn btn-outline-success" type="button" id="button-addon2">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>

  </div>
  <div>
    <button class="btn btn-success btn-lg me-2">아파트</button><button
      class="btn btn-success btn-lg me-2">오피스텔</button><button class="btn btn-success btn-lg me-2">단독다가구</button><button
      class="btn btn-success btn-lg">연립다세대</button>
  </div>
  <div class="suggestions">
    <ul v-if="suggestions?.length > 0">
      <li v-for="suggestion in suggestions" :key="suggestion.complexId" @click="selectItem(suggestion)">
        {{ suggestion.name }}
      </li>
    </ul>
  </div>


</template>
<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useKakaoMapStore } from '@/stores/KakaoMapStore';

const kakaoMapStore = useKakaoMapStore();
const searchTerm = ref('');    // 검색어
const suggestions = ref([]);   // 자동완성 목록
const timeout = ref(null);     // 입력 지연 타이머

const selectItem = (item) => {
  console.log(item.latitude, item.longitude)
  kakaoMapStore.reposition(item.latitude, item.longitude); // 아이템 좌표 전달
};
const onInputChange = () => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(async () => {
    if (searchTerm.value.length > 0) {
      suggestions.value = await fetchSuggestions(searchTerm.value);
    } else {
      suggestions.value = [];
    }
  }, 50); // 300ms 지연 후 API 호출
};
const fetchSuggestions = async (query) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/search?keyword=${query}&size=10`);
    return response.data.content;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }


};

</script>
<style scope>
.imgSize {
  width: 50px;
  height: 50px;
  margin-top: 5px;
  margin-bottom: 3px;
  margin-right: 10px;
  margin-left: 4px;
}

.suggestions {
  margin-top: 10px;
  position: absolute;
  background-color: inherit;

  border-radius: 5px;
  width: 100%;
}



.search-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  background-color: rgb(230, 240, 233);
  padding: 10px;
  border-radius: 5px;
}
</style>
