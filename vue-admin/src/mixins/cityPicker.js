import {
  GetCityPicker
} from "@/api/common";
import {
  reactive,
  toRefs
} from "@vue/composition-api";
export default function cityPicker() {
  const data = reactive({
    provinceData: [],
    cityData: [],
    areaData: [],
    streetData: [],
    provinceValue: "",
    cityValue: "",
    areaValue: "",
    streetValue: ""
  });
  const resultData = reactive({
    provinceValue: "",
    cityValue: "",
    areaValue: "",
    streetValue: ""
  })
  // 获取省份
  const getProvince = () => {
    getData({
      type: "province"
    })
  };
  // 选择省份、获取城市
  const handlerProvince = val => {
    resetValue({
      type: 'city'
    });
    getData({
      type: "city",
      province_code: val
    })
  };
  // 选择城市、获取区县
  const handlerCity = val => {
    resetValue({
      type: 'area'
    });
    getData({
      type: "area",
      city_code: val
    })
  };
  // 选择区县、获取街道
  const handlerArea = val => {
    resetValue({
      type: 'street'
    });
    getData({
      type: "street",
      area_code: val
    })
  };
  // 选择街道
  const handlerStreet = val => {
    resetValue({
      type: ''
    });
  };
  /**
   * 获取数据
   * @param {*} requestData 
   */
  const getData = (requestData) => {
    GetCityPicker(requestData)
      .then(response => {
        let result = response.data.data.data;
        data[`${requestData.type}Data`] = result;
      })
      .catch(error => {});
  }


  // 重置选项
  const resetValue = (params) => {
    const valueJson = {
      city: ["cityValue", "areaValue", "streetValue"],
      area: ["areaValue", "streetValue"],
      street: ["streetValue"]
    }
    const arrObj = valueJson[params.type]
    if (arrObj) {
      arrObj.forEach(item => {
        data[item] = ""
      })
    }
    // 数据集合
    result()
  }
  /* 
  返回数据集合
  */
  const result = () => {
    for (const key in resultData) {
      resultData[key] = data[key]
    }
  }
  return {
    // ...toRefs(data),//把对象类型转为基础数据类型，可进行解构响应
    data,
    resultData,
    getProvince,
    handlerProvince,
    handlerCity,
    handlerArea,
    handlerStreet
  }
}