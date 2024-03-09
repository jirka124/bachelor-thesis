<script>
import { defineComponent } from "vue";
import FieldInput from "@/components/admin/FieldInput.vue";
import { mapStores } from "pinia";
import { useAdminStore } from "@/stores/admin";

export default defineComponent({
  name: "ProductRow",
  components: { FieldInput },
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      FIELDS: [
        {
          name: "id",
          input: { placeholder: "4568", disabled: true },
          newValue: this.product ? this.product.id : "",
          needSave: false,
        },
        {
          name: "name",
          input: {
            type: "text",
            placeholder: "Plot of Domestic Violance",
          },
          newValue: this.product ? this.product.name : "",
          needSave: false,
        },
        {
          name: "description",
          input: {
            type: "text",
            placeholder: "Perfect gift for your new friend... The Viper",
          },
          newValue: this.product ? this.product.description : "",
          needSave: false,
        },
        {
          name: "price",
          input: { type: "number", placeholder: "45.89" },
          newValue: this.product ? this.product.price : "",
          needSave: false,
        },
      ],
      toggleOn: false,
      dragAndDropOver: false,
      uploadFile: null,
      uploadFileUrl: null,
    };
  },
  computed: {
    ...mapStores(useAdminStore),
    imageFileName() {
      if (!this.product && !this.uploadFile) return "EMPTY";
      return this.uploadFile ? this.uploadFile.name : `${this.product.id}.png`;
    },
    productUrlPath() {
      if (!this.product) return "data:,";
      return {
        png: `${import.meta.env.PLANT_LEVIT_SERVER_PUBLIC_PATH}/products/png/${this.product.id
          }.png`,
        webp: `${import.meta.env.PLANT_LEVIT_SERVER_PUBLIC_PATH}/products/webp/${this.product.id
          }.webp`,
      };
    },
    shownImageUrl() {
      return this.uploadFileUrl ? this.uploadFileUrl : this.productUrlPath.png;
    },
  },
  methods: {
    handleDragoverEvent(e) {
      e.preventDefault();
    },
    handleDropEvent(e) {
      e.preventDefault();

      let files = [];
      this.dragAndDropOver = false;

      if (e.dataTransfer.items) {
        files = [...e.dataTransfer.items]
          .map((item) => {
            if (item.kind === "file") return item.getAsFile();
          })
          .filter((file) => file);
      } else files = [...e.dataTransfer.files];
      this.handleFileUpload(files);
    },
    async handleFileUpload(files) {
      const file = files[0];
      this.uploadFile = file;
      this.uploadFileUrl = await this.getUploadFileUrl(file);
    },
    getUploadFileUrl(file) {
      const fr = new FileReader();
      return new Promise((resolve) => {
        fr.onload = function () {
          resolve(fr.result);
        };
        fr.readAsDataURL(file);
      });
    },
    saveStateChange(e) {
      const field = this.FIELDS.find((field) => field.name === e.name);
      if (field) {
        field.newValue = e.newValue;
        field.needSave = e.needSave;
      }
    },
    getProductValue(field) {
      if (!this.product) return undefined;
      return this.product[field];
    },
    async createProduct() {
      const name = this.FIELDS.find((field) => field.name === "name").newValue;
      const description = this.FIELDS.find((field) => field.name === "description")
        .newValue;
      const price = this.FIELDS.find((field) => field.name === "price").newValue;
      const formData = new FormData();
      formData.set("name", name);
      formData.set("description", description);
      formData.set("price", price);
      if (this.uploadFile) formData.set("file", this.uploadFile, this.uploadFile.name);
      let r;
      try {
        r = (
          await this.$api.post("admin/add-product", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        ).data;
        if (r.reqState !== null) console.log(r.reqState);
        else this.toggleOn = false;

        if (r.result.hasOwnProperty("product"))
          this.adminStore.addManageProducts([r.result.product]);
      } catch (error) {
        console.error(error);
      }
    },
    async saveProduct() {
      const id = this.FIELDS.find((field) => field.name === "id").newValue;
      const name = this.FIELDS.find((field) => field.name === "name").newValue;
      const description = this.FIELDS.find((field) => field.name === "description")
        .newValue;
      const price = this.FIELDS.find((field) => field.name === "price").newValue;
      const formData = new FormData();
      formData.set("id", id);
      formData.set("name", name);
      formData.set("description", description);
      formData.set("price", price);
      if (this.uploadFile) formData.set("file", this.uploadFile, this.uploadFile.name);
      let r;
      try {
        r = (
          await this.$api.post("admin/alter-product", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        ).data;
        if (r.reqState !== null) console.log(r.reqState);
        else this.uploadFile = null;

        if (r.result.hasOwnProperty("product"))
          this.adminStore.alterManageProducts([r.result.product]);
      } catch (error) {
        console.error(error);
      }
    },
    async deleteProduct() {
      const id = this.FIELDS.find((field) => field.name === "id").newValue;
      const body = {
        id,
      };
      let r;
      try {
        r = (await this.$api.post("admin/del-product", body)).data;
        if (r.reqState !== null) console.log(r.reqState);

        if (r.result.hasOwnProperty("product"))
          this.adminStore.delManageProducts([r.result.product]);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>

<template>
  <tr>
    <template v-if="product">
      <td class="tbl-col">
        <div class="tbl-col-field">{{ product.id }}</div>
      </td>
      <td class="tbl-col">
        <div class="tbl-col-field">{{ product.name }}</div>
      </td>
      <td class="tbl-col">
        <div class="tbl-col-btns">
          <div class="tbl-col-btn" @click="toggleOn = !toggleOn">
            <i class="fa-solid fa-pen"></i>
          </div>
          <div class="tbl-col-btn" @click="deleteProduct">
            <i class="fa-solid fa-trash"></i>
          </div>
        </div>
      </td>
    </template>
    <template v-else>
      <td class="tbl-col" colspan="2">
        <div class="tbl-col-field">CREATE NEW</div>
      </td>
      <td class="tbl-col">
        <div class="tbl-col-btn" @click="toggleOn = !toggleOn">
          <i class="fa-solid fa-plus"></i>
        </div>
      </td>
    </template>
  </tr>
  <tr v-if="toggleOn">
    <td colspan="400">
      <div class="edit-prod-row">
        <table>
          <FieldInput v-for="field in FIELDS" :key="field.name" :value="getProductValue(field.name)" :name="field.name"
            :input="field.input" :needSave="field.needSave" @saveStateChange="saveStateChange" />
        </table>
        <div class="edit-prod-row-avatar">
          <img @drop="handleDropEvent" @dragover="handleDragoverEvent" @dragenter="dragAndDropOver = true"
            @dragleave="dragAndDropOver = false" :src="shownImageUrl" alt="current avatar image" width="350"
            height="350" :class="{ dragged: dragAndDropOver }" />
          <div>
            <span>{{ imageFileName }}</span>
            <i v-show="!uploadFile" class="fa-solid fa-floppy-disk"></i>
            <i v-show="uploadFile" class="fa-regular fa-floppy-disk"></i>
          </div>
        </div>
        <div class="edit-prod-row-interact">
          <button v-if="product" @click="saveProduct">
            SAVE <i class="fa-solid fa-pen"></i>
          </button>
          <button v-else @click="createProduct">
            CREATE <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.tbl-col {
  padding: 0 4px;
}

.tbl-col-field {
  padding: 8px;
  border: 1px solid rgb(128, 128, 128);
  border-radius: 8px;
}

.tbl-col:nth-of-type(even) .tbl-col-field {
  background-color: #ebfdec;
}

.tbl-col-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tbl-col-btn {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px 0px rgba(100, 100, 100, 0.5);
  color: black;
  cursor: pointer;
  transition: 0.2s all;
}

.tbl-col-btn:hover {
  background-color: #f2f2f2;
}

.edit-prod-row {
  display: flex;
  flex-wrap: wrap;
  padding: 16px 0;
}

.edit-prod-row * {
  font-size: 18px;
}

.edit-prod-row>table {
  border-spacing: 8px;
}

.edit-prod-row>table tr {}

.edit-prod-row>table tr>td {}

.edit-prod-row>div {}

.edit-prod-row-avatar {
  text-align: center;
  padding: 8px;
}

.edit-prod-row-avatar>img {
  width: 128px;
  height: 128px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  object-fit: cover;
}

.edit-prod-row-avatar>img.dragged {
  border: 2px dashed #388e3c;
}

.edit-prod-row-avatar>div {}

.edit-prod-row-avatar>div>span {
  padding-right: 8px;
}

.edit-prod-row-interact {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
}

.edit-prod-row-interact>button {
  font-size: 15px;
  color: white;
  background-color: #388e3c;
  padding: 4px 20px;
  border: none;
  border-radius: 16px;
  box-shadow: 0px 2px 4px 0px #7f646464;
  cursor: pointer;
}
</style>
