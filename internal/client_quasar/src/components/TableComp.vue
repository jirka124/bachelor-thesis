<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TableComp",
  props: {
    config: {
      type: Object,
      default() {
        return {
          allowNew: null,
          control: null,
          data: null
        }
      }
    }
  },
  data() {
    return {
      page: 0,
      srchVal: "",
      sortByField: "id"
    }
  },
  computed: {
    usedConfig() {
      const conf = {
        allowNew: this.config.allowNew || false,
        pagination: this.config.pagination || 10,
        control: this.config.control || [
          {
            name: "id",
            displayName: "ID"
          },
          {
            name: "def",
            displayName: "Default Column"
          },
          {
            name: "act1",
            type: "button",
            displayName: ""
          }
        ],
        data: this.config.data || [
          {
            id: 1,
            def: "GG",
            act1: {
              ico: "fa-solid fa-pen",
              event: "def-act",
              eventParams: {}
            }
          },
          {
            id: 2,
            def: "GG",
            act1: null
          }
        ]
      }

      return conf;
    },
    filteredData() {
      let filtered = this.usedConfig.data.filter(data => String(data.id).startsWith(this.srchVal));

      return filtered.toSorted((a, b) => {
        const aa = a[this.sortByField];
        const bb = b[this.sortByField];

        if (aa < bb) return -1;
        else if (bb > aa) return 1;
        return 0;
      })
    },
    onPageData() {
      const startInd = this.page * this.usedConfig.pagination;
      const endInd = startInd + this.usedConfig.pagination;
      const onPageArr = this.filteredData.slice(startInd, endInd);

      return onPageArr;
    },
    sortColumnName() {
      return this.usedConfig.control.find(ctrl => ctrl.name === this.sortByField).displayName || "NONE";
    },
    controlFields() {
      return this.usedConfig.control.reduce((arr, ctrl) => {
        arr.push(ctrl.name);
        return arr;
      }, [])
    },
    sortableControlFields() {
      return this.usedConfig.control.filter(ctrl => ctrl.type !== "button");
    },
    minPage() {
      return 0;
    },
    maxPage() {
      return Math.ceil(this.usedConfig.data.length / this.usedConfig.pagination) - 1;
    }
  },
  methods: {
    movePage(p) {
      if (p === "prev") this.page = Math.max(0, --this.page);
      else if (p === "next") this.page = Math.min(this.maxPage, ++this.page);
    }
  }
});
</script>

<template>
  <div class="table">
    <div class="table-head">
      <div class="table-head-srch iconed-in">
        <i class="fa-solid fa-magnifying-glass in-ico"></i>
        <input v-model="srchVal" class="in" type="text" placeholder="">
      </div>
      <div class="table-head-sort">
        <p>Sort by</p>
        <div class="table-head-sort-by">
          <select v-model="sortByField">
            <option v-for="col in sortableControlFields" :key="col.name" :value="col.name">{{ col.displayName }}</option>
          </select>
        </div>
      </div>
      <button v-show="usedConfig.allowNew" @click="$emit('create-new')" class="table-head-new">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <div class="table-list scroll">
      <table class="table-list-tbl">
        <tr class="table-list-tbl-row">
          <th v-for="head in usedConfig.control" :key="head.name">{{ head.displayName }}</th>
        </tr>
        <tr class="table-list-tbl-row" v-for="d in onPageData" :key="d.id">
          <td v-for="field in controlFields" :key="String(d.id) + field">
            <template v-if="d[field] === null"></template>
            <template v-else-if="typeof d[field] === 'object'">
              <button @click="$emit(d[field].event, d[field].eventParams)"><i :class="d[field].ico"></i></button>
            </template>
            <template v-else>{{ d[field] }}</template>
          </td>
        </tr>
      </table>
    </div>
    <div class="table-pagi">
      <i @click="movePage('prev')" class="fa-solid fa-angle-left"></i>
      <div class="table-pagi-opt">
        <button>{{ page > minPage ? page - 1 + 1 : '' }}</button>
        <button class="active">{{ page + 1 }}</button>
        <button>{{ page < maxPage ? page + 1 + 1 : '' }}</button>
      </div>
      <i @click="movePage('next')" class="fa-solid fa-angle-right"></i>
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

.table-head-sort-by>select {
  border: none;
  outline: none;
  cursor: pointer;
}

.table-head-sort-by:focus-within {
  outline: 2px solid #333;
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

.table-list-tbl-row>td>:deep(button) {
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

.table-list-tbl-row>td>:deep(button>i) {
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
