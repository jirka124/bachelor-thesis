<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "StockFilter",
  emits: ["changeSrchVal", "changeSortType"],
  props: {
    currentSrchVal: {
      type: String,
      default: "",
    },
    currentSortVal: {
      type: String,
      default: "feat",
    },
  },
  data() {
    return {
      AVAIL_SORTS: [
        { key: "feat", value: "Featured" },
        { key: "sell", value: "Best Selling" },
        { key: "aplha-a", value: "Alphabetically, A-Z" },
        { key: "aplha-z", value: "Alphabetically, Z-A" },
        { key: "price-low", value: "Price, low to high" },
        { key: "price-high", value: "Price, high to low" },
      ],
      isBarOn: false,
      searchVal: this.currentSrchVal,
      sortVal: this.currentSortVal,
    };
  },
  computed: {
    currentSortText() {
      const sortObj = this.AVAIL_SORTS.find((avail) => avail.key === this.sortVal);
      return sortObj ? sortObj.value : "ERROR";
    },
  },
  watch: {
    searchVal(newVal) {
      this.$emit("changeSrchVal", newVal);
    },
    sortVal(newVal) {
      this.$emit("changeSortType", newVal);
    },
  },
  methods: {
    setSortVal(sortKey) {
      this.sortVal = sortKey;
    },
  },
});
</script>

<template>
  <div id="stock-filter">
    <div id="filter-srch">
      <input type="text" placeholder="Search..." v-model="searchVal" />
      <button>
        <i class="fa-solid fa-arrow-right-long"></i>
      </button>
    </div>
    <div id="filter-sort">
      <b>Sort by:</b> {{ currentSortText }}
      <button @click="isBarOn = !isBarOn">
        <i class="fa-solid fa-circle-chevron-down"></i>
      </button>
    </div>
    <div id="filter-sort-bar" v-show="isBarOn">
      <button v-for="sort in AVAIL_SORTS" :key="sort.key" @click="setSortVal(sort.key)">
        {{ sort.value }}
      </button>
    </div>
  </div>
</template>

<style scoped>
#stock-filter {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2vh 0;
}
#filter-srch {
  display: flex;
  max-width: 300px;
  border-bottom: 2px solid #757575;
  background-color: white;
}
#filter-srch > input,
#filter-srch > button {
  background-color: transparent;
  border: none;
  outline: none;
  height: 32px;
}
#filter-srch > input {
  display: block;
  padding-left: 6px;
  width: calc(100% - 32px);
}
#filter-srch > button {
  width: 32px;
  height: 32px;
  cursor: pointer;
}
#filter-srch > button > i {
  color: #757575;
}
#filter-sort {
}
#filter-sort > b {
}
#filter-sort > button {
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: none;
  outline: none;
  cursor: pointer;
}
#filter-sort > button > i {
  font-size: 18px;
  color: #757575;
}
#filter-sort-bar {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  min-width: 200px;
  padding: 8px 12px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgba(100, 100, 100, 0.498);
  transform: translateY(90%);
}
#filter-sort-bar > button {
  text-align: left;
  color: #979797;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 0.2s;
}
#filter-sort-bar > button:hover {
  color: black;
}

@media only screen and (max-width: 500px) {
  #filter-srch {
    width: 100%;
    max-width: none;
  }
  #filter-sort {
    width: 100%;
  }
  #filter-sort-bar {
    width: 100%;
    min-width: none;
  }
}
</style>
