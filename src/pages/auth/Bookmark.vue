<script setup>
import { defineEmits } from 'vue';
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/LoginStore.js';
import PropertyDetails from '@/pages/side/PropertyDetails.vue';
import PropertyList from '@/components/detail/PropertyList.vue';

const LoginStore = useLoginStore();
const un = LoginStore.loadUsernameFromToken();
const isModalOpen = ref(false);
const selectedPropertyId = ref(null);
const props = defineProps({
  propList: Object,
});

const openModal = (propertyId) => {
  selectedPropertyId.value = propertyId;
  isModalOpen.value = true;
};

const propList = reactive({
  items: [],
  pageable: '', //현재 페이지정보
  totalElements: '', // 총 아이템수
  totalPages: '', //총 페이지
  numberOfElements: '', //현재페이지 아이템수
});
const handlePageChange = async (pageNum, event) => {
  pageRequest.page = pageNum;
  await fetchBookMarks();
};

const pageRequest = reactive({
  page: propList.pageable.pageNumber || 1,
});

const emit = defineEmits(['close']);

const fetchBookMarks = async () => {
  try {
    const props = await axios.get(
      `https://zipkimserver.store/api/bookmark/list?page=${
        pageRequest.page - 1
      }&size=2`
    );
    propList.items = props.data.content;
    propList.pageable = props.data.pageable;
    propList.totalElements = props.data.totalElements;
    propList.totalPages = props.data.totalPages;
    propList.numberOfElements = props.data.numberOfElements;
    console.log(props);
  } catch (error) {}
};

defineExpose({ fetchBookMarks });

const handleClose = () => {
  emit('close');
};

const handleBookmarkClick = () => {
  fetchBookMarks();
  console.log('Username : ', bookMarks.value);
};

onMounted(() => {
  fetchBookMarks();
});
</script>

<template>
  <PropertyList :propList="propList" />
  <template v-if="propList.totalElements > 0">
    <div class="paginate">
      <vue-awesome-paginate
        :total-items="propList.totalElements"
        :items-per-page="propList.pageable.pageSize"
        :max-pages-shown="propList.totalPages"
        :show-ending-buttons="false"
        v-model="pageRequest.page"
        @click="handlePageChange"
      >
        <template #first-page-button
          ><i class="fa-solid fa-backward-fast"></i
        ></template>
        <template #prev-button><i class="fa-solid fa-caret-left"></i></template>
        <template #next-button
          ><i class="fa-solid fa-caret-right"></i
        ></template>
        <template #last-page-button
          ><i class="fa-solid fa-forward-fast"></i
        ></template>
      </vue-awesome-paginate>
    </div>
  </template>
</template>

<style scoped>
.image-box {
  position: relative;
}

.bookMark-test {
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

.mark-nonChecked {
  position: absolute;
  left: 2px;
  top: 2px;
  border: none;
  background: rgba(0, 0, 0, 0);
  height: 10px;
  width: 10px;
  font-size: 24px;
}

.mark-checked {
  position: absolute;
  left: 2px;
  top: 2px;
  border: none;
  background: rgba(0, 0, 0, 0);
  color: #f3b706;
  height: 10px;
  width: 10px;
  font-size: 24px;
}

.content-box {
  padding: 15px 0px;
  display: flex;
  width: 400px;
  /* border-top: 0.5px solid #ccc; */
  border-bottom: 0.1px solid #ccc;
}

.check {
  height: 17px;
}

.price {
  /* font-size: 1.5rem; */
  font-size: 18px;
  font-weight: bold;
}

.where {
  font-size: 16px;
}

.word {
  color: #7f7e7e;
}

.content {
  margin-left: 15px;
}

.title {
  display: flex;
  justify-content: space-between;
}

.close-btn {
  border: none;
  background: none;
  margin-right: 20px;
  padding: 0px;
}
</style>
