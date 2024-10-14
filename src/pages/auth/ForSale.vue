<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from '@/api/index';
import { useLoginStore } from '@/stores/LoginStore.js';
import PropertyDetails from '@/pages/side/PropertyDetails.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const loginStore = useLoginStore();
const isModalOpen = ref(false);
const selectedPropertyId = ref(null);

// 매물 목록 데이터를 저장하는 propList 객체
const propList = reactive({
  items: [],
  pageable: '',
  totalElements: '',
  totalPages: '',
  numberOfElements: '',
});
const menuDisplay = ref(false); // 메뉴 표시 상태 관리

// 메뉴를 토글하는 함수
function toggleMenu(property) {
  propList.items.forEach((item) => {
    if (item.id === property.id) {
      item.menuDisplay = !item.menuDisplay; // 현재 매물의 menuDisplay를 토글
    } else {
      item.menuDisplay = false; // 다른 매물의 메뉴는 닫음
    }
  });
}

// 삭제 기능 함수
async function deleteItem(property) {
  try {
    await axios.post(`https://zipkimserver.store/api/delete/prop/${property.id}`);
    // await axios.post(`http://localhost:8080/api/delete/prop/${property.id}`);
    // propList에서 해당 매물을 제거
    propList.items = propList.items.filter((item) => item.id !== property.id);
    toast('매물이 삭제되었습니다!', {
      theme: 'auto', // 테마(auto, light, dark, colored)
      type: 'success', // 타입(info, success, warning, error, default)
      position: 'top-center', //토스트 생성위치
      pauseOnHover: false, //마우스오버시 멈춤 제거
      autoClose: 1000, //자동닫기
      hideProgressBar: true, //로딩바제거
    });
  } catch (error) {
    console.error('Failed to delete property:', error);
  }
}

// 모달 열기 함수
const openModal = (propertyId) => {
  selectedPropertyId.value = propertyId;
  isModalOpen.value = true;
};

// 사용자에 맞는 매물 목록을 불러오는 함수
const fetchProperties = async () => {
  try {
    const response = await axios.get(
      `https://zipkimserver.store/api/myprops/${loginStore.username}?page=${
        pageRequest.page - 1
      }&size=10`
      // `http://localhost:8080/api/myprops/${loginStore.username}?page=${pageRequest.page - 1}&size=1`
    );
    console.log(response);

    propList.items = response.data.content.map((item) => ({ ...item, menuDisplay: false })); // 각 매물에 menuDisplay 속성 추가
    propList.totalElements = response.data.totalElements;
    propList.totalPages = response.data.totalPages;
    propList.pageable = response.data.pageable;
    propList.numberOfElements = response.data.numberOfElements;
    console.log(propList.totalElements, propList.totalPages);
    console.log(propList.pageable);
  } catch (error) {
    console.error('Failed to fetch properties:', error);
  }
};

const handleBookMarkEvent = ({ id, isFavorite }) => {
  console.log('이벤트왓어요' + id, isFavorite);
  const property = props.propList.items.find((p) => p.id == id);
  property.isFavorite = isFavorite;
  // property.isFavorite = status;
  console.log(property);
};

// 즐겨찾기(북마크) 추가/해제 함수
async function bookMark(property) {
  try {
    if (property.isFavorite) {
      // 즐겨찾기 상태일 경우 해제 요청
      await axios.post(`https://zipkimserver.store/api/bookmark/delete`, {
        // await axios.post(`http://localhost:8080/api/bookmark/delete`, {
        propertyId: property.id,
      });
      property.isFavorite = false;
    } else {
      // 즐겨찾기 상태가 아닐 경우 추가 요청
      await axios.post(`https://zipkimserver.store/api/bookmark/add`, { propertyId: property.id });
      // await axios.post(`http://localhost:8080/api/bookmark/add`, { propertyId: property.id });
      property.isFavorite = true;
    }
  } catch (error) {
    console.error('Failed to toggle bookmark:', error);
  }
}

// 건물 유형을 한글로 변환하는 함수
function invertToKR(type) {
  const typeMap = {
    apt: '아파트',
    opi: '오피스텔',
    dd: '단독다가구',
    yr: '연립다세대',
  };
  return typeMap[type] || type;
}

