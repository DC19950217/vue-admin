<template>
  <div>
    <p>
      <ul>
        <li v-for="item in testData.item" :key="item.id">{{item.category_name}}
          <button @click="edit({data:item})">编辑</button>
        </li>
      </ul>
    </p>
    <input type="text" v-model="form.categoryName" />
    <button @click="test">测试</button>
  </div>
</template>
<script>
export default {
  name: "Console",
  data: () => {
    return {
      message: "",
      testData:{
        item:[
        { id:1,category_name: "111" },
        { id:2,category_name: "222" },
        { id:3,category_name: "333" },
        { id:4,category_name: "444" },
        { id:5,category_name: "555" }
        ],
        current:[]
      },
      form:{
        categoryName:''
      }

    };
  },
  methods: {
    test() {
     this.testData.current.category_name = this.form.categoryName;
    },
    edit(params){
       console.log(params);
       this.form.categoryName = params.data.category_name;
       this.testData.current = params.data;
    }
  }
};
</script>
<style lang="scss" scoped></style>
