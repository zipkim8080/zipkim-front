<template>
  <div class="m-3 p-2 cover">
    <div>
      <div class="container mb-3">메물등록 페이지</div>
      <div class="mb-3">중계사 번호 <input type="text" name="" id="" /></div>
      <div class="mb-3">HUG 인증 번호 <input type="text" name="" id="" /></div>
      <div class="mb-3">건물등기 <input type="file" /></div>
      <div class="mb-3">전화번호 <input type="text" /></div>
      <div class="mb-3">
        가격 <input type="text" text-align="" placeholder="매매" />
        <span class="me-4"></span><input type="text" placeholder="전세" />
      </div>
      <div class="mb-3">
        주소
        <input type="text" id="sample4_postcode" placeholder="우편번호" />
        <input
          type="button"
          onclick="sample4_execDaumPostcode()"
          value="우편번호 찾기"
        /><br />
        <input type="text" id="sample4_roadAddress" placeholder="도로명주소" />
        <input type="text" id="sample4_jibunAddress" placeholder="지번주소" />
        <span id="guide" style="color: #999; display: none"></span><br />
        <input type="text" id="sample4_detailAddress" placeholder="상세주소" />
        <input type="text" id="sample4_extraAddress" placeholder="참고항목" />
      </div>

      <div class="mb-3">
        전용/공급면적 <input type="text" text-align="" placeholder="" />
        <span class="me-4"></span><input type="text" placeholder="" />
      </div>
      <div class="mb-3">
        보증금/관리비 <input type="text" text-align="" placeholder="보증금" />
        <span class="me-4"></span><input type="text" placeholder="관리비" />
      </div>
      <div>매물 사진 <input type="file" name="" id="" multiple /></div>
    </div>
    <!-- 오른쪽 -->
    <div class="">
      <div class="mb-3">
        방/욕실갯수 <input type="text" text-align="" placeholder="방" />
        <span class="me-4"></span><input type="text" placeholder="욕실" />
      </div>
      <div class="mb-3">
        해당층/전체층 <input type="text" text-align="" placeholder="" />
        <span class="me-4"></span><input type="text" placeholder="" />
      </div>
      <div class="mb-3">
        건물주차대수 <input type="text" text-align="" placeholder="" />
      </div>
      <div class="mb-3">
        엘리베이터 유무
        <label class="form-check-label ms-5 me-3" for="flexRadioDefault1">
          유
        </label>
        <input
          class="form-check-input me-5"
          type="radio"
          name="flexRadioDefault"
          id="flexRadioDefault1"
        />
        <label class="form-check-label me-3" for="flexRadioDefault2">
          무
        </label>
        <input
          class="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="flexRadioDefault2"
        />
      </div>
      <div class="mb-3">
        현관 유형
        <label class="form-check-label ms-5 me-3" for="flexRadioDefault1">
          복도식
        </label>
        <input
          class="form-check-input me-5"
          type="radio"
          name="flexRadioDefault"
          id="flexRadioDefault1"
        />
        <label class="form-check-label me-3" for="flexRadioDefault2">
          계단식
        </label>
        <input
          class="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="flexRadioDefault2"
        />
        <label class="form-check-label ms-5 me-3" for="flexRadioDefault2">
          복합식
        </label>
        <input
          class="form-check-input"
          type="radio"
          name="flexRadioDefault"
          id="flexRadioDefault2"
        />
      </div>
      <!-- checkBox -->
      <div class="mb-3">
        주변정보
        <div class="cover">
          <div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label class="form-check-label" for="flexCheckDefault">
                편의점
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label class="form-check-label" for="flexCheckChecked">
                대형마트
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label class="form-check-label" for="flexCheckChecked">
                초등학교
              </label>
            </div>
          </div>
          <div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label class="form-check-label" for="flexCheckChecked">
                중학교
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label class="form-check-label" for="flexCheckChecked">
                고등학교
              </label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
              />
              <label class="form-check-label" for="flexCheckChecked">
                버스정류장
              </label>
            </div>
          </div>
        </div>
      </div>
      <div>설명<br /><textarea></textarea></div>
    </div>
  </div>
</template>

<style scoped>
.cover {
  display: flex;
  justify-content: space-around;
}
</style>