const pageRequest = reactive({
  page: propList.pageable.pageNumber || 1,
});

const handlePageChange = async (pageNum, event) => {
  pageRequest.page = pageNum;
  await fetchProperties();
};

// 컴포넌트가 마운트될 때 매물 목록을 불러오기
onMounted(() => {
  loginStore.loadTokenFromCookies();
  fetchProperties();
});
</script>

<template>
  <div class="property-list">
    <!-- 매물 목록을 세로로 나열 -->
    <div v-for="property in propList.items" :key="property.id" class="content-box">
      <div class="image-box">
        <div class="img">
          <img style="width: 200px; height: 130px; border-radius: 5px" :src="property.imageUrl" />
        </div>
        <button @click="bookMark(property)" class="mark-checked">
          <i :class="property.isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
        </button>
      </div>
      <div class="Box">
        <div class="content" @click="openModal(property.id)">
          <div class="type">
            {{ invertToKR(property.type) }}
            <img v-if="property.hugNumber" class="check" src="@/assets/images/check.png" />
          </div>
          <div class="price">매매 {{ property.amount.toLocaleString() }} 만원</div>
          <div class="price">전세 {{ property.deposit.toLocaleString() }} 만원</div>
          <!-- <div class="where">{{ property.location }}</div> -->
          <div class="where">
            {{ property.complexName ? property.complexName + ' ' : '' }}{{ property.floor }}층
          </div>
        </div>
        <!-- 개별 매물에 대한 메뉴 및 삭제 버튼 -->
        <button class="menu" @click="toggleMenu(property)">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
        <button v-show="property.menuDisplay" class="delete-button" @click="deleteItem(property)">
          삭제
        </button>
      </div>
    </div>

    <!-- 모달 컴포넌트 -->
    <div v-if="isModalOpen">
      <PropertyDetails
        @bookMark="handleBookMarkEvent"
        @close="isModalOpen = false"
        :propId="selectedPropertyId"
      />
    </div>
  </div>
  <template v-if="propList.totalElements > 0">
    <div class="paginate">
      <vue-awesome-paginate
        :total-items="propList.totalElements"
        :items-per-page="propList.pageable.pageSize"
        :max-pages-shown="5"
        :show-ending-buttons="false"
        v-model="pageRequest.page"
        @click="handlePageChange"
      >
        <template #first-page-button><i class="fa-solid fa-backward-fast"></i></template>
        <template #prev-button><i class="fa-solid fa-caret-left"></i></template>
        <template #next-button><i class="fa-solid fa-caret-right"></i></template>
        <template #last-page-button><i class="fa-solid fa-forward-fast"></i></template>
      </vue-awesome-paginate>
    </div>
  </template>
</template>

<style scoped>
.paginate {
  margin-bottom: 13.5px;
}

.property-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.content-box {
  padding: 15px 0;
  display: flex;
  width: 400px;
  border-bottom: 0.1px solid #ccc;
  cursor: pointer;
}

.Box {
  position: relative;
  width: 185px;
  height: 130px;
}

.menu {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0);
  border: 0px;
}

.image-box {
  position: relative;
}

.check {
  height: 17px;
}

.mark-checked {
  position: absolute;
  left: 2px;
  top: 2px;
  border: none;
  background: rgba(0, 0, 0, 0);
  color: rgb(246, 60, 74);
  height: 10px;
  width: 10px;
  font-size: 24px;
}

.delete-button {
  position: absolute;
  border-radius: 5px;
  border: 1px, solid, rgba(0, 0, 0, 0);
  background: #e9e8e8;
  top: 25px;
  right: 8px;
  padding: 3px 10px;
  font-size: 18px;
  font-weight: 500;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.4); /* 그림자 추가 */
}

.delete-button:hover {
  background: #f4f4f4;
}

.price {
  font-size: 18px;
  font-weight: bold;
}

.where {
  font-size: 16px;
}

.content {
  margin-left: 15px;
}

.title {
  display: flex;
  justify-content: space-between;
}
</style>
