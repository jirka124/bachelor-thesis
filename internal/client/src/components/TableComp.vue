<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TableComp",
});
</script>

<template>
  <div class="table">
    <div class="table-head">
      <div class="table-head-srch iconed-in">
        <i class="fa-solid fa-magnifying-glass in-ico"></i>
        <input class="in" type="text" placeholder="">
      </div>
      <div class="table-head-sort">
        <p>Sort by</p>
        <div class="table-head-sort-by">
          <p>created</p>
          <i class="fa-solid fa-angle-down"></i>
        </div>
      </div>
      <button class="table-head-new">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <div class="table-list scroll">
      <table class="table-list-tbl">
        <tr class="table-list-tbl-row">
          <th>ID</th>
          <th>Subject</th>
          <th>Day</th>
          <th>Time - by</th>
          <th>Time - till</th>
          <th>Recurrence</th>
          <th>Continuance - by</th>
          <th>Continuance - till</th>
          <th></th>
        </tr>
        <tr class="table-list-tbl-row">
          <td>1</td>
          <td>OSW1</td>
          <td>Monday</td>
          <td>14:30</td>
          <td>15:45</td>
          <td>Every week</td>
          <td>20.9.2001</td>
          <td>15.6.2002</td>
          <td><button><i class="fa-solid fa-eye"></i></button></td>
        </tr>
        <tr class="table-list-tbl-row" v-for="i in new Array(10)" :key="i">
          <td>1</td>
          <td>OSW1</td>
          <td>Monday</td>
          <td>14:30</td>
          <td>15:45</td>
          <td>Every week</td>
          <td>20.9.2001</td>
          <td>15.6.2002</td>
          <td><button><i class="fa-solid fa-eye"></i></button></td>
        </tr>
      </table>
    </div>
    <div class="table-pagi">
      <i class="fa-solid fa-angle-left"></i>
      <div class="table-pagi-opt">
        <button>1</button>
        <button class="active">2</button>
        <button>3</button>
      </div>
      <i class="fa-solid fa-angle-right"></i>
    </div>
  </div>
</template>

<style scoped>
.table {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  flex-grow: 1;
}

.table-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.table-head-srch {
  flex-grow: 1;
}

.table-head-srch .in {
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0% 0%, rgba(255, 255, 255, 0) 100% 100%);
  border: none;
}

.table-head-sort {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-head-sort>p {}

.table-head-sort-by {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}

.table-head-sort-by>p {}

.table-head-sort-by>i {}

.table-head-new {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  color: white;
  background-color: #0097A7;
  cursor: pointer;
}

.table-list {
  flex-grow: 1;
  padding: 8px;
  border-radius: 8px;
  background-color: white;
  overflow-x: auto;
}

.table-list-tbl {}

.table-list-tbl-row {}

.table-list-tbl-row>th,
.table-list-tbl-row>td {
  text-align: left;
  padding: 6px 12px;
}

.table-list-tbl-row>th {
  font-weight: normal;
  color: #BDBDBD;
}

.table-list-tbl-row>td {}

.table-list-tbl-row>td>button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background-color: #0097A7;
  cursor: pointer;
}

.table-list-tbl-row>td>button>i {
  color: white;
}

.table-pagi {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.table-pagi>i {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.table-pagi>i:hover {
  background-color: #d9d9d9;
}

.table-pagi-opt {
  display: flex;
  align-items: center;
  column-gap: 4px;
}

.table-pagi-opt>button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.table-pagi-opt>button:hover {
  background-color: #d9d9d9;
}

.table-pagi-opt>button.active {
  color: white;
  background-color: #00BCD4;
}
</style>
