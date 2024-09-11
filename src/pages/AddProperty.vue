<script setup>
import Address from '../components/tool/Address.vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import propertyApi from '@/api/Property';

const router = useRouter();
const images = ref(null);

// const disableSubmit = ref(true); // 필수 사항 입력 전 까지 submit 못하게

const property = reactive({
  brokerId: 1,
  zipcode: '',
  roadName: '',
  bgdCd: '',
  addressName: '',
  mainAddressNo: '',
  subAddressNo: '',
  longitude: '',
  latitude: '',
  amount: '',
  deposit: '',
  roomNo: '',
  bathNo: '',
  hasEv: false,
  porch: '',
  images: null,
  floor: 1,
  totalFloor: 1,
  description: '',
  parking: false,
  recentAmount: '',
  recentDeposit: '',
  hugNumber: '',
  hasSchool: false,
  hasConvenience: false,
  registerUniqueNum: '',
});

const register = async () => {
  // 첨부파일
  if (images.value.files.length > 0) {
    property.images = images.value.files[0];
  }

  try {
    console.log(property);

    await propertyApi.create(property); // 매물 등록
    router.push({ name: 'Map' }); // 매물 등록 성공
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="mt-5 mx-auto" style="width: 500px">
    <h1 class="my-5">매물등록 페이지</h1>

    <form @submit.prevent="register">
      <div class="m-3 p-2 cover">
        <div>
          <div class="mb-3">
            HUG 인증 번호
            <input type="text" name="hugNumber" id="hugNumber" />
          </div>
          <div class="mb-3">
            건물등기
            <input
              type="text"
              name="registerUniqueNum"
              id="registerUniqueNum"
            />
          </div>
          <!-- OCR 처리후 등기 고유번호 가져오기 -->
          <div class="mb-3">
            가격
            <input type="text" name="amount" id="amount" placeholder="매매" />
            <span class="me-4"></span
            ><input
              type="text"
              name="deposit"
              id="deposit"
              placeholder="전세"
            />
          </div>
          <div class="mb-3">
            주소
            <Address />
          </div>

          <!-- <div class="mb-3">
          전용/공급면적 <input type="text" text-align="" placeholder="" />
          <span class="me-4"></span><input type="text" placeholder="" />
        </div> -->
          <div class="mb-3"></div>
          <div>
            매물 사진
            <input
              type="file"
              name="images"
              ref="images"
              id="images"
              multiple
            />
          </div>
          <div class="mb-3">
            방/욕실갯수
            <input type="text" name="roomNo" id="roomNo" placeholder="방" />
            <span class="me-4"></span
            ><input type="text" name="bathNo" id="bathNo" placeholder="욕실" />
          </div>
          <div class="mb-3">
            해당층/전체층
            <input type="text" name="floor" id="floor" placeholder="해당층" />
            <span class="me-4"></span
            ><input
              type="text"
              name="totalFloor"
              id="totalFloor"
              placeholder="전체층"
            />
          </div>
        </div>
        <!-- 오른쪽 -->
        <div class="">
          <div class="mb-3">
            건물주차대수
            <input type="text" name="amount" id="amount" placeholder="" />
          </div>
          <!-- 주차가능여부 -->
          <div class="mb-3">
            주차가능여부
            <label class="form-check-label ms-5 me-3" for="parking"> 유 </label>
            <input
              class="form-check-input me-5"
              type="radio"
              name="parking"
              id="parking"
            />
            <label class="form-check-label me-3" for="parking0"> 무 </label>
            <input
              class="form-check-input"
              type="radio"
              name="parking"
              id="parking0"
            />
          </div>
          <!--  -->
          <div class="mb-3">
            엘리베이터 유무
            <label class="form-check-label ms-5 me-3" for="hasEv"> 유 </label>
            <input
              class="form-check-input me-5"
              type="radio"
              name="hasEv"
              id="hasEv"
            />
            <label class="form-check-label me-3" for="hasEv0"> 무 </label>
            <input
              class="form-check-input"
              type="radio"
              name="hasEv"
              id="hasEv0"
            />
          </div>
          <div class="mb-3">
            현관 유형
            <input type="text" name="porch" id="porch" placeholder="" />
          </div>
          <!-- checkBox -->
          <div class="mb-3">
            주변정보
            <div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="hasConvenience"
                  value="hasConvenience"
                  id="hasConvenience"
                />
                <label class="form-check-label" for="hasConvenience">
                  편의점
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="hasSchool"
                  value="hasSchool"
                  id="hasSchool"
                />
                <label class="form-check-label" for="hasSchool"> 학교 </label>
              </div>
            </div>
          </div>
          <div>
            설명<br /><textarea
              class="textarea"
              name="description"
              id="description"
              placeholder="내용을 입력해 주세요."
            ></textarea>
          </div>
          <div>
            <button type="submit" class="btn btn-primary mt-4 right">
              <i class="fa-solid fa-house-circle-check"></i>
              등 록
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.cover {
  display: flex;
  justify-content: space-around;
}
.textarea {
  width: 100%;
  height: 6.25em;
  resize: none;
}
.right {
  float: right;
}
</style>
